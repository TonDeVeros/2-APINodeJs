import { expect, test, beforeAll, afterAll, describe, it, beforeEach } from "vitest";
import { execSync } from 'node:child_process'//consigo executar comandos node do terminal
// import supertest from "supertest";
import request from "supertest";

import { app } from "../src/app";


describe("Transaction routes", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')//apaga o banco antes de qualquer teste
    execSync('npm run knex migrate:latest')//inicializa um banco de dados toda vez que um teste é executado
  } )

  // test("O usuario consegue criar uma nova transacao", () => {
  //   //fazer a chamada Http p criar uma nova transacao

  //   const responseStatusCode = 201;

  //   expect(responseStatusCode).toEqual(201);
  // });

  test("O usuario consegue criar uma nova transacao", async () => {
    //fazer a chamada Http p criar uma nova transacao

    const response = await request(app.server)
      .post("/transactions")
      .send({
        title: "New transaction",
        amount: 5000,
        type: "credit",
      })
      .expect(201);

    // expect(response.statusCode).toEqual(201);
  });

  it("should be able to list all transactions", async () => {
    //fazer a chamada Http p criar uma nova transacao

    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "New transaction",
        amount: 5000,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie");

    // console.log(cookies)

    const listTransactionsResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies)
      .expect(200);

      // console.log(listTransactionsResponse.body.transactions)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: "New transaction",
        amount: 5000,
      }),
    ]);

  });


  it("should be able to get a specific transaction", async () => {
    //fazer a chamada Http p criar uma nova transacao

    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "New transaction",
        amount: 5000,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie");


    const listTransactionsResponse = await request(app.server)
      .get("/transactions")
      .set("Cookie", cookies)
      .expect(200);

      const transactionId = listTransactionsResponse.body.transactions[0].id

      const getTransactionsResponse = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set("Cookie", cookies)
      .expect(200);

      // console.log(getTransactionsResponse.body)

    expect(getTransactionsResponse.body).toEqual(
      expect.objectContaining({
        title: "New transaction",
        amount: 5000,
      }),
    );

  });

  it.only("should be able to list the summary", async () => {
    //fazer a chamada Http p criar uma nova transacao

    const createTransactionResponse = await request(app.server)
      .post("/transactions")
      .send({
        title: "New transaction",
        amount: 5000,
        type: "credit",
      });

    const cookies = createTransactionResponse.get("Set-Cookie");

    await request(app.server)
      .post("/transactions")
      .set("Cookie", cookies)
      .send({
        title: "Debit transaction",
        amount: 2000,
        type: "debit",
      });

    const summaryResponse = await request(app.server)
      .get("/transactions/summary")
      .set("Cookie", cookies)
      .expect(200);


    expect(summaryResponse.body.summary).toEqual(
      {
        amount: 3000
      }
    );

  });

});
