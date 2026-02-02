require('dotenv').config();
const createServer = require('./src/server');

const start = async () => {
  const server = await createServer();
  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

start();
