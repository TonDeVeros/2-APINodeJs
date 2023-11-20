import fastify from "fastify";
import cookie from "@fastify/cookie";


import { transactionRoutes } from "./routes/transactions";

export const app = fastify();

// importar cookies antes das rotas para podermos usar nelas
app.register(cookie)

app.register(transactionRoutes,{
  prefix: 'transactions'
})