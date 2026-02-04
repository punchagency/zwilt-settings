import React from 'react';
import { Box, BoxProps } from '@mui/material';

interface CustomFormProps extends Omit<BoxProps, 'component' | 'onSubmit'> {
  component?: React.ElementType;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const CustomForm: React.FC<CustomFormProps> = ({ component = 'form', onSubmit, children, ...props }) => {
  return (
    <Box
      component={component}
      onSubmit={onSubmit as React.FormEventHandler<HTMLFormElement>}
      {...props}
    >
      {children}
    </Box>
  );
};

export default CustomForm;
