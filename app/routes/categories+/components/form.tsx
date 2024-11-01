import {Box} from '@mui/material';
import {useTranslation} from 'react-i18next';

import {AppInput} from '~/global/components/app-input';
import {AppInputSwitch} from '~/global/components/app-input-switch';

//
//

export const CategoriesForm = () => {
  const {t} = useTranslation(['common', 'categories']);

  return (
    <>
      <AppInput
        name="title.ar"
        label={t('common:title') + ' ' + t('common:lang.ar')}
        variant="filled"
      />

      <AppInput
        name="title.en"
        label={t('common:title') + ' ' + t('common:lang.en')}
        variant="filled"
      />

      <Box mt={2} />

      <AppInputSwitch name="isActive" label={t('common:active')} />
    </>
  );
};
