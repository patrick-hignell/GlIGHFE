/**
 * @param {import('knex').Knex} knex
 */
export async function up(knex) {
  return knex.schema.createTable('followers', (table) => {
    table
      .string('follower_id')
      .notNullable()
      .references('users.auth_id')
      .onDelete('CASCADE')
    table
      .string('following_id')
      .notNullable()
      .references('users.auth_id')
      .onDelete('CASCADE')
    table.primary(['follower_id', 'following_id'])
  })
}

/**
 * @param {import('knex').Knex} knex
 */
export async function down(knex) {
  return knex.schema.dropTable('followers')
}
