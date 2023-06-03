import {initialValues} from '../PayingModule/Components/EnterDataValues';
import {Action} from './Actions';
import {FormValues} from '../PayingModule/Components/EnterDataValues';

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
