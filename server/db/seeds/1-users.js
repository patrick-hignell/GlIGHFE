/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex('users').insert([
    {
      id: 1,
      auth_id: 1,
      name: 'Sofia',
      bio: '',
      font: '',
      profile_picture: '',
    },
    {
      id: 2,
      auth_id: 2,
      name: 'Nikola',
      bio: '',
      font: '',
      profile_picture: '',
    },
    {
      id: 3,
      auth_id: 3,
      name: 'Patrick',
      bio: '',
      font: '',
      profile_picture: '',
    },
    { id: 4, auth_id: 4, name: 'Matt', bio: '', font: '', profile_picture: '' },
    {
      id: 5,
      auth_id: 5,
      name: 'James',
      bio: '',
      font: '',
      profile_picture: '',
    },
    {
      id: 6,
      auth_id: 6,
      name: 'Vaughan',
      bio: '',
      font: '',
      profile_picture: '',
    },
    {
      id: 7,
      auth_id: 'google-oauth2|116118796709799810524',
      name: 'Matt v2',
      bio: 'Just a regular Matt, enjoying the G(ood)-life.',
      font: '',
      profile_picture: '',
    },
  ])
}
