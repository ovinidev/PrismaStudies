import { Router } from 'express';
import { coursesRoutes } from './courses.routes';
import { teachersRoutes } from './teachers.routes';

export const routes = Router();

routes.use('/courses', coursesRoutes);
routes.use('/teachers', teachersRoutes);
