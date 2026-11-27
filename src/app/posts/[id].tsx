import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Animated, {
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated';

import { FocusedTransitionBoundary } from '@/components/focused-transition-boundary';
import { AmbientBackground, GlassButton } from '@/components/glass';
import {
  PostBody,
  PostStats,
  PostTags,
  PostTitle,
} from '@/components/home/post-elements';
import { Text, View } from '@/components/ui';
import { MOCK_POSTS } from '@/lib/posts';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const post = MOCK_POSTS.find((item) => String(item.id) === id);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const offset = useScrollOffset(scrollRef);
  const [headerHeight, setHeaderHeight] = useState(0);
  const backdropStyle = useAnimatedStyle(() => {
    const y = offset.get();
    return {
      // A pull stretches only the artwork. The header text follows native scroll.
      transform: [
        { translateY: -Math.max(0, y) },
        { scaleY: 1 + Math.max(0, -y) / Math.max(1, headerHeight) },
      ],
    };
  });

  return (
    <FocusedTransitionBoundary>
      <View className="flex-1 bg-surface">
        {headerHeight > 0 && (
          <Animated.View
            pointerEvents="none"
            style={[
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: headerHeight,
                transformOrigin: 'center top',
              },
              backdropStyle,
            ]}
          >
            <AmbientBackground />
          </Animated.View>
        )}
        <Animated.ScrollView
          ref={scrollRef}
          alwaysBounceVertical
          scrollEventThrottle={16}
          contentInsetAdjustmentBehavior="never"
        >
          <View
            className="border-b border-separator"
            onLayout={(event) =>
              setHeaderHeight(event.nativeEvent.layout.height)
            }
          >
            <View className="w-full max-w-2xl gap-10 self-center pt-safe-offset-3 pr-safe-offset-5 pb-8 pl-safe-offset-5">
              <View className="flex-row flex-wrap items-center justify-between gap-3">
                <GlassButton
                  testID="post-detail-back"
                  onPress={() =>
                    router.canGoBack() ? router.back() : router.replace('/')
                  }
                >
                  {t('common.back')}
                </GlassButton>
                {post && <PostStats post={post} />}
              </View>
              {post && (
                <View className="gap-3 px-[19px]">
                  <PostTags post={post} />
                  <PostTitle post={post} heading />
                </View>
              )}
            </View>
          </View>
          <View className="w-full max-w-2xl self-center pt-8 pr-safe-offset-9 pb-safe-offset-8 pl-safe-offset-9">
            {post ? (
              <PostBody post={post} />
            ) : (
              <Text className="text-lg text-foreground">
                {t('home.post_not_found')}
              </Text>
            )}
          </View>
        </Animated.ScrollView>
      </View>
    </FocusedTransitionBoundary>
  );
}
