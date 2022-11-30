import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

export function ensureErrors(
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction,
) {
	if (err instanceof z.ZodError) {
		const error = err.issues[0].message;
		return res.status(400).json({
			message: error,
		});
	}

	console.log('oi');

	next();
}
