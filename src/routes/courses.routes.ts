import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../services/prismaClient';

export const coursesRoutes = Router();

coursesRoutes.get('/', async (req, res) => {
	const { page, pageLength } = req.query;

	if (page && pageLength) {
		const itensForSkip = (Number(page) - 1) * Number(pageLength);

		const courses = await prisma.courses.findMany({
			include: {
				teacher: true,
			},
			orderBy: {
				name: 'asc',
			},
			take: Number(pageLength),
			skip: Number(itensForSkip),
		});

		return res.json({ courses });
	}

	const courses = await prisma.courses.findMany({
		include: {
			teacher: true,
		},
		orderBy: {
			name: 'asc',
		},
	});

	return res.json({ courses });
});

coursesRoutes.post('/', async (req, res) => {
	try {
		const createCourseBody = z.object({
			name: z
				.string({ required_error: 'Name is required' })
				.min(3, { message: 'Name must be at least 3 characters' }),
			description: z.string({ required_error: 'Description is required' }),
			duration: z.number({ required_error: 'Duration is required' }),
		});

		const { description, duration, name } = createCourseBody.parse(req.body);

		const courseAlreadyExists = await prisma.courses.findUnique({
			where: {
				name,
			},
		});

		if (courseAlreadyExists) {
			return res.status(400).json({ error: 'Course already exists' });
		}

		const course = await prisma.courses.create({
			data: {
				name,
				description,
				duration,
			},
		});

		return res.json({ course });
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

coursesRoutes.put('/:id', async (req, res) => {
	try {
		const createCourseBody = z.object({
			name: z
				.string({ required_error: 'Name is required' })
				.min(3, { message: 'Name must be at least 3 characters' }),
			description: z.string({ required_error: 'Description is required' }),
			duration: z.number({ required_error: 'Duration is required' }),
		});

		const { description, duration, name } = createCourseBody.parse(req.body);

		const { id } = req.params;

		const courseAlreadyExists = await prisma.courses.findUnique({
			where: {
				name,
			},
		});

		if (courseAlreadyExists) {
			return res.status(400).json({ error: 'Course already exists' });
		}

		const course = await prisma.courses.update({
			where: {
				id,
			},
			data: {
				name,
				description,
				duration,
			},
		});

		return res.json({ course });
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

coursesRoutes.delete('/:id', async (req, res) => {
	const { id } = req.params;

	await prisma.courses.delete({
		where: {
			id,
		},
	});

	return res.json({ message: 'Deleted' });
});
