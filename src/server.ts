import app, { initializeAPI } from "./app";

const port = process.env.PORT || 3000;

async function startServer() {
  await initializeAPI();
  app.listen(port, () => console.log(`API Up on port ${port}`));
}

startServer().catch(console.error);
