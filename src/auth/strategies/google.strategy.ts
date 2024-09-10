import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { AuthService } from "../auth.service"
import { Profile, Strategy } from "passport-google-oauth20"
import { ConfigService } from "@nestjs/config"

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService
	) {
		super({
			clientID: configService.getOrThrow("GOOGLE_CLIENT_ID"),
			clientSecret: configService.getOrThrow("GOOGLE_CLIENT_SECRET"),
			callbackURL: "http://localhost:3000/auth/google/callback",
			scope: ["email"]
		})
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: Profile,
		done: any
	) {
		done(null, profile._json.email)
	}
}
