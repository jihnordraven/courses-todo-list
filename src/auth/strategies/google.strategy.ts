import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { AuthService } from "../auth.service"
import { Profile, Strategy } from "passport-google-oauth20"

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({
			clientID:
				"226634404321-2isqn0hre3mtfetmlvpk2lt6gfb9ccrh.apps.googleusercontent.com",
			clientSecret: "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",
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
