-- CreateEnum
CREATE TYPE "AlgebraTopic" AS ENUM ('LINEAR_EQUATIONS', 'FACTORING');

-- CreateTable
CREATE TABLE "attempts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "topic" "AlgebraTopic",
    "statement_tex" TEXT NOT NULL,
    "expected_answer_tex" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "steps" (
    "id" UUID NOT NULL,
    "attempt_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "index" INTEGER NOT NULL,
    "latex" TEXT NOT NULL,
    "bbox" JSONB NOT NULL,
    "is_correct" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hints" (
    "id" UUID NOT NULL,
    "step_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "error_type" TEXT NOT NULL,
    "feedback_tex" TEXT NOT NULL,
    "suggestion_tex" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hints_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "hints_step_id_key" ON "hints"("step_id");

-- AddForeignKey
ALTER TABLE "attempts" ADD CONSTRAINT "attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "steps" ADD CONSTRAINT "steps_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hints" ADD CONSTRAINT "hints_step_id_fkey" FOREIGN KEY ("step_id") REFERENCES "steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Row Level Security
-- NOTE: these policies reference Supabase's auth.uid(); apply this migration with
-- `prisma migrate deploy` (no shadow DB), not `prisma migrate dev`.
ALTER TABLE "attempts" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_attempts" ON "attempts"
  USING (auth.uid() = "user_id") WITH CHECK (auth.uid() = "user_id");

ALTER TABLE "steps" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_steps" ON "steps"
  USING (auth.uid() = "user_id") WITH CHECK (auth.uid() = "user_id");

ALTER TABLE "hints" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_hints" ON "hints"
  USING (auth.uid() = "user_id") WITH CHECK (auth.uid() = "user_id");