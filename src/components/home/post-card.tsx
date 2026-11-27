import { Card } from 'heroui-native';

import type { Post } from '@/lib/posts';

import { PostBody, PostStats, PostTags, PostTitle } from './post-elements';

export function PostCard({ post }: { post: Post }) {
  return (
    <Card className="gap-2 rounded-3xl border border-white/75 bg-white/50 p-[18px] dark:border-white/10 dark:bg-[#283035]/40">
      <Card.Body className="gap-2">
        <PostTags post={post} />
        <PostTitle post={post} />
        <PostBody post={post} preview />
      </Card.Body>
      <Card.Footer className="pt-1">
        <PostStats post={post} />
      </Card.Footer>
    </Card>
  );
}
