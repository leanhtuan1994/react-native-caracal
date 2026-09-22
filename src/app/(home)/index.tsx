import { useState } from 'react';

import { AmbientBackground } from '@/components/glass';
import { FeedHeader, PostCard, PostEmptyState } from '@/components/home';
import { List, View } from '@/components/ui';
import { useDebouncedValue } from '@/lib/hooks';
import { filterPosts, MOCK_POSTS } from '@/lib/posts';

function Separator() {
  return <View className="h-3" />;
}

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState<string>();
  const query = useDebouncedValue(search);
  const data = filterPosts(MOCK_POSTS, { query, tag });

  return (
    <View className="flex-1">
      <AmbientBackground />
      <List
        testID="home-feed"
        data={data}
        keyExtractor={(post) => String(post.id)}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="px-5 pb-32"
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={
          <FeedHeader
            search={search}
            onSearchChange={setSearch}
            tag={tag}
            onTagChange={setTag}
          />
        }
        renderItem={({ item }) => <PostCard post={item} />}
        ListEmptyComponent={PostEmptyState}
      />
    </View>
  );
}
