import { BadRequestException, Injectable } from "@nestjs/common"
import { hash, verify } from "argon2"
import { UsersService } from "src/users/users.service"
import { RegisterDto } from "./dtos/register.dto"
import { Response } from "express"
import { ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService
	) {}

	async register({ email, password }: RegisterDto, res: Response) {
		const hashedPassword = await hash(password)

		const createdUser = await this.usersService.createOne({ email, hashedPassword })

		return await this.generateTokens(createdUser.id, res)
	}

	async googleAuth(email: string, res: Response) {
		const userByEmail = await this.usersService.getOne({ email })

		if (userByEmail) {
			return await this.generateTokens(userByEmail.id, res)
		}

		const createdUser = await this.usersService.createOne({ email })

		return await this.generateTokens(createdUser.id, res)
	}

	async generateTokens(userId: number, res: Response) {
		const accessToken = await this.jwtService.signAsync(
			{ userId },
			{
				secret: this.configService.getOrThrow("JWT_ACCESS_SECRET"),
				expiresIn: this.configService.getOrThrow("JWT_ACCESS_EXPIRES")
			}
		)

		const refreshToken = await this.jwtService.signAsync(
			{ userId },
			{
				secret: this.configService.getOrThrow("JWT_REFRESH_SECRET"),
				expiresIn: this.configService.getOrThrow("JWT_REFRESH_EXPIRES")
			}
		)

		res.cookie("refreshToken", refreshToken, {
			httpOnly: true,
			secure: true
		})

		return accessToken
	}

	async validateUser(email: string, password: string) {
		const userByEmail = await this.usersService.getOne({ email })

		if (!userByEmail) {
			return null
		}

		if (!userByEmail.hashedPassword) {
			throw new BadRequestException(
				"Probably you already have an account via google"
			)
		}

		const isValidPw = await verify(userByEmail.hashedPassword, password)

		if (!isValidPw) {
			return null
		}

		return userByEmail
	}
}
