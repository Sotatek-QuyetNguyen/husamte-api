import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';

const prisma = new PrismaClient();

const fakerUser = (): any => ({
  email: faker.internet.email(),
  name: faker.name.firstName() + faker.name.lastName(),
  password: faker.internet.password(),
  dateOfBirth: faker.date.birthdate(),
  role: 0
});

async function main() {
  const fakerRounds = 10;
  dotenv.config();
  console.log('Seeding users...');
  /// --------- Users ---------------
  for (let i = 0; i < fakerRounds; i++) {
    await prisma.user.create({ data: fakerUser() });
  }
  console.log('Seed done!');
};



main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
