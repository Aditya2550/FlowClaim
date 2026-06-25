import http from "http";
import app from "./app.js";
import { env } from "./config/env.js";
import { initSockets } from "./sockets/index.js";

const server = http.createServer(app);
initSockets(server);

server.listen(env.PORT, () => {
  console.log(`Backend running on http://localhost:${env.PORT}`);
});
