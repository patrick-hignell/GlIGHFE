/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex('followers').insert([
    // Sofia ('1') follows Nikola ('2')
    { follower_id: '1', following_id: '2' },
    // Nikola ('2') follows Sofia ('1') and Patrick ('3')
    { follower_id: '2', following_id: '1' },
    { follower_id: '2', following_id: '3' },
    // Patrick ('3') follows Sofia ('1')
    { follower_id: '3', following_id: '1' },
    // Matt v2 ('google-oauth2|...') follows Sofia ('1')
    {
      follower_id: 'google-oauth2|116118796709799810524',
      following_id: '1',
    },
  ])
}
