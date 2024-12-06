import {Action} from './Actions';
import {
  weekEndingModel,
  liftingModel,
  cabModel,
  mainData,
  viewRecords,
  displayReport,
  refreshValues,
} from '../Screens/Components/EnterDataValues';

export const reducer = (state: mainData, action: Action) => {
  switch (action.type) {
    case 'INSERT':
      if (action.payload.table === 'liftingTable') {
        //console.log('insert in liftingtable===', action.payload);
        return {...state, ...action.payload};
      } else if (action.payload.table === 'weekEndingTable') {
        //console.log('insert in weekEndingtable===', action.payload);
        return {...state, ...action.payload};
      } else if (action.payload.table === 'datatable') {
        //console.log('insert in datatable===', action.payload.updatedValues);
        const newState = {
          ...state,
          ...action.payload,
          tableData: action.payload.updatedValues,
        };
        return newState;
      } else if (action.payload.table === 'cab') {
        //console.log('cab insert===', action.payload);
        const newCab = {Cab: action.payload.rego};
        const cabdata = state.Cab_Data.filter(
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
          //appData: action.payload.appData,
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
        // Assuming state.dataappData is an array of objects that includes a Date property
        // const updatedData = state.filter(
        //   item => item.Date !== action.payload.date,
        // );
        return {...state, ...action.payload};
      }

      if (action.payload.table === 'cab') {
        // console.log(
        //   'action.payload.delete Table ===',
        //   // action.payload.deleteFromTable,
        //   // rego,
        //   state.Cab_Data,
        //);
        return {
          ...state,
          Taxi: action.payload.Taxi,
          Rego_Modal: action.payload.Rego_Modal,
          //Cab_Data
        };
      }
      return state;
    case 'REFRESH':
      if (action.payload.table === 'datatable') {
        return {
          ...state,
          ...refreshValues,
        };
      }
      return state;
    case 'ERROR':
      //console.error(action.error);
      // return {...state, error: action.error.message};
      return {...state};
    default:
      console.error('Unhandled action type:', action);
      throw new Error(`Unhandled action type: ${action}`);
  }
};
