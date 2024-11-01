import {useFormContext, Controller} from 'react-hook-form';

import {TextField, TextFieldProps} from '@mui/material';

//
//

export type AppInputProps = TextFieldProps & {name: string};

export const AppInput = ({name, helperText, children, slotProps, ...props}: AppInputProps) => {
  const {control} = useFormContext();

  const slotProps2: TextFieldProps['slotProps'] = {
    ...slotProps,
    inputLabel: {
      sx: {textTransform: 'capitalize'},
      ...slotProps?.inputLabel,
    },
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({field, fieldState}) => (
        <TextField
          error={!!fieldState.error}
          id={'input-' + field.name}
          value={field.value ?? ''}
          onChange={field.onChange}
          onBlur={field.onBlur}
          inputRef={field.ref}
          helperText={fieldState.error?.message || helperText}
          slotProps={slotProps2}
          {...props}
        >
          {children}
        </TextField>
      )}
    />
  );
};
