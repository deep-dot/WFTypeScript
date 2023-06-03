import {initialValues} from '../PayingModule/Screens/Enter/component/EnterDataValues';

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
export const reducer = (state: FormValues, action: Action): FormValues => {
  // console.log('action.type==', action.type, state);
  switch (action.type) {
    case 'REFRESH':
      return {...initialValues};
    case 'UPDATE':
      console.log('action.type UPDATE==', action.payload.Search_Date);
      return {...state, ...action.payload};
    case 'ERROR':
      console.error(action.error);
      return state;
    default:
      return state;
  }
};
