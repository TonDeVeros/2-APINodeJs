import { Knex } from "knex";

//up o que o migration vai fazer
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("transactions", (table) => {
    table.uuid("id").primary();
    table.text("title").notNullable();
    table.decimal("amount", 10, 2).notNullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now()).notNullable();
  });
}

//se precisar fazer go back
export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("transactions");
}
