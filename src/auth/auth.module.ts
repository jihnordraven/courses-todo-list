import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { LocalStrategy } from "./strategies/local.strategy"
import { JwtAccessStrategy } from "./strategies/jwt-access.strategy"
import { JwtRefreshStrategy } from "./strategies/jwt-refresh.strategy"
import { GoogleStrategy } from "./strategies/google.strategy"
import { UsersModule } from "src/users/users.module"
import { JwtModule } from "@nestjs/jwt"

@Module({
	imports: [UsersModule, JwtModule.register({})],
	controllers: [AuthController],
	providers: [
		AuthService,
		LocalStrategy,
		JwtAccessStrategy,
		JwtRefreshStrategy,
		GoogleStrategy
	]
})
export class AuthModule {}
