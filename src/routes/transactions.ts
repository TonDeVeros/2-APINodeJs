// aprendendo a utilizar plugins do fastify

import { FastifyInstance } from "fastify";
import { z } from "zod"; //zod vai validar os tipos do request
import { knex } from "../database";
import { randomUUID } from "crypto";

export async function transactionRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    const transactions = await knex("transactions").select();

    return {
      transactions,
    };
  });

  app.get("/:id", async (request) => {
    const getTransactionParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = getTransactionParamsSchema.parse(request.params);

    const transaction = await knex("transactions").where("id", id).first();

    return transaction;
  });

  app.get("/summary", async () => {
    const summary = await knex("transactions").sum("amount", { as: "am" });

    return {
      summary,
    };
  });

  app.post("/", async (request, reply) => {
    const createTransactionBodySchema = z.object({
      title: z.string(),
      amount: z.number(),
      type: z.enum(["credit", "debit"]),
    });

    const { title, amount, type } = createTransactionBodySchema.parse(
      request.body
    );

    let sessionId = request.cookies.sessionId;

    if (!sessionId) {
      sessionId = randomUUID();

      reply.cookie("sessionId", sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7 //7 days
      });
    }

    await knex("transactions").insert({
      id: randomUUID(),
      title,
      amount: type === "credit" ? amount : amount * -1,
      session_id: sessionId
    });

    return reply.status(201).send();
  });
}
