import { Controller, Body, Post, Get, Patch, Param, ParseIntPipe } from "@nestjs/common"
import { TasksService } from "./tasks.service"
import { Task } from "@prisma/client"
import { CreateTaskDto } from "./dtos/create-task.dto"
import { UpdateTaskDto } from "./dtos/update-task.dto"

@Controller("tasks")
export class TasksController {
	constructor(private readonly tasksService: TasksService) {}

	@Get()
	async get(): Promise<Task[]> {
		return await this.tasksService.get()
	}

	@Post()
	async createOne(@Body() dto: CreateTaskDto): Promise<Task> {
		return await this.tasksService.createOne(dto)
	}

	@Patch(":id")
	async updateOne(
		@Param("id", ParseIntPipe) id: number,
		@Body() dto: UpdateTaskDto
	): Promise<Task> {
		return await this.tasksService.updateOne(id, dto)
	}

	@Patch(":id")
	async deleteOne(@Param("id", ParseIntPipe) id: number): Promise<Task> {
		return await this.tasksService.deleteOne(id)
	}
}
