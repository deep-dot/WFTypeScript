import {Action} from './Actions';
import {
  FormValues,
  refreshValues,
} from '../PayingModule/Screens/Components/EnterDataValues';

export const reducer = (state: FormValues, action: Action): FormValues => {
  switch (action.type) {
    case 'INSERT':
      // console.log('action.payload===', action.payload);
      const {insertId, table: insertTable} = action.payload;
      if (insertTable === 'liftingTable') {
        return {...state, liftingId: insertId};
      } else if (insertTable === 'weekEndingTable') {
        return {...state, WEid: insertId};
      } else if (insertTable === 'datatable') {
        return {...state, Record_id: insertId};
      } else if (insertTable === 'cab') {
        const newCab = {Cab: action.payload.rego, id: insertId};
        return {
          ...state,
          Cab_Data: [...state.Cab_Data, newCab],
        };
      }
      return state;
    case 'SELECT':
      //console.log('action.payload===', action.payload);
      const {data, table: selectTable} = action.payload;
      if (selectTable === 'liftingTable') {
        return {
          ...state,
          Gov_Lifting_Fee: data.Gov_Lifting_Fee,
          Driver_Share_In_LiftingFee: data.Driver_Share_In_LiftingFee,
          Gov_Levy: data.Gov_Levy,
          Driver_Comm_Rate: data.Driver_Comm_Rate,
          Company_Comm_Rate: data.Company_Comm_Rate,
        };
      } else if (selectTable === 'weekEndingTable') {
        return {
          ...state,
          Name: data.Name,
          Week_Ending_Date: data.Week_Ending_Date,
          Week_Ending_Day: data.Week_Ending_Day,
        };
      } else if (selectTable === 'datatable') {
        return {...state, Record_id: insertId};
      } else if (selectTable === 'cab') {
        return {...state, Cab_Data: action.payload.data};
      }
      return state;
    case 'UPDATE':
      return {...state, ...action.payload};
    case 'DELETE':
      const regoToDelete = action.payload.rego;
      return {
        ...state,
        Cab_Data: state.Cab_Data.filter(item => item.Cab !== regoToDelete),
      };
    case 'REFRESH':
      return {...state, ...refreshValues};
    case 'ERROR':
      console.error(action.error);
      // return {...state, error: action.error.message};
      return {...state};
    default:
      console.error('Unhandled action type:', action);
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
