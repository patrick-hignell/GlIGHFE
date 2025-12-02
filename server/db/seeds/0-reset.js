/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  // This reset script is designed for SQLite and is essential for a clean,
  // predictable test and development environment.
  //
  // 1. Foreign key checks are temporarily disabled to allow for the deletion
  //    of all table data without constraint violations.
  //
  // 2. The 'sqlite_sequence' table (which tracks auto-incrementing IDs)
  //    is manually cleared to ensure that primary keys are reset to 1 after
  //    every seed run. This is crucial for predictable and repeatable tests.

  // Temporarily disable foreign key checks
  await knex.raw('PRAGMA foreign_keys = OFF;')

  const tables = ['users', 'posts', 'comments', 'likes', 'followers']

  for (const table of tables) {
    await knex(table).del()
  }

  // Reset the auto-incrementing sequence for all tables
  await knex.raw(
    `DELETE FROM sqlite_sequence WHERE name IN ('${tables.join("', '")}')`,
  )

  // Re-enable foreign key checks
  await knex.raw('PRAGMA foreign_keys = ON;')
}
