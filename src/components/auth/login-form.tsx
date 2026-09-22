import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FieldError } from 'heroui-native';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { GlassSurface } from '@/components/glass';
import { ControlledInput, Text } from '@/components/ui';
import { loginWithEmail } from '@/lib/auth';
import { useComingSoon } from '@/lib/hooks';

import type { LoginFormValues } from './schemas';
import { loginSchema } from './schemas';

export function LoginForm() {
  const { t } = useTranslation();
  const showComingSoon = useComingSoon();
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
    <GlassSurface className="gap-5 p-5">
      <ControlledInput
        control={control}
        name="email"
        label={t('auth.email')}
        placeholder={t('auth.email_placeholder')}
        testID="login-email-input"
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
        isPassword
        labelAccessory={
          <Text
            testID="login-forgot"
            className="text-sm text-accent"
            onPress={showComingSoon}
          >
            {t('auth.login.forgot')}
          </Text>
        }
      />
      {rootError ? (
        <FieldError testID="login-error" isInvalid>
          {t(rootError as never)}
        </FieldError>
      ) : null}
      <Button
        testID="login-submit"
        variant="primary"
        isDisabled={formState.isSubmitting}
        onPress={handleSubmit(onSubmit)}
      >
        {t('auth.login.submit')}
      </Button>
    </GlassSurface>
  );
}
