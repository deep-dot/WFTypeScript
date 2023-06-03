import * as React from 'react';
import {
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import {
  DefaultTheme as PaperDefaultTheme,
  MD3DarkTheme,
} from 'react-native-paper';

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

interface ThemeContextProps {
  theme: typeof CustomDefaultTheme | typeof CustomDarkTheme;
  toggleTheme: () => void;
}

export const ThemeContext = React.createContext<ThemeContextProps | undefined>(
  undefined,
);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({children}: ThemeProviderProps) {
  const [isDarkTheme, setIsDarkTheme] = React.useState(true);

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  const toggleTheme = () => {
    setIsDarkTheme(prevIsDarkTheme => !prevIsDarkTheme);
  };

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
}
