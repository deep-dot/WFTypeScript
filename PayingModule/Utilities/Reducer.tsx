import {Action} from './Actions';
import {FormValues, refreshValues} from '../Screens/Components/EnterDataValues';

export const reducer = (state: FormValues, action: Action): FormValues => {
  switch (action.type) {
    case 'INSERT':
      if (action.payload.table === 'liftingTable') {
        return {...state, liftingId: action.payload.insertId};
      } else if (action.payload.table === 'weekEndingTable') {
        return {...state, ...action.payload};
      } else if (action.payload.table === 'datatable') {
       // console.log('before:', JSON.stringify(state, null, 2));

        //console.table(action);
        const newState = {
          ...state,
          //...action.payload,
          ...action.payload.updatedValues,
        };
        console.log('After update state:', JSON.stringify(newState, null, 2));
        return newState;
      } else if (action.payload.table === 'cab') {
        // console.log('cab insert===', action.payload);
        const newCab = {Cab: action.payload.rego};
        return {
          ...state,
          Rego_Modal: action.payload.Rego_Modal,
          Taxi: action.payload.Taxi,
          Cab_Data: [...state.Cab_Data, newCab],
        };
      }
      return state;
    case 'SELECT':
      //console.log('action.payload===', action.payload);
      if (action.payload.table === 'liftingTable') {
        return {
          ...state,
          Gov_Lifting_Fee: action.payload.data.Gov_Lifting_Fee,
          Driver_Share_In_LiftingFee:
            action.payload.data.Driver_Share_In_LiftingFee,
          Gov_Levy: action.payload.data.Gov_Levy,
          Driver_Comm_Rate: action.payload.data.Driver_Comm_Rate,
          Company_Comm_Rate: action.payload.data.Company_Comm_Rate,
        };
      } else if (action.payload.table === 'weekEndingTable') {
        return {
          ...state,
          Name: action.payload.data.Name,
          Week_Ending_Date: action.payload.data.Week_Ending_Date,
          Week_Ending_Day: action.payload.data.Week_Ending_Day,
        };
      } else if (action.payload.table === 'datatable') {
        return {
          ...state,
          Record_id: action.payload.insertId,
          Number_Of_Entries: action.payload.Number_Of_Entries,
          totalrecords: action.payload.totalrecords,
          //tableData: action.payload.tableData,
        };
      } else if (action.payload.table === 'cab') {
        return {...state, Cab_Data: action.payload.data};
      }
      return state;
    case 'UPDATE':
      if (action.payload.table === 'datatable') {
        return {...state, ...action.payload};
      } else if (action.payload.table === 'weekEndingTable') {
        return {...state, ...action.payload};
      }
      return state;
    case 'DELETE':
      if (action.payload.table === 'datatable') {
        return {
          ...state,
          totalrecords: action.payload.totalrecords,
          Number_Of_Entries: action.payload.Number_Of_Entries,
        };
      }
      if (action.payload.table === 'cab') {
        //console.log('action.payload.deleteFromTable ===', action.payload.deleteFromTable, rego);
        return {
          ...state,
          Taxi: action.payload.Taxi,
          Rego_Modal: action.payload.Rego_Modal,
          Cab_Data: state.Cab_Data.filter(
            item => item.Cab !== action.payload.rego,
          ),
        };
      }
    // eslint-disable-next-line no-fallthrough
    case 'REFRESH':
      return {...state, ...refreshValues};
    case 'ERROR':
      console.error(action.error);
      // return {...state, error: action.error.message};
      return {...state};
    default:
      console.error('Unhandled action type:', action);
      throw new Error(`Unhandled action type: ${action}`);
  }
};
