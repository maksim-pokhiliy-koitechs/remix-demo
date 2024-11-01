import {useTranslation} from 'react-i18next';
import {useSnackbar, VariantType} from 'notistack';

import {Paper, Table, TableBody, TableContainer} from '@mui/material';

import {useMutationCategoriesDelete} from '~/services/categories';

import {TableRowEmpty} from '~/global/components/table-row-empty';

import {ApiCategory} from '~/api-client/types';

import {CategoriesTableRow} from './table-row';
import {CategoriesTableRowSkeleton} from './table-row-skeleton';
import {CategoriesTableHead} from './table-head';

//
//

export const CategoriesTable = ({data, isLoading}: {data?: ApiCategory[]; isLoading: boolean}) => {
  const {t} = useTranslation();
  const {enqueueSnackbar} = useSnackbar();
  const deleteItem = useMutationCategoriesDelete();

  //

  const doDeleteItem = (item: ApiCategory) => {
    if (!window.confirm(t('common:deleteConfirm', {item: item.title.en || item.title.ar}))) return;

    deleteItem.mutate(
      {id: item.categoryId},
      {
        onSuccess: async result => {
          result?.meta?.message &&
            enqueueSnackbar(result?.meta?.message, {variant: 'success' as VariantType});
        },
        onError: err => {
          enqueueSnackbar(err?.message || 'unknown error', {variant: 'error' as VariantType});
        },
      },
    );
  };

  //
  //

  return (
    <TableContainer component={Paper}>
      <Table sx={{minWidth: 650}}>
        <CategoriesTableHead />

        <TableBody>
          {isLoading ? (
            <CategoriesTableRowSkeleton />
          ) : !data?.length ? (
            <TableRowEmpty actionURL="/categories/create" colSpan={4} />
          ) : (
            data?.map(row => (
              <CategoriesTableRow key={row.categoryId} row={row} doDeleteItem={doDeleteItem} />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
