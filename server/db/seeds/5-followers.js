/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex('followers').insert([
    // Sofia (id:1) follows Nikola (id:2)
    { follower_id: 1, following_id: 2 },
    // Nikola (id:2) follows Sofia (id:1) and Patrick (id:3)
    { follower_id: 2, following_id: 1 },
    { follower_id: 2, following_id: 3 },
    // Patrick (id:3) follows Sofia (id:1)
    { follower_id: 3, following_id: 1 },
    // Matt v2 (id:7) follows Sofia (id:1)
    { follower_id: 7, following_id: 1 },
  ])
}
