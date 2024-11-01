import type {MetaFunction} from '@remix-run/node';
import {Form, redirect, useLoaderData} from '@remix-run/react';
import {useForm, FormProvider} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useTranslation} from 'react-i18next';
import {useSnackbar, VariantType} from 'notistack';
import * as yup from 'yup';

import {queryClient} from '~/services/client';
import {useQueryProfile, useMutationProfileUpdate} from '~/services/auth';

import {PageShell} from '~/global/components/page-shell';
import {AppInputPassword} from '~/global/components/app-input-password';
import {AppInput} from '~/global/components/app-input';

//
//

export const handle = {i18n: ['common', 'auth']};
export const meta: MetaFunction = () => [{title: 'Remix App - Profile'}];

export const clientLoader = async () => {
  if (!window.localStorage.getItem('_at')) {
    return redirect('/');
  }

  const result = await queryClient.ensureQueryData(useQueryProfile.getFetchOptions({}));

  return result.result;
};

//

const schema = yup
  .object({
    name: yup.string().min(3).max(40).required(),
    mobile: yup.string().min(9).required(),
    email: yup.string().email().required(),
    password: yup.string().optional(),
    passwordConfirm: yup.string().optional(),
  })
  .required();

//
//

export default function Profile() {
  const {t} = useTranslation(handle.i18n);
  const {enqueueSnackbar} = useSnackbar();
  const mutate = useMutationProfileUpdate();
  const current = useLoaderData<typeof clientLoader>();

  const form = useForm({
    mode: 'onChange',
    defaultValues: {...current, password: '', passwordConfirm: ''},
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
    } else if (response?.result?.userId) {
      enqueueSnackbar('Profile updated successfully', {
        variant: 'success' as VariantType,
      });
    }
  });

  const isLoading = mutate.isPending;

  //
  //

  return (
    <FormProvider {...form}>
      <Form method="post" onSubmit={onSubmit}>
        <PageShell title={t('auth:profile.title')} backTo="/" isLoading={isLoading}>
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
