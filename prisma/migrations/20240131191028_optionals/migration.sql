-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "source" DROP NOT NULL,
ALTER COLUMN "balanceAtCompletion" DROP NOT NULL;
