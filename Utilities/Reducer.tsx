import {Action} from './Actions';
import {
  FormValues,
  refreshValues,
} from '../PayingModule/Components/EnterDataValues';

export const reducer = (state: FormValues, action: Action): FormValues => {
  //console.log('action.type==', action.type, state);
  switch (action.type) {
    case 'REFRESH':
      return {...state, ...refreshValues};
    case 'UPDATE':
      // console.log('action.type UPDATE==', action.payload);
      return {...state, ...action.payload};
    case 'ERROR':
      console.error(action.error);
      return state;
    default:
      return state;
  }
};
