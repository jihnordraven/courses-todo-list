import { Injectable, NotFoundException } from "@nestjs/common"
import { Task } from "@prisma/client"
import { PrismaService } from "prisma/prisma.service"
import { CreateTaskDto } from "./dtos/create-task.dto"
import { UpdateTaskDto } from "./dtos/update-task.dto"

@Injectable()
export class TasksService {
	constructor(private readonly prismaService: PrismaService) {}

	async get(): Promise<Task[]> {
		return await this.prismaService.task.findMany()
	}

	async createOne(dto: CreateTaskDto) {
		const createdTask = await this.prismaService.task.create({
			data: dto
		})

		return createdTask
	}

	async updateOne(id: number, dto: UpdateTaskDto) {
		await this.getOneOrThrow(id)

		const deletedTask = await this.prismaService.task.update({
			where: { id },
			data: dto
		})

		return deletedTask
	}

	async deleteOne(id: number) {
		await this.getOneOrThrow(id)

		const updatedTask = await this.prismaService.task.delete({ where: { id } })

		return updatedTask
	}

	// Private methods
	private async getOneOrThrow(id: number): Promise<Task> {
		const task = await this.prismaService.task.findUnique({ where: { id } })

		if (!task) {
			throw new NotFoundException("Could not find any task")
		}

		return task
	}
}
