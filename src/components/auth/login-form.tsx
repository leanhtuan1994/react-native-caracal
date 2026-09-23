import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { GlassSurface } from '@/components/glass';
import {
  ControlledInput,
  FieldErrorMessage,
  PrimaryButton,
} from '@/components/ui';
import { loginWithEmail } from '@/lib/auth';

import { ForgotPasswordLink } from './forgot-password-link';
import type { LoginFormValues } from './schemas';
import { loginSchema } from './schemas';

export function LoginForm() {
  const { t } = useTranslation();
  const { control, handleSubmit, setError, formState } =
    useForm<LoginFormValues>({
      resolver: zodResolver(loginSchema),
      defaultValues: { email: '', password: '' },
    });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await loginWithEmail(values);
    } catch {
      setError('root', { message: 'auth.login.error' });
    }
  };

  const rootError = formState.errors.root?.message;

  return (
    <GlassSurface className="gap-5 rounded-[28px] p-5">
      <ControlledInput
        control={control}
        name="email"
        label={t('auth.email')}
        placeholder={t('auth.email_placeholder')}
        testID="login-email-input"
        icon="mail-outline"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <ControlledInput
        control={control}
        name="password"
        label={t('auth.password')}
        placeholder={t('auth.password_placeholder')}
        testID="login-password-input"
        icon="lock-closed-outline"
        isPassword
        labelAccessory={<ForgotPasswordLink />}
      />
      {rootError ? (
        <FieldErrorMessage
          testID="login-error"
          message={t(rootError as never)}
        />
      ) : null}
      <PrimaryButton
        testID="login-submit"
        isDisabled={formState.isSubmitting}
        onPress={handleSubmit(onSubmit)}
      >
        {t('auth.login.submit')}
      </PrimaryButton>
    </GlassSurface>
  );
}
