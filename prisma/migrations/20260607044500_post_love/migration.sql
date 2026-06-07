-- CreateTable
CREATE TABLE "PostLove" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postId" TEXT NOT NULL,

    CONSTRAINT "PostLove_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostLove_postId_identifier_key" ON "PostLove"("postId", "identifier");

-- CreateIndex
CREATE INDEX "PostLove_identifier_idx" ON "PostLove"("identifier");

-- AddForeignKey
ALTER TABLE "PostLove" ADD CONSTRAINT "PostLove_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
