import type { Control } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ControlledInput } from '@/components/ui';

import type { SignUpFormValues } from './schemas';

type SignUpFieldsProps = { control: Control<SignUpFormValues> };

export function SignUpFields({ control }: SignUpFieldsProps) {
  const { t } = useTranslation();

  return (
    <>
      <ControlledInput
        control={control}
        name="fullName"
        label={t('auth.sign_up.full_name')}
        placeholder={t('auth.sign_up.full_name_placeholder')}
        testID="sign-up-name-input"
        autoComplete="name"
      />
      <ControlledInput
        control={control}
        name="email"
        label={t('auth.email')}
        placeholder={t('auth.email_placeholder')}
        testID="sign-up-email-input"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <ControlledInput
        control={control}
        name="password"
        label={t('auth.password')}
        placeholder={t('auth.sign_up.password_placeholder')}
        description={t('auth.sign_up.password_hint')}
        testID="sign-up-password-input"
        isPassword
      />
      <ControlledInput
        control={control}
        name="confirmPassword"
        label={t('auth.sign_up.confirm_password')}
        placeholder={t('auth.sign_up.confirm_placeholder')}
        testID="sign-up-confirm-input"
        isPassword
      />
    </>
  );
}
