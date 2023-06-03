/* eslint-disable react/react-in-jsx-scope */
import * as React from 'react';
import {useReducer, createContext, ReactNode} from 'react';
import {initialValues} from '../PayingModule/Screens/Enter/component/EnterDataValues';
import {UpdateData} from '../PayingModule/Components/dbUtility';
import {reducer} from './Reducer';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';

import {ThemeContext} from './ThemeProvider';

interface Cab {
  Cab: string;
}
type FormValues = {
  [key: string]: string | boolean | string[] | Cab[];
  Cab_Data: Cab[];
};

export type Action =
  | {type: 'REFRESH'; payload: any}
  | {type: 'UPDATE'; payload: any}
  | {type: 'ERROR'; error: Error};

interface ContextValue {
  state: FormValues;
  dispatch: React.Dispatch<Action>;
  UpdateData: (searchByDate: string | undefined) => Promise<any>;
  updateDataInTable: (updateByDate: string | undefined) => Promise<any>;
  toggleTheme: () => void;
}

export const StateContext = createContext<ContextValue | undefined>(undefined);

interface Props {
  children: ReactNode;
}
export const StateProvider = ({children}: Props) => {
  const [state, dispatch] = useReducer(reducer, initialValues);

  const themeContext = React.useContext(ThemeContext);
  if (!themeContext) {
    throw new Error('StateProvider must be used within a ThemeProvider');
  }

  const {theme} = themeContext;

  return (
    <StateContext.Provider value={{state, dispatch, UpdateData}}>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>{children}</NavigationContainer>
      </PaperProvider>
    </StateContext.Provider>
  );
};
