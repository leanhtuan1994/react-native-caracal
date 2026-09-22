import type { Post, PostsFilter } from './types';

export function filterPosts(
  posts: Post[],
  { query, tag }: PostsFilter
): Post[] {
  const needle = query?.trim().toLowerCase() ?? '';
  return posts.filter((post) => {
    const matchesTag = !tag || post.tags.includes(tag);
    const matchesQuery =
      !needle ||
      post.title.toLowerCase().includes(needle) ||
      post.body.toLowerCase().includes(needle);
    return matchesTag && matchesQuery;
  });
}

export function getPostTags(posts: Post[]): string[] {
  return [...new Set(posts.flatMap((post) => post.tags))];
}
