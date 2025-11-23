import { pgTable, serial, varchar, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: varchar('id').primaryKey(),
  username: varchar('username').notNull().unique(),
  fullName: varchar('full_name').notNull(),
  email: varchar('email').notNull().unique(),
  avatar: varchar('avatar'),
  bio: text('bio'),
  website: varchar('website'),
  followers: integer('followers').default(0),
  following: integer('following').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

export const demoAccounts = [
  {
    id: 'demo_alex_photo',
    username: 'alex_photo',
    fullName: 'Alex Johnson',
    email: 'alex@demo.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex123',
    bio: 'Travel photographer',
    website: '',
    followers: 2456,
    following: 342
  },
  {
    id: 'demo_sophia_art',
    username: 'sophia_art',
    fullName: 'Sophia Martinez',
    email: 'sophia@demo.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophia456',
    bio: 'Digital artist & designer',
    website: '',
    followers: 3891,
    following: 567
  },
  {
    id: 'demo_mike_tech',
    username: 'mike_tech',
    fullName: 'Mike Chen',
    email: 'mike@demo.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike789',
    bio: 'Tech enthusiast & coder',
    website: '',
    followers: 1823,
    following: 234
  },
  {
    id: 'demo_emma_fitness',
    username: 'emma_fitness',
    fullName: 'Emma Wilson',
    email: 'emma@demo.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma101',
    bio: 'Fitness coach & wellness',
    website: '',
    followers: 5123,
    following: 445
  },
  {
    id: 'demo_ryan_music',
    username: 'ryan_music',
    fullName: 'Ryan Blake',
    email: 'ryan@demo.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ryan202',
    bio: 'Musician & producer',
    website: '',
    followers: 4567,
    following: 389
  }
];
