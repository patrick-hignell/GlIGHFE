/**
 * @param {import('knex').Knex} knex
 */
export async function up(knex) {
  return knex.schema.createTable('posts', (table) => {
    table.increments('id').primary()
    table
      .string('user_id')
      .notNullable()
      .references('users.auth_id')
      .onDelete('CASCADE')
    table.timestamp('date_added').notNullable().defaultTo(knex.fn.now())
    table.string('message')
    table.string('image')
    table.string('font')
    table.integer('char_limit')
    table.boolean('public').notNullable().defaultTo(true)
  })
}

export async function down(knex) {
  return knex.schema.dropTable('posts')
}
