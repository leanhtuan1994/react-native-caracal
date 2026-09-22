import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FieldError } from 'heroui-native';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { GlassSurface } from '@/components/glass';
import { AUTH_ERRORS, signUpWithEmail } from '@/lib/auth';

import type { SignUpFormValues } from './schemas';
import { signUpSchema } from './schemas';
import { SignUpFields } from './sign-up-fields';
import { TermsCheckbox } from './terms-checkbox';

export function SignUpForm() {
  const { t } = useTranslation();
  const { control, handleSubmit, setError, formState } =
    useForm<SignUpFormValues>({
      resolver: zodResolver(signUpSchema),
      defaultValues: {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
      },
    });

  const onSubmit = async ({ fullName, email, password }: SignUpFormValues) => {
    try {
      await signUpWithEmail({ fullName, email, password });
    } catch (error) {
      if (error instanceof Error && error.message === AUTH_ERRORS.emailTaken) {
        setError('email', { message: 'auth.sign_up.email_taken' });
      } else {
        setError('root', { message: 'auth.sign_up.error' });
      }
    }
  };

  const rootError = formState.errors.root?.message;

  return (
    <GlassSurface className="gap-4 p-5">
      <SignUpFields control={control} />
      <TermsCheckbox control={control} testID="sign-up-terms" />
      {rootError ? (
        <FieldError isInvalid>{t(rootError as never)}</FieldError>
      ) : null}
      <Button
        testID="sign-up-submit"
        variant="primary"
        isDisabled={formState.isSubmitting}
        onPress={handleSubmit(onSubmit)}
      >
        {t('auth.sign_up.submit')}
      </Button>
    </GlassSurface>
  );
}
