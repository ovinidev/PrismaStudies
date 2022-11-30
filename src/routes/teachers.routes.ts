import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../services/prismaClient';

export const teachersRoutes = Router();

teachersRoutes.get('/', async (req, res) => {
	const { page, pageLength } = req.query;

	if (page && pageLength) {
		const itensForSkip = (Number(page) - 1) * Number(pageLength);

		const teachers = await prisma.teachers.findMany({
			include: {
				course: true,
			},
			take: Number(pageLength),
			skip: itensForSkip,
		});

		return res.json({ teachers });
	}

	const teachers = await prisma.teachers.findMany({
		include: {
			course: true,
		},
	});

	return res.json({ teachers });
});

teachersRoutes.get('/:id', async (req, res) => {
	const { id } = req.params;

	const teacher = await prisma.teachers.findUnique({
		where: {
			id,
		},
		include: {
			course: true,
		},
	});

	return res.json({ teacher });
});

teachersRoutes.post('/', async (req, res) => {
	try {
		const createCourseBody = z.object({
			name: z
				.string({ required_error: 'Name is required' })
				.min(3, { message: 'Name must be at least 3 characters' }),
		});

		const { name } = createCourseBody.parse(req.body);

		const teacher = await prisma.teachers.create({
			data: {
				name,
			},
		});

		return res.json({ teacher });
	} catch (err) {
		if (err instanceof z.ZodError) {
			const error = err.issues[0].message;
			return res.status(400).json({
				message: error,
			});
		}
		return res.status(400).json({ err: err.message });
	}
});

teachersRoutes.delete('/:id', async (req, res) => {
	const { id } = req.params;

	await prisma.teachers.delete({
		where: {
			id,
		},
	});

	return res.json({ message: 'Teacher deleted' });
});
