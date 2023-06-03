import React from 'react';
import {Action} from './Actions';
import {FormValues} from '../PayingModule/Components/EnterDataValues';

interface ContextValue {
  state: FormValues;
  dispatch: React.Dispatch<Action>;
  UpdateData: (searchByDate: string | undefined) => Promise<any>;
  updateDataInTable: (updateByDate: string | undefined) => Promise<any>;
  toggleTheme: () => void;
}

export const StateContext = React.createContext<ContextValue | undefined>(
  undefined,
);
