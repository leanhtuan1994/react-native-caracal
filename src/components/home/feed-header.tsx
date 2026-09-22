import { useTranslation } from 'react-i18next';

import { Text, View } from '@/components/ui';
import { useComingSoon } from '@/lib/hooks';

import { HomeHeader } from './home-header';
import { PostSearch } from './post-search';
import { TagFilter } from './tag-filter';

type FeedHeaderProps = {
  search: string;
  onSearchChange: (text: string) => void;
  tag?: string;
  onTagChange: (tag?: string) => void;
};

export function FeedHeader(props: FeedHeaderProps) {
  const { t } = useTranslation();
  const showComingSoon = useComingSoon();

  return (
    <View className="gap-4 pb-3">
      <HomeHeader />
      <PostSearch value={props.search} onChange={props.onSearchChange} />
      <TagFilter value={props.tag} onChange={props.onTagChange} />
      <View className="flex-row items-center justify-between px-1 pt-1">
        <Text className="font-bold text-lg text-foreground">
          {t('home.latest')}
        </Text>
        <Text
          testID="home-see-all"
          className="font-semibold text-sm text-link"
          onPress={showComingSoon}
        >
          {t('home.see_all')}
        </Text>
      </View>
    </View>
  );
}
