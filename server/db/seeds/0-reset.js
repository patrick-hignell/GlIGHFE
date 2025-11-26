/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('likes').del()
  await knex('comments').del()
  await knex('posts').del()
  await knex('users').del()
}
