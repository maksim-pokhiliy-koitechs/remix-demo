import {useTranslation} from 'react-i18next';
import {useSnackbar, VariantType} from 'notistack';

import {Paper, Table, TableBody, TableContainer} from '@mui/material';

import {useMutationProductsDelete} from '~/services/products';

import {TableRowEmpty} from '~/global/components/table-row-empty';

import {ApiProduct} from '~/api-client/types';

import {ProductsTableHead} from './table-head';
import {ProductsTableRow} from './table-row';
import {ProductsTableRowSkeleton} from './table-row-skeleton';

//
//

export const ProductsTable = ({data, isLoading}: {data?: ApiProduct[]; isLoading: boolean}) => {
  const {t} = useTranslation(['common']);
  const {enqueueSnackbar} = useSnackbar();
  const deleteItem = useMutationProductsDelete();

  //

  const doDeleteItem = (item: ApiProduct) => {
    if (!window.confirm(t('common:deleteConfirm', {item: item.title.en || item.title.ar}))) return;

    deleteItem.mutate(
      {id: item.productId},
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
        <ProductsTableHead />
        <TableBody>
          {isLoading ? (
            <ProductsTableRowSkeleton />
          ) : !data?.length ? (
            <TableRowEmpty actionURL="/products/create" colSpan={4} />
          ) : (
            data?.map(row => (
              <ProductsTableRow key={row.productId} row={row} doDeleteItem={doDeleteItem} />
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
