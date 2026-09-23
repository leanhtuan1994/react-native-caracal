import Ionicons from '@expo/vector-icons/Ionicons';
import { Card } from 'heroui-native';
import { useTranslation } from 'react-i18next';
import { withUniwind } from 'uniwind';

import { Text, View } from '@/components/ui';
import type { Post } from '@/lib/posts';

const StyledIonicons = withUniwind(Ionicons);

type StatPillProps = { icon: 'heart-outline' | 'eye-outline'; value: string };

function StatPill({ icon, value }: StatPillProps) {
  return (
    <View className="h-7 flex-row items-center gap-1.5 rounded-full border border-white/90 bg-white/60 px-2.5 dark:border-white/10 dark:bg-white/5">
      <StyledIonicons
        name={icon}
        size={15}
        className="text-[#3f4850] dark:text-[#c9d0d4]"
      />
      <Text className="text-[13px] text-[#3f4850] dark:text-[#c9d0d4]">
        {value}
      </Text>
    </View>
  );
}

export function PostCard({ post }: { post: Post }) {
  const { i18n } = useTranslation();
  const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';

  return (
    <Card
      testID={`post-card-${post.id}`}
      accessible
      className="gap-2 rounded-3xl border border-white/75 bg-white/50 p-[18px] dark:border-white/10 dark:bg-[#283035]/40"
    >
      <Card.Body className="gap-2">
        <Text className="font-medium text-xs tracking-[0.5px] text-muted uppercase">
          {post.tags.join(' · ')}
        </Text>
        <Card.Title className="font-semibold text-[17px] leading-[22px]">
          {post.title}
        </Card.Title>
        <Card.Description
          numberOfLines={2}
          className="text-sm leading-5 text-muted"
        >
          {post.body}
        </Card.Description>
      </Card.Body>
      <Card.Footer className="flex-row gap-2 pt-1">
        <StatPill
          icon="heart-outline"
          value={post.likes.toLocaleString(locale)}
        />
        <StatPill
          icon="eye-outline"
          value={post.views.toLocaleString(locale)}
        />
      </Card.Footer>
    </Card>
  );
}
