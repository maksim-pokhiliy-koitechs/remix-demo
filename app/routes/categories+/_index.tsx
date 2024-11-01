import type {MetaFunction} from '@remix-run/node';
import {redirect} from '@remix-run/react';
import {useTranslation} from 'react-i18next';

import {Stack} from '@mui/material';

import {useQueryCategoriesList} from '~/services/categories';

import {SkeletonOnLoading} from '~/global/components/skeleton-on-loading';
import {AppButton} from '~/global/components/app-button';

import {CategoriesTable} from './components/table';

//
//

export const handle = {i18n: ['common', 'categories']};
export const meta: MetaFunction = () => [{title: 'Remix App - Categories'}];

export const clientLoader = async () => {
  if (!window.localStorage.getItem('_at')) return redirect('/');

  return null;
};

//
//

export default function Categories() {
  const {t} = useTranslation(['common']);
  const {data, isLoading} = useQueryCategoriesList();

  //
  //

  return (
    <>
      <Stack alignItems="flex-end" my={2}>
        <SkeletonOnLoading isLoading={isLoading}>
          <AppButton to="/categories/create" variant="contained">
            {t('common:create')}
          </AppButton>
        </SkeletonOnLoading>
      </Stack>

      <CategoriesTable data={data?.result} isLoading={isLoading} />
    </>
  );
}
