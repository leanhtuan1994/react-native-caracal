import { cn } from 'heroui-native';
import { useState } from 'react';
import { useWindowDimensions } from 'react-native';

import { AmbientBackground } from '@/components/glass';
import { FeedHeader, PostCard, PostEmptyState } from '@/components/home';
import { List, View } from '@/components/ui';
import { useDebouncedValue, useScrollTopPadding } from '@/lib/hooks';
import { filterPosts, MOCK_POSTS } from '@/lib/posts';

// Uniwind's `md` breakpoint: the unfolded iPhone Duo, iPad and wide
// Split View windows get a two-column feed.
const TWO_COLUMN_MIN_WIDTH = 768;

function columnGap(numColumns: number, index: number): string | false {
  return numColumns > 1 && (index % 2 === 0 ? 'pr-1.5' : 'pl-1.5');
}

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState<string>();
  const query = useDebouncedValue(search);
  const data = filterPosts(MOCK_POSTS, { query, tag });
  const { width } = useWindowDimensions();
  const numColumns = width >= TWO_COLUMN_MIN_WIDTH ? 2 : 1;
  const topPadding = useScrollTopPadding();

  return (
    <View className="flex-1">
      <AmbientBackground />
      <List
        testID="home-feed"
        data={data}
        keyExtractor={(post) => String(post.id)}
        numColumns={numColumns}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="pr-safe-offset-5 pb-32 pl-safe-offset-5"
        ListHeaderComponent={
          // On the header, not contentContainerStyle: FlashList then drops
          // the safe-area padding from contentContainerClassName.
          <View style={{ paddingTop: topPadding }}>
            <FeedHeader
              search={search}
              onSearchChange={setSearch}
              tag={tag}
              onTagChange={setTag}
            />
          </View>
        }
        renderItem={({ item, index }) => (
          <View className={cn('pb-3', columnGap(numColumns, index))}>
            <PostCard post={item} />
          </View>
        )}
        ListEmptyComponent={PostEmptyState}
      />
    </View>
  );
}
