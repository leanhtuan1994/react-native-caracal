import { useToast } from 'heroui-native';
import { useTranslation } from 'react-i18next';

export function useComingSoon(): () => void {
  const { t } = useTranslation();
  const { toast } = useToast();
  return () => {
    toast.show({ label: t('common.coming_soon') });
  };
}
