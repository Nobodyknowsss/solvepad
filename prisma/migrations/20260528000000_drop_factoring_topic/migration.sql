-- Drop FACTORING from the AlgebraTopic enum.
-- Postgres can't ALTER TYPE ... DROP VALUE while the type is referenced by a
-- column, so we rename the old type, create the new one with only the values
-- we want, recast the column, then drop the old type.

-- Null out any rows still tagged FACTORING so the cast below can't fail.
UPDATE "attempts" SET "topic" = NULL WHERE "topic" = 'FACTORING';

ALTER TYPE "AlgebraTopic" RENAME TO "AlgebraTopic_old";

CREATE TYPE "AlgebraTopic" AS ENUM ('LINEAR_EQUATIONS');

ALTER TABLE "attempts"
  ALTER COLUMN "topic" TYPE "AlgebraTopic"
  USING "topic"::text::"AlgebraTopic";

DROP TYPE "AlgebraTopic_old";
