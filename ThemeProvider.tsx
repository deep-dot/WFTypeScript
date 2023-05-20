import * as React from 'react';
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  MD3DarkTheme,
} from 'react-native-paper';
import {AuthContext} from './Utilities/UseContext';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({children}: ThemeProviderProps) {
  const [isDarkTheme, setIsDarkTheme] = React.useState(true);

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: '#ffffff',
      text: '#333333',
    },
  };

  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...MD3DarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...MD3DarkTheme.colors,
      background: '#333333',
      text: '#ffffff',
    },
  };

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  const authContext = React.useMemo(
    () => ({
      toggleTheme: () => {
        setIsDarkTheme(prevIsDarkTheme => !prevIsDarkTheme);
      },
    }),
    [],
  );

  return (
    <AuthContext.Provider
      value={{
        ...authContext,
      }}>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>{children}</NavigationContainer>
      </PaperProvider>
    </AuthContext.Provider>
  );
}
