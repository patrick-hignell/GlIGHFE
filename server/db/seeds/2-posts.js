/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex('posts').insert([
    {
      user_id: 1,
      date_added: 1764227880,
      message: '',
      image: 'kitten',
      font: '',
      char_limit: 10,
      public: true,
    },
    {
      user_id: 2,
      date_added: 1764213600,
      message: '',
      image: 'uploads/kittenturtle-1764290190072',
      font: '',
      char_limit: 10,
      public: true,
    },
    {
      user_id: 2,
      date_added: 1764127260,
      message: '',
      image: 'uploads/kittenburger-1764290785759',
      font: '',
      char_limit: 10,
      public: true,
    },
    {
      user_id: 3,
      date_added: 1764103260,
      message: '',
      image: 'uploads/kittenpizza-1764290477302',
      font: '',
      char_limit: 10,
      public: true,
    },
  ])
}
