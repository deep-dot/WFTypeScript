import {Action} from './Actions';
import {tableData, refreshValues} from '../Screens/Components/EnterDataValues';

export const reducer = (state: tableData, action: Action): tableData => {
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
        const cabdata = (
          state.Cab_Data as unknown as Array<{Cab: string}>
        ).filter(cab => Object.keys(cab).length > 0);
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
        // Assuming state.datatableData is an array of objects that includes a Date property
        const updatedData = Array.isArray(state.tableData)
          ? state.tableData.filter(item => item.Date !== action.payload.date)
          : state.tableData;
        return {
          ...state,
          tableData: updatedData,
        };
      }

      if (action.payload.table === 'cab') {
        console.log(
          'action.payload.delete Table ===',
          // action.payload.deleteFromTable,
          // rego,
          state.Cab_Data,
        );
        return {
          ...state,
          Taxi: action.payload.Taxi,
          Rego_Modal: action.payload.Rego_Modal,
          Cab_Data: Array.isArray(state.Cab_Data)
            ? state.Cab_Data.filter(
                item => item && item.Cab !== action.payload.rego,
              )
            : state.Cab_Data, // Keep the original state if it's not an array
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
