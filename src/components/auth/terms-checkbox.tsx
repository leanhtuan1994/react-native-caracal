import { Checkbox, FieldError } from 'heroui-native';
import type { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Text, View } from '@/components/ui';
import { useComingSoon } from '@/lib/hooks';

import type { SignUpFormValues } from './schemas';

type TermsCheckboxProps = {
  control: Control<SignUpFormValues>;
  testID: string;
};

export function TermsCheckbox({ control, testID }: TermsCheckboxProps) {
  const { t } = useTranslation();
  const showComingSoon = useComingSoon();

  return (
    <Controller
      control={control}
      name="acceptTerms"
      render={({ field, fieldState }) => (
        <View className="gap-1">
          <View className="flex-row items-start gap-3">
            <Checkbox
              testID={testID}
              isSelected={field.value}
              onSelectedChange={field.onChange}
              isInvalid={!!fieldState.error}
              accessibilityLabel={`${t('auth.sign_up.terms_prefix')} ${t('settings.terms')} ${t('auth.sign_up.and')} ${t('settings.privacy')}`}
            />
            <Text className="flex-1 text-sm text-muted">
              {t('auth.sign_up.terms_prefix')}{' '}
              <Text className="text-accent" onPress={showComingSoon}>
                {t('settings.terms')}
              </Text>{' '}
              {t('auth.sign_up.and')}{' '}
              <Text className="text-accent" onPress={showComingSoon}>
                {t('settings.privacy')}
              </Text>
            </Text>
          </View>
          {fieldState.error?.message ? (
            <FieldError isInvalid>
              {t(fieldState.error.message as never)}
            </FieldError>
          ) : null}
        </View>
      )}
    />
  );
}
