export type Post = {
  id: number;
  title: string;
  body: string;
  tags: string[];
  likes: number;
  views: number;
};

export type PostsFilter = { query?: string; tag?: string };
