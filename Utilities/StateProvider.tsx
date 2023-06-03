/* eslint-disable react/react-in-jsx-scope */
import * as React from 'react';
import {useReducer, ReactNode} from 'react';
import {initialValues} from '../PayingModule/Components/EnterDataValues';
import {UpdateData} from '../PayingModule/Components/dbUtility';
import {reducer} from './Reducer';
import {StateContext} from './Context';
import {NavigationContainer} from '@react-navigation/native';
import {Provider as PaperProvider} from 'react-native-paper';
import {ThemeContext} from './ThemeProvider';

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