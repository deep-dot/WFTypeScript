import React from 'react';
import {Action} from './Actions';
import {FormValues} from '../PayingModule/Components/EnterDataValues';

interface ContextValue {
  state: FormValues;
  dispatch: React.Dispatch<Action>;
  starRating: (state: FormValues, dispatch: React.Dispatch<Action>) => void;
  // UpdateData: (searchByDate: string | undefined) => Promise<any>;
  // updateDataInTable: (updateByDate: string | undefined) => Promise<any>;
}

export const StateContext = React.createContext<ContextValue | undefined>(
  undefined,
);
