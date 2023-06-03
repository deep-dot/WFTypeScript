import {initialValues} from '../PayingModule/Screens/Enter/component/EnterDataValues';
import {Action} from './Actions';
import {FormValues} from '../PayingModule/Screens/Enter/component/EnterDataValues';

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
