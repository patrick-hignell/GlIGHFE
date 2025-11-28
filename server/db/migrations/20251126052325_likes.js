/**
 * @param {import('knex').Knex} knex
 */
export async function up(knex) {
  return knex.schema.createTable('likes', (table) => {
    table.increments('id').primary()
    table
      .string('user_id')
      .notNullable()
      .references('users.id')
      .onDelete('CASCADE')
    table.integer('post_id').references('posts.id').onDelete('CASCADE')
    table.integer('reply_id').references('comments.id').onDelete('CASCADE')
  })
}

export async function down(knex) {
  return knex.schema.dropTable('likes')
}
