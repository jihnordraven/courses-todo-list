import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { User } from "@prisma/client"

export const CurrentUser = createParamDecorator(
	(key: keyof User, ctx: ExecutionContext) => {
		const req = ctx.switchToHttp().getRequest()

		return key ? req.user[key] : req.user
	}
)
