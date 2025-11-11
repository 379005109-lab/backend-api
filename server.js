// Wrapper to start the new server
import('./server/src/server.js').catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
