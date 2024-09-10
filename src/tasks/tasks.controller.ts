import {
	Controller,
	Body,
	Post,
	Get,
	Patch,
	Param,
	ParseIntPipe,
	UseGuards
} from "@nestjs/common"
import { TasksService } from "./tasks.service"
import { Task } from "@prisma/client"
import { CreateTaskDto } from "./dtos/create-task.dto"
import { UpdateTaskDto } from "./dtos/update-task.dto"
import { JwtAccessGuard } from "src/auth/guards/jwt-access.guard"
import { CurrentUser } from "src/utils/decorators/current-user"

@UseGuards(JwtAccessGuard)
@Controller("tasks")
export class TasksController {
	constructor(private readonly tasksService: TasksService) {}

	@Get()
	async get(@CurrentUser("id", ParseIntPipe) userId: number): Promise<Task[]> {
		return await this.tasksService.get(userId)
	}

	@Post()
	async createOne(
		@Body() dto: CreateTaskDto,
		@CurrentUser("id", ParseIntPipe) userId: number
	): Promise<Task> {
		return await this.tasksService.createOne(dto, userId)
	}

	@Patch(":id")
	async updateOne(
		@Param("id", ParseIntPipe) id: number,
		@Body() dto: UpdateTaskDto,
		@CurrentUser("id", ParseIntPipe) userId: number
	): Promise<Task> {
		return await this.tasksService.updateOne(id, dto, userId)
	}

	@Patch(":id")
	async deleteOne(
		@Param("id", ParseIntPipe) id: number,
		@CurrentUser("id", ParseIntPipe) userId: number
	): Promise<Task> {
		return await this.tasksService.deleteOne(id, userId)
	}
}
