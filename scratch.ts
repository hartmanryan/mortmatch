import prisma from './src/lib/prisma';

async function main() {
  console.log("=== Database Cleanup ===");
  try {
    // 1. Delete all leads first
    const deletedLeads = await prisma.lead.deleteMany();
    console.log(`Successfully deleted ${deletedLeads.count} leads.`);

    // 2. Delete all lenders
    const deletedLenders = await prisma.lender.deleteMany();
    console.log(`Successfully deleted ${deletedLenders.count} lenders.`);

    console.log("Cleanup complete! Database is now fresh.");
  } catch (e) {
    console.error("Database cleanup failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
