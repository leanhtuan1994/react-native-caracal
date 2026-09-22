import { Chip } from 'heroui-native';
import { useTranslation } from 'react-i18next';

import { ChipGlass } from '@/components/glass';
import { ScrollView } from '@/components/ui';
import { getPostTags, MOCK_POSTS } from '@/lib/posts';

const TAGS = getPostTags(MOCK_POSTS).slice(0, 6);

type TagFilterProps = { value?: string; onChange: (tag?: string) => void };

export function TagFilter({ value, onChange }: TagFilterProps) {
  const { t } = useTranslation();
  const options = [
    { key: 'all', label: t('home.all'), tag: undefined },
    ...TAGS.map((tag) => ({ key: tag, label: tag, tag })),
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="gap-2"
    >
      {options.map(({ key, label, tag }) => {
        const isSelected = value === tag;
        return (
          <Chip
            key={key}
            testID={`home-tag-${key}`}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            variant={isSelected ? 'primary' : 'secondary'}
            background={isSelected ? undefined : <ChipGlass />}
            onPress={() => onChange(tag)}
          >
            {label}
          </Chip>
        );
      })}
    </ScrollView>
  );
}
