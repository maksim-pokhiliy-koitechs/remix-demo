import type {MetaFunction} from '@remix-run/node';
import {Form, redirect} from '@remix-run/react';
import {useForm, FormProvider} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useTranslation} from 'react-i18next';
import {useSnackbar, VariantType} from 'notistack';
import * as yup from 'yup';

import {useMutationProductsCreate} from '~/services/products';

import {useI18nNavigate} from '~/global/hooks/use-i18n-navigate';

import {PageShell} from '~/global/components/page-shell';

import {ProductsForm} from './components/form';

//
//

export const handle = {i18n: ['common', 'products']};
export const meta: MetaFunction = () => [{title: 'Remix App - Create a category'}];

export const clientLoader = async () => {
  if (!window.localStorage.getItem('_at')) {
    return redirect('/');
  }

  return null;
};

const schema = yup
  .object({
    title: yup.object({
      ar: yup.string().min(3).max(80).required(),
      en: yup.string().min(3).max(80).required(),
    }),
    description: yup.object({
      ar: yup.string().min(3).max(80).required(),
      en: yup.string().min(3).max(80).required(),
    }),
    categoryId: yup.string().nullable().optional(),
    price: yup.number().positive().required(),
    priceSale: yup.number().positive().nullable().optional(),
    image: yup.string().url().nullable().optional(),
    sku: yup.string().nullable().optional(),
    quantity: yup.number().integer().positive().nullable().optional(),
    isActive: yup.boolean().optional(),
  })
  .required();

//
//

export default function ProductsCreate() {
  const navigate = useI18nNavigate();
  const {enqueueSnackbar} = useSnackbar();
  const {t} = useTranslation(handle.i18n);
  const mutate = useMutationProductsCreate();

  const form = useForm({
    mode: 'onChange',
    defaultValues: {
      title: {en: '', ar: ''},
      description: {en: '', ar: ''},
      categoryId: undefined,
      price: undefined,
      priceSale: undefined,
      image: undefined,
      sku: '',
      quantity: undefined,
      isActive: false,
    },
    resolver: yupResolver(schema),
  });

  //

  const onSubmit = form.handleSubmit(async payload => {
    const response = await mutate.mutateAsync({payload});

    if (response?.errors?.length) {
      response.errors.forEach(error =>
        enqueueSnackbar(error, {
          variant: 'error' as VariantType,
        }),
      );
    } else if (response?.result?.productId) {
      enqueueSnackbar(response.meta?.message, {variant: 'success' as VariantType});
      navigate('/products', {viewTransition: true});
    }
  });

  const isLoading = mutate.isPending || !!mutate.data?.result;

  //
  //

  return (
    <FormProvider {...form}>
      <Form method="post" onSubmit={onSubmit}>
        <PageShell
          title={t('products:title.create')}
          backTo="/products"
          isLoading={isLoading}
          maxWidth={800}
        >
          <ProductsForm />
        </PageShell>
      </Form>
    </FormProvider>
  );
}
