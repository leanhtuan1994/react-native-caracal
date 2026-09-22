import Ionicons from '@expo/vector-icons/Ionicons';
import { Button, SearchField } from 'heroui-native';
import { useTranslation } from 'react-i18next';
import { withUniwind } from 'uniwind';

import { InputGlass } from '@/components/glass';
import { View } from '@/components/ui';
import { useComingSoon } from '@/lib/hooks';

const StyledIonicons = withUniwind(Ionicons);

type PostSearchProps = { value: string; onChange: (text: string) => void };

export function PostSearch({ value, onChange }: PostSearchProps) {
  const { t } = useTranslation();
  const showComingSoon = useComingSoon();

  return (
    <View className="flex-row items-center gap-2">
      <SearchField value={value} onChange={onChange} className="flex-1">
        <SearchField.Group>
          <SearchField.SearchIcon />
          <SearchField.Input
            testID="home-search-input"
            placeholder={t('home.search_placeholder')}
            className="h-[52px] text-[17px]"
            background={<InputGlass />}
          />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>
      <Button
        testID="home-voice-search"
        isIconOnly
        size="sm"
        variant="ghost"
        accessibilityLabel={t('home.voice_search')}
        onPress={showComingSoon}
      >
        <StyledIonicons name="mic-outline" size={20} className="text-muted" />
      </Button>
    </View>
  );
}
