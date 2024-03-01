import {Action} from './Actions';
import {FormValues, refreshValues} from '../Screens/Components/EnterDataValues';

export const reducer = (state: FormValues, action: Action): FormValues => {
  switch (action.type) {
    case 'INSERT':
      if (action.payload.table === 'liftingTable') {
        //console.log('insert in liftingtable===', action.payload);
        return {...state, ...action.payload};
      } else if (action.payload.table === 'weekEndingTable') {
        //console.log('insert in weekEndingtable===', action.payload);
        return {...state, ...action.payload};
      } else if (action.payload.table === 'datatable') {
        const newState = {
          ...state,
          ...action.payload,
          ...action.payload.updatedValues,
        };
        return newState;
      } else if (action.payload.table === 'cab') {
        //console.log('cab insert===', action.payload);
        const newCab = {Cab: action.payload.rego};
        const cabdata = (state.Cab_Data as Array<{Cab: string}>).filter(
          cab => Object.keys(cab).length > 0,
        );
        return {
          ...state,
          ...action.payload,
          // Rego_Modal: action.payload.Rego_Modal,
          // Taxi: action.payload.Taxi,
          Cab_Data: [...cabdata, newCab],
        };
      }
      return state;
    case 'SELECT':
      //console.log('action.payload===', action.payload);
      if (action.payload.table === 'liftingTable') {
        return {
          ...state,
          ...action.payload,
        };
      } else if (action.payload.table === 'weekEndingTable') {
        return {
          ...state,
          ...action.payload,
        };
      } else if (action.payload.table === 'datatable') {
        return {
          ...state,
          ...action.payload,
          // Number_Of_Entries: action.payload.Number_Of_Entries,
          // displayRecords: action.payload.displayRecords,
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
          ...action.payload,
          // totalrecords: action.payload.totalrecords,
          // Number_Of_Entries: action.payload.Number_Of_Entries,
        };
      }
      if (action.payload.table === 'cab') {
        //console.log('action.payload.deleteFromTable ===', action.payload.deleteFromTable, rego);
        return {
          ...state,
          Taxi: action.payload.Taxi,
          Rego_Modal: action.payload.Rego_Modal,
          //certain that state.Cab_Data can safely be treated as Array<{ Cab: string }> at this point in your code, you could first cast it to unknown and then to the desired array type. This double casting tells TypeScript that you're intentionally overriding its type inference:
          Cab_Data: (state.Cab_Data as Array<{Cab: string}>).filter(
            item => item.Cab !== action.payload.rego,
          ),

          // Cab_Data: (state.Cab_Data as Array<{Cab: string}>).filter(
          //   item => item.Cab !== action.payload.rego,
          // ),
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
