import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import Animated, {
  ReduceMotion,
  SharedTransition,
} from 'react-native-reanimated';
import { withUniwind } from 'uniwind';

import { Text, View } from '@/components/ui';
import type { Post } from '@/lib/posts';

const StyledIonicons = withUniwind(Ionicons);
const transition = SharedTransition.duration(320).reduceMotion(
  ReduceMotion.System
);
const bodyTransition = SharedTransition.fadeContent()
  .duration(320)
  .reduceMotion(ReduceMotion.System);

function transitionProps(
  id: number,
  part: 'title' | 'tags' | 'likes' | 'views' | 'body'
) {
  if (Platform.OS === 'web') return {};
  return {
    sharedTransitionTag: `post-${id}-${part}`,
    sharedTransitionStyle: part === 'body' ? bodyTransition : transition,
  };
}

export function PostTitle({
  post,
  heading = false,
}: {
  post: Post;
  heading?: boolean;
}) {
  return (
    <Animated.View {...transitionProps(post.id, 'title')}>
      <Text
        accessibilityRole={heading ? 'header' : undefined}
        className="font-semibold text-[17px] leading-[22px] text-foreground"
      >
        {post.title}
      </Text>
    </Animated.View>
  );
}

export function PostTags({ post }: { post: Post }) {
  return (
    <Animated.View {...transitionProps(post.id, 'tags')}>
      <Text className="font-medium text-xs tracking-[0.5px] text-muted uppercase">
        {post.tags.join(' · ')}
      </Text>
    </Animated.View>
  );
}

export function PostStats({ post }: { post: Post }) {
  const { i18n } = useTranslation();
  const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
  return (
    <View className="flex-row flex-wrap gap-2">
      {(['likes', 'views'] as const).map((stat) => (
        <Animated.View key={stat} {...transitionProps(post.id, stat)}>
          <View className="min-h-7 flex-row items-center gap-1.5 rounded-full border border-white/90 bg-white/60 px-2.5 dark:border-white/10 dark:bg-white/5">
            <StyledIonicons
              name={stat === 'likes' ? 'heart-outline' : 'eye-outline'}
              size={15}
              className="text-[#3f4850] dark:text-[#c9d0d4]"
            />
            <Text className="text-[13px] text-[#3f4850] dark:text-[#c9d0d4]">
              {post[stat].toLocaleString(locale)}
            </Text>
          </View>
        </Animated.View>
      ))}
    </View>
  );
}

export function PostBody({
  post,
  preview = false,
}: {
  post: Post;
  preview?: boolean;
}) {
  return (
    <Animated.View {...transitionProps(post.id, 'body')}>
      <Text
        numberOfLines={preview ? 2 : undefined}
        className={
          preview
            ? 'text-sm leading-5 text-muted'
            : 'text-[17px] leading-8 text-foreground'
        }
      >
        {post.body}
      </Text>
    </Animated.View>
  );
}
