/* eslint-disable react/react-in-jsx-scope */
import {useReducer, createContext, ReactNode} from 'react';
import {initialValues} from './EnterDataValues';
import {UpdateData, updateDataInTable} from './dbUtility';

interface Cab {
  Cab: string;
}
type FormValues = {
  [key: string]: string | boolean | string[] | Cab[];
  Cab_Data: Cab[];
  //Jobs: string;
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
}

export const StateContext = createContext<ContextValue | undefined>(undefined);

const reducer = (state: FormValues, action: Action): FormValues => {
  // console.log('action.type==', action.type, state);
  switch (action.type) {
    case 'REFRESH':
      return {...initialValues};
    case 'UPDATE':
      console.log('action.type UPDATE==', action.payload.Search_Date);
      return {...state, ...action.payload};
    case 'ERROR':
      // Here you could return an error state
      // For simplicity, let's just log the error and return the existing state
      console.error(action.error);
      return state;
    default:
      return state;
  }
};

interface Props {
  children: ReactNode;
}
export const StateProvider = ({children}: Props) => {
  const [state, dispatch] = useReducer(reducer, initialValues);
  // console.log('refresh in stateprovider==', state);
  return (
    <StateContext.Provider value={{state, dispatch, UpdateData}}>
      {children}
    </StateContext.Provider>
  );
};
