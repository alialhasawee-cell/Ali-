import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { tenantAndAuthMiddleware } from './server/middleware/auth';
import { authRouter } from './server/routes/authRoutes';
import { tenantRouter } from './server/routes/tenantRoutes';
import { aiRouter } from './server/routes/aiRoutes';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Global Tenant & Authentication Context Middleware
  app.use(tenantAndAuthMiddleware as any);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      platform: 'MR. FLUENCY SaaS',
      brand: 'MR. FLUENCY / أستاذ علي',
      version: '1.0.0-phase0',
      timestamp: new Date().toISOString(),
    });
  });

  // Mount API Routers
  app.use('/api/auth', authRouter);
  app.use('/api', tenantRouter);
  app.use('/api/ai', aiRouter);

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MR. FLUENCY SaaS] Multi-tenant Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
