import { prisma } from "../src/database.js";
import recommendationFactory from "../tests/factories/recommendationFactory.js";

async function main() {
  // Clear all song recommendations
  await prisma.$executeRaw`TRUNCATE TABLE recommendations`;

  // Add 15 song recommendations
  for (let i = 0; i < 15; i++) {
    const recommendation = recommendationFactory(i + 1);
    await prisma.recommendation.create({ data: recommendation });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
