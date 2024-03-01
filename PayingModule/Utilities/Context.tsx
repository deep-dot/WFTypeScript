import React from 'react';
import {Action} from './Actions';
import {tableData} from '../Screens/Components/EnterDataValues';

interface ContextValue {
  state: tableData;
  dispatch: React.Dispatch<Action>;
  starRating: (state: tableData, dispatch: React.Dispatch<Action>) => void;
  // UpdateData: (searchByDate: string | undefined) => Promise<any>;
  // updateDataInTable: (updateByDate: string | undefined) => Promise<any>;
}

export const StateContext = React.createContext<ContextValue | undefined>(
  undefined,
);
