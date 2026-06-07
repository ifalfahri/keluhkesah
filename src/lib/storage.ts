"use server";

import { PrismaClient, Post } from "@prisma/client";
import { revalidateTag, unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { createHash } from "node:crypto";
import { filterBadWords } from "./filter-badwords";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
const POSTS_CACHE_TAG = "posts";
const MAX_POSTS_PER_PAGE = 24;
const MAX_SKIP = 500;
const MAX_FROM_LENGTH = 50;
const MAX_TO_LENGTH = 80;
const MAX_POST_MESSAGE_LENGTH = 500;
const MAX_COMMENT_LENGTH = 280;

interface NewPost {
  from: string;
  to: string;
  message: string;
}

interface NewComment {
  from: string;
  text: string;
}

const getPostsCached = unstable_cache(
  async (skip: number, take: number) =>
    prisma.post.findMany({
      include: { comments: true },
      orderBy: { timestamp: "desc" },
      skip,
      take,
    }),
  ["posts-cache"],
  { revalidate: 30, tags: [POSTS_CACHE_TAG] }
);

function normalizeText(value: string | undefined, maxLength: number) {
  return (value ?? "").trim().slice(0, maxLength);
}

function validateUuid(id: string, fieldName: string) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    throw new Error(`${fieldName} tidak valid`);
  }
}

async function getClientIdentifier() {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for");
  const realIp = requestHeaders.get("x-real-ip");
  const userAgent = requestHeaders.get("user-agent") ?? "unknown";
  const ip = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";

  return createHash("sha256").update(`${ip}:${userAgent}`).digest("hex");
}

async function enforceRateLimit(
  action: string,
  limit: number,
  windowSeconds: number
) {
  const identifier = await getClientIdentifier();
  const windowMs = windowSeconds * 1000;
  const now = Date.now();
  const windowStart = new Date(Math.floor(now / windowMs) * windowMs);

  await prisma.$transaction(async (tx) => {
    const existing = await tx.rateLimit.findUnique({
      where: {
        action_identifier_windowStart: {
          action,
          identifier,
          windowStart,
        },
      },
    });

    if (!existing) {
      await tx.rateLimit.create({
        data: {
          action,
          identifier,
          windowStart,
          count: 1,
        },
      });
      return;
    }

    if (existing.count >= limit) {
      throw new Error("Terlalu banyak permintaan, coba lagi nanti.");
    }

    await tx.rateLimit.update({
      where: { id: existing.id },
      data: { count: existing.count + 1 },
    });
  });
}

export async function getPosts(skip = 0, take = 12) {
  await enforceRateLimit("read:posts", 120, 60);

  const safeSkip = Math.max(0, Math.min(Math.floor(skip), MAX_SKIP));
  const safeTake = Math.max(1, Math.min(Math.floor(take), MAX_POSTS_PER_PAGE));

  return await getPostsCached(safeSkip, safeTake);
}

export async function savePost(post: NewPost) {
  await enforceRateLimit("write:post", 5, 300);

  const from = normalizeText(post.from || "Anonim", MAX_FROM_LENGTH) || "Anonim";
  const to = normalizeText(post.to, MAX_TO_LENGTH);
  const message = normalizeText(post.message, MAX_POST_MESSAGE_LENGTH);

  if (!to) {
    throw new Error("Penerima wajib diisi.");
  }

  if (!message) {
    throw new Error("Isi keluhan tidak boleh kosong.");
  }

  const existingPost = await prisma.post.findFirst({
    where: {
      message,
      from,
    },
  });

  if (existingPost) {
    throw new Error("Dilarang spam ya");
  }

  const filteredFrom = filterBadWords(from);
  const filteredTo = filterBadWords(to);
  const filteredMessage = filterBadWords(message);

  const createdPost = await prisma.post.create({
    data: {
      from: filteredFrom,
      to: filteredTo,
      message: filteredMessage,
      timestamp: new Date(),
      loveCount: 0,
    },
  });

  revalidateTag(POSTS_CACHE_TAG);
  return createdPost;
}

export async function updatePost(updatedPost: Post) {
  return await prisma.post.update({
    where: { id: updatedPost.id },
    data: updatedPost,
  });
}

export async function addComment(postId: string, comment: NewComment) {
  await enforceRateLimit("write:comment", 10, 600);
  validateUuid(postId, "Post");

  const from = normalizeText(comment.from || "Anonim", MAX_FROM_LENGTH) || "Anonim";
  const text = normalizeText(comment.text, MAX_COMMENT_LENGTH);

  if (!text) {
    throw new Error("Komentar tidak boleh kosong.");
  }

  const existingComment = await prisma.comment.findFirst({
    where: {
      text,
      from,
      postId: postId,
    },
  });

  if (existingComment) {
    throw new Error("Sekali aja ya, jangan spam.");
  }

  const filteredFrom = filterBadWords(from);
  const filteredText = filterBadWords(text);

  const createdComment = await prisma.comment.create({
    data: {
      from: filteredFrom,
      text: filteredText,
      postId,
      timestamp: new Date(),
    },
  });

  revalidateTag(POSTS_CACHE_TAG);
  return createdComment;
}

export async function toggleLove(postId: string) {
  await enforceRateLimit("write:love", 20, 600);
  validateUuid(postId, "Post");
  await enforceRateLimit(`write:love:${postId}`, 1, 86400);

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });
  if (post) {
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { loveCount: post.loveCount + 1 },
    });

    revalidateTag(POSTS_CACHE_TAG);
    return updatedPost;
  }
}