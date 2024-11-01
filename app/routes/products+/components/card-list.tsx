import {useTranslation} from 'react-i18next';
import {formatRelative} from 'date-fns';

import {Card, CardContent, CardMedia, Typography, Button, Stack, Box} from '@mui/material';
import {DeleteOutline} from '@mui/icons-material';

import {ApiProduct} from '~/api-client/types';
import {useMutationProductsDelete} from '~/services/products';
import {useSnackbar, VariantType} from 'notistack';

type ProductsCardListProps = {
  data?: ApiProduct[];
  isLoading: boolean;
};

export const ProductsCardList: React.FC<ProductsCardListProps> = ({data, isLoading}) => {
  const {t} = useTranslation(['products', 'common']);
  const {enqueueSnackbar} = useSnackbar();
  const deleteItem = useMutationProductsDelete();

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

  if (isLoading) {
    return <Typography variant="body1">Loading...</Typography>;
  }

  if (!data?.length) {
    return (
      <Typography variant="body1">
        No products found. <Button href="/products/create">Create a product</Button>
      </Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {data.map(product => (
        <Card key={product.productId} sx={{maxWidth: 345}}>
          {product.image && (
            <CardMedia
              component="img"
              height="140"
              image={product.image}
              alt={product.title.en || product.title.ar}
            />
          )}
          <CardContent>
            <Typography variant="h5" component="div">
              {product.title.en || product.title.ar}
            </Typography>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {product.sku || '---'} | {product.quantity || '---'}
              </Typography>
              {product.isActive && (
                <Typography variant="caption" color="success.main" ml={1}>
                  {t('common:active')}
                </Typography>
              )}
            </Box>
            <Box mt={2}>
              <Typography variant="body2">
                Price: ${Number(product.price).toLocaleString()}
              </Typography>
              {product.priceSale && (
                <Typography variant="body2" color="text.secondary">
                  Sale: ${Number(product.priceSale).toLocaleString()}
                </Typography>
              )}
            </Box>
            <Box mt={2}>
              <Typography variant="body2">
                Created: {formatRelative(new Date(product.createdAt), new Date())}
              </Typography>
              {product.updatedAt && product.updatedAt !== product.createdAt && (
                <Typography variant="caption" color="text.secondary">
                  Updated: {formatRelative(new Date(product.updatedAt), new Date())}
                </Typography>
              )}
            </Box>
          </CardContent>
          <Stack direction="row" spacing={1} justifyContent="flex-end" p={1}>
            <Button variant="text" size="small" onClick={() => doDeleteItem(product)}>
              <DeleteOutline />
            </Button>
            <Button
              href={`/products/products/${product.productId}`}
              variant="contained"
              size="medium"
            >
              {t('common:edit')}
            </Button>
          </Stack>
        </Card>
      ))}
    </Stack>
  );
};
