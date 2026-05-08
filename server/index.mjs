import { app, ensureDatabaseInitialized } from './app.mjs';

const port = Number(process.env.PORT ?? 3001);

ensureDatabaseInitialized()
  .then(() => {
    app.listen(port, '0.0.0.0', () => {
      console.log(`Pre-sales report API listening on ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to initialize database', error);
    process.exit(1);
  });
