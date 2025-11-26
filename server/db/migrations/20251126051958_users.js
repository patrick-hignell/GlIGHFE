/**
 * @param {import('knex').Knex} knex
 */
export async function up(knex) {
  return knex.schema.createTable('users', (table) => {
    table.integer('id').primary()
    table.string('name').notNullable()
    table.string('bio')
    table.string('font')
    table.string('profile_picture')
  })
}

export async function down(knex) {
  return knex.schema.dropTable('users')
}
