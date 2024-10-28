import path from 'path';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { users } from '../storage/storage';
import { APP_ROLES, User } from '../models';

const envFilePath =
  process.env.NODE_ENV === 'production'
    ? path.join(__dirname, '../.env.production')
    : path.join(__dirname, '../.env.development');

dotenv.config({ path: envFilePath });

export const createAdminUser = async () => {
  const adminName = process.env.ADMIN_NAME;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminName || !adminEmail || !adminPassword) {
    console.error(
      'Please check if ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD exist in .env file'
    );
    return;
  }

  const existingAdmin = users.find(
    (user) => user.email === adminEmail && user.role === APP_ROLES.Admin
  );
  if (existingAdmin) {
    console.log('This admin already exists.');
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const newAdmin: User = {
    id: randomUUID(),
    name: adminName,
    email: adminEmail,
    passwordHash: passwordHash,
    role: APP_ROLES.Admin,
  };

  users.push(newAdmin);

  console.log('Admin user created successfully.');
};