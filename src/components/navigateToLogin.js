// src/components/navigateToLogin.js
import { CommonActions } from '@react-navigation/native';

export const navigateToLogin = (navigationRef) => {
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    })
  );
};
