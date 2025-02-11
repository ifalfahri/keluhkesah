"use server"

import { PrismaClient, Post } from '@prisma/client';
import { filterBadWords } from './filter-badwords';

const prisma = new PrismaClient();

interface NewPost {
  from: string;
  to: string;
  message: string;
}

interface NewComment {
  from: string;
  text: string;
}

export async function getPosts(skip = 0, take = 12) {
  return await prisma.post.findMany({
    include: { comments: true },
    orderBy: { timestamp: 'desc' },
    skip,
    take,
  });
}

export async function savePost(post: NewPost) {
  const existingPost = await prisma.post.findFirst({
    where: {
      message: post.message,
      from: post.from || 'Anonim', 
    },
  });

  if (existingPost) {
    throw new Error('Dilarang spam ya');
  }

  const filteredFrom = filterBadWords(post.from || 'Anonim');
  const filteredTo = filterBadWords(post.to || '');
  const filteredMessage = filterBadWords(post.message);

  return await prisma.post.create({
    data: {
      from: filteredFrom,
      to: filteredTo,
      message: filteredMessage,
      timestamp: new Date(),
      loveCount: 0,
    },
  });
}

export async function updatePost(updatedPost: Post) {
  return await prisma.post.update({
    where: { id: updatedPost.id },
    data: updatedPost,
  });
}

export async function addComment(postId: string, comment: NewComment) {
  const existingComment = await prisma.comment.findFirst({
    where: {
      text: comment.text,
      from: comment.from || 'Anonim', 
      postId: postId,
    },
  });

  if (existingComment) {
    throw new Error('Sekali aja ya, jangan spam.');
  }

  const filteredFrom = filterBadWords(comment.from || 'Anonim');
  const filteredText = filterBadWords(comment.text);

  return await prisma.comment.create({
    data: {
      from: filteredFrom,
      text: filteredText,
      postId,
      timestamp: new Date(),
    },
  });;
}

export async function toggleLove(postId: string) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
  });
  if (post) {
    return await prisma.post.update({
      where: { id: postId },
      data: { loveCount: post.loveCount + 1 },
    });
  }
}