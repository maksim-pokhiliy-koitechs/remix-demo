import type {MetaFunction} from '@remix-run/node';
import {Form, redirect} from '@remix-run/react';
import {useTranslation} from 'react-i18next';
import {useSnackbar, VariantType} from 'notistack';
import * as yup from 'yup';
import {useForm, FormProvider} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';

import {useMutationSignUp} from '~/services/auth';

import {useI18nNavigate} from '~/global/hooks/use-i18n-navigate';

import {PageShell} from '~/global/components/page-shell';
import {AppInputPassword} from '~/global/components/app-input-password';
import {AppInput} from '~/global/components/app-input';

import {apiSaveTokens} from '~/api-client/utils/tokens';

//
//

export const handle = {i18n: ['common', 'auth']};
export const meta: MetaFunction = () => [{title: 'Remix App - Sign Up'}];

export const clientLoader = async () => {
  if (window.localStorage.getItem('_at')) return redirect('/');

  return null;
};

//

const schema = yup
  .object({
    name: yup.string().min(3).max(40).required(),
    mobile: yup.string().min(9).required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
    passwordConfirm: yup.string().required(),
  })
  .required();

//
//

export default function SignUp() {
  const {t} = useTranslation(handle.i18n);
  const {enqueueSnackbar} = useSnackbar();
  const mutate = useMutationSignUp();
  const navigate = useI18nNavigate();

  const form = useForm({
    mode: 'onChange',
    defaultValues: {name: '', email: '', mobile: '', password: '', passwordConfirm: ''},
    resolver: yupResolver(schema),
  });

  //

  const onSubmit = form.handleSubmit(async payload => {
    const response = await mutate.mutateAsync({payload});

    if (response?.errors?.length) {
      response.errors.forEach(error => {
        enqueueSnackbar(error || 'An error occurred', {
          variant: 'error' as VariantType,
        });
      });
    } else if (response?.result?.accessToken?.token) {
      enqueueSnackbar('Account created successfully', {
        variant: 'success' as VariantType,
      });
      apiSaveTokens(response);
      navigate('/', {replace: true, viewTransition: true});
    }
  });

  const isLoading = mutate.isPending || !!mutate.data?.result;

  //
  //

  return (
    <FormProvider {...form}>
      <Form method="post" onSubmit={onSubmit}>
        <PageShell
          title={t('auth:signUp.title')}
          actionLabel={t('auth:signUp.title')}
          backLabel={t('auth:signUp.altAction')}
          backTo="/sign-in"
          isLoading={isLoading}
        >
          <AppInput name="name" label={t('common:name')} variant="filled" />

          <AppInput name="email" type="email" label={t('common:email')} variant="filled" />

          <AppInput name="mobile" type="tel" label={t('common:mobile')} variant="filled" />

          <AppInputPassword name="password" label={t('common:password')} variant="filled" />

          <AppInputPassword
            name="passwordConfirm"
            label={t('common:passwordConfirm')}
            variant="filled"
          />
        </PageShell>
      </Form>
    </FormProvider>
  );
}
