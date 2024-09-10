import { Module } from "@nestjs/common"
import { TasksModule } from "./tasks/tasks.module"
import { PrismaModule } from "prisma/prisma.module"
import { UsersModule } from "./users/users.module"
import { AuthModule } from "./auth/auth.module"
import { ConfigModule } from "@nestjs/config"

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		PrismaModule,
		TasksModule,
		UsersModule,
		AuthModule
	]
})
export class AppModule {}
