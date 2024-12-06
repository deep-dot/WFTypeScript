import React from 'react';
import {Action} from './Actions';
// import {appData} from '../Screens/Components/EnterDataValues';
import {mainData} from '../Screens/Components/EnterDataValues';
import {liftingModel} from '../Screens/Components/EnterDataValues';
import {weekEndingModel} from '../Screens/Components/EnterDataValues';
import {cabModel} from '../Screens/Components/EnterDataValues';
import {viewRecords} from '../Screens/Components/EnterDataValues';
import {displayReport} from '../Screens/Components/EnterDataValues';

interface ContextValue {
  // state: appData;tableItems
  weekEndingModelState: weekEndingModel;
  mainDataState: mainData;
  liftingModelState: liftingModel;
  cabModelState: cabModel;
  viewRecordsState: viewRecords;
  displayReportState: displayReport;
  dispatch: React.Dispatch<Action>;
  starRating: (state: tableItems, dispatch: React.Dispatch<Action>) => void;
  // UpdateData: (searchByDate: string | undefined) => Promise<any>;
  // updateDataInTable: (updateByDate: string | undefined) => Promise<any>;
}

export const StateContext = React.createContext<ContextValue | undefined>(
  undefined,
);
