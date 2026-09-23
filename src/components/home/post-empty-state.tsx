import { useTranslation } from 'react-i18next';

import { Text, View } from '@/components/ui';

export function PostEmptyState() {
  const { t } = useTranslation();

  return (
    <View className="items-center py-10">
      <Text testID="home-empty" className="text-muted">
        {t('home.empty')}
      </Text>
    </View>
  );
}
