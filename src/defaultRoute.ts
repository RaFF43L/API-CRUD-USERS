import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  return res
    .status(200)
    .send({ api: 'rf-autentication', version: '1.0.0', status: 'online' });
});

export { router as DefaultRouter };
