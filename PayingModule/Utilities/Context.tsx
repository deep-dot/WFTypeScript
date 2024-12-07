import React from 'react';
import {Action} from './Actions';
// import {appData} from '../Screens/Components/EnterDataValues';
import {
  allDataTypes,
  mainDataType,
  liftingModelType,
  weekEndingModelType,
  cabModelType,
  viewRecordsType,
  displayReportType,
} from '../Screens/Components/EnterDataValues';

interface ContextValue {
  allDataTypeState: allDataTypes;
  weekEndingModelState: weekEndingModelType;
  mainDataState: mainDataType;
  liftingModelState: liftingModelType;
  cabModelState: cabModelType;
  viewRecordsState: viewRecordsType;
  displayReportState: displayReportType;
  dispatch: React.Dispatch<Action>;
  starRating: (state: mainDataType, dispatch: React.Dispatch<Action>) => void;
  // UpdateData: (searchByDate: string | undefined) => Promise<any>;
  // updateDataInTable: (updateByDate: string | undefined) => Promise<any>;
}

export const StateContext = React.createContext<ContextValue | undefined>(
  undefined,
);
