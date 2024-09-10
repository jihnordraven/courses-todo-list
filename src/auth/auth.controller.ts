import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	ParseIntPipe,
	Res,
	UseGuards,
	Req
} from "@nestjs/common"
import { AuthService } from "./auth.service"
import { RegisterDto } from "./dtos/register.dto"
import { CurrentUser } from "src/utils/decorators/current-user"
import { Response } from "express"
import { AuthGuard } from "@nestjs/passport"
import { GoogleGuard } from "./guards/google.guard"
import { Profile } from "passport-google-oauth20"

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("register")
	async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
		return await this.authService.register(dto, res)
	}

	@UseGuards(AuthGuard("local"))
	@Post("login")
	async login(
		@CurrentUser("id", ParseIntPipe) userId: number,
		@Res({ passthrough: true }) res: Response
	) {
		return await this.authService.generateTokens(userId, res)
	}

	@UseGuards(AuthGuard("jwt-refresh"))
	@Post("refresh")
	async refresh(
		@CurrentUser("id", ParseIntPipe) userId: number,
		@Res({ passthrough: true }) res: Response
	) {
		return await this.authService.generateTokens(userId, res)
	}

	@Post("logout")
	async logout(@Res({ passthrough: true }) res: Response) {
		res.cookie("refreshToken", "")
	}

	// Google auth
	@UseGuards(GoogleGuard)
	@Get("google")
	google() {}

	@UseGuards(GoogleGuard)
	@Get("google/callback")
	async googleCallback(
		@Req() req: Request & { user: Profile },
		@Res({ passthrough: true }) res: Response
	) {
		return await this.authService.googleAuth(req.user._json.email, res)
	}
}
