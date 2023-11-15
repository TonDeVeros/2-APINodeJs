import fastify from "fastify";
import cookie from "@fastify/cookie";

import { knex } from "./database";
import { env } from "./env";
import { transactionRoutes } from "./routes/transactions";

const app = fastify();

// importar cookies antes das rotas para podermos usar nelas
app.register(cookie)

app.register(transactionRoutes,{
  prefix: 'transactions'
})

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log("http server running");
  });
