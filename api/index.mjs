import { app, ensureDatabaseInitialized } from '../server/app.mjs';

export default async function handler(request, response) {
  try {
    await ensureDatabaseInitialized();
    return app(request, response);
  } catch (error) {
    console.error('Failed to initialize database', error);
    return response.status(503).json({
      ok: false,
      storage: 'postgres',
      message: error.message ?? 'Database is unavailable',
    });
  }
}
