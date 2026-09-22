import Ionicons from '@expo/vector-icons/Ionicons';
import { Button, SearchField } from 'heroui-native';
import { useTranslation } from 'react-i18next';
import { withUniwind } from 'uniwind';

import { InputGlass } from '@/components/glass';
import { useComingSoon } from '@/lib/hooks';

const StyledIonicons = withUniwind(Ionicons);

type PostSearchProps = { value: string; onChange: (text: string) => void };

export function PostSearch({ value, onChange }: PostSearchProps) {
  const { t } = useTranslation();
  const showComingSoon = useComingSoon();

  return (
    <SearchField value={value} onChange={onChange}>
      <SearchField.Group>
        <SearchField.SearchIcon iconProps={{ size: 22 }} className="left-4" />
        <SearchField.Input
          testID="home-search-input"
          placeholder={t('home.search_placeholder')}
          className="h-[52px] rounded-full border border-white/80 pr-24 pl-12 text-[17px] dark:border-white/10"
          background={<InputGlass />}
        />
        <SearchField.ClearButton className="right-12" />
        <Button
          testID="home-voice-search"
          isIconOnly
          size="sm"
          variant="ghost"
          className="absolute right-1.5 size-10 rounded-full"
          accessibilityLabel={t('home.voice_search')}
          onPress={showComingSoon}
        >
          <StyledIonicons name="mic-outline" size={20} className="text-muted" />
        </Button>
      </SearchField.Group>
    </SearchField>
  );
}
