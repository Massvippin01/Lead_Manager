import { Router } from 'express';
import authRoutes from './auth.routes';
import leadRoutes from './lead.routes';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Meru Lead Manager API',
  });
});

router.use('/auth', authRoutes);
router.use('/leads', leadRoutes);

export default router;
