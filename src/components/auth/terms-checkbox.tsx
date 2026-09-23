import { Checkbox } from 'heroui-native';
import type { Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FieldErrorMessage, Text, View } from '@/components/ui';
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
          <View className="flex-row items-start gap-3 px-1 py-0.5">
            <Checkbox
              testID={testID}
              isSelected={field.value}
              onSelectedChange={field.onChange}
              isInvalid={!!fieldState.error}
              className="size-5 rounded-[5px]"
              accessibilityLabel={`${t('auth.sign_up.terms_prefix')} ${t('settings.terms')} ${t('auth.sign_up.and')} ${t('settings.privacy')}`}
            >
              <Checkbox.Indicator className="rounded-[5px]" />
            </Checkbox>
            <Text className="flex-1 text-sm leading-5 text-muted">
              {t('auth.sign_up.terms_prefix')}{' '}
              <Text
                className="font-semibold text-link"
                onPress={showComingSoon}
              >
                {t('settings.terms')}
              </Text>{' '}
              {t('auth.sign_up.and')}{' '}
              <Text
                className="font-semibold text-link"
                onPress={showComingSoon}
              >
                {t('settings.privacy')}
              </Text>
              .
            </Text>
          </View>
          {fieldState.error?.message ? (
            <FieldErrorMessage message={t(fieldState.error.message as never)} />
          ) : null}
        </View>
      )}
    />
  );
}
