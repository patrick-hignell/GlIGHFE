/**
 * @param {import('knex').Knex} knex
 */
export async function up(knex) {
  return knex.schema.createTable('comments', (table) => {
    table.increments('id').primary()
    table
      .integer('post_id')
      .notNullable()
      .references('posts.id')
      .onDelete('CASCADE')
    table
      .string('user_id')
      .notNullable()
      .references('users.id')
      .onDelete('CASCADE')
    table.string('message')
    table.string('image')
    table.string('font')
  })
}

export async function down(knex) {
  return knex.schema.dropTable('comments')
}
