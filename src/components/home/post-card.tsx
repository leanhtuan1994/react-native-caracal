import Ionicons from '@expo/vector-icons/Ionicons';
import { Card } from 'heroui-native';
import { withUniwind } from 'uniwind';

import { Text, View } from '@/components/ui';
import type { Post } from '@/lib/posts';

const StyledIonicons = withUniwind(Ionicons);

function StatPill({
  icon,
  value,
}: {
  icon: 'heart-outline' | 'eye-outline';
  value: number;
}) {
  return (
    <View className="flex-row items-center gap-1 rounded-full bg-default px-2.5 py-1">
      <StyledIonicons name={icon} size={14} className="text-muted" />
      <Text className="text-xs text-muted">{value.toLocaleString()}</Text>
    </View>
  );
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Card
      testID={`post-card-${post.id}`}
      accessible
      className="rounded-3xl border border-white/70 bg-surface/60 dark:border-white/10"
    >
      <Card.Body className="gap-1.5">
        <Text className="text-xs text-muted uppercase">
          {post.tags.join(' · ')}
        </Text>
        <Card.Title>{post.title}</Card.Title>
        <Card.Description numberOfLines={2}>{post.body}</Card.Description>
      </Card.Body>
      <Card.Footer className="flex-row gap-2">
        <StatPill icon="heart-outline" value={post.likes} />
        <StatPill icon="eye-outline" value={post.views} />
      </Card.Footer>
    </Card>
  );
}
