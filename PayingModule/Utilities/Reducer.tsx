import {Action} from './Actions';
import {
  allDataTypes,
  initialState,
} from '../Screens/Components/EnterDataValues';
export const reducer = (
  state: allDataTypes = initialState,
  action: Action,
): allDataTypes => {
  switch (action.type) {
    case 'INSERT': {
      const {table, data} = action.payload;
      switch (table) {
        case 'liftingTable':
          return {
            ...state,
            liftingData: {...state.liftingData, ...data},
          };
        case 'weekEndingTable':
          return {
            ...state,
            weekEndingData: {...state.weekEndingData, ...data},
          };
        case 'datatable':
          return {
            ...state,
            mainData: {...state.mainData, ...data},
          };
        case 'cab':
          return {
            ...state,
            cabData: {
              ...state.cabData,
              ...data,
            },
          };
        default:
          return state;
      }
    }
    case 'SELECT': {
      const {table, data} = action.payload;
      switch (table) {
        case 'liftingTable':
          return {
            ...state,
            liftingData: {...state.liftingData, ...data},
          };
        case 'weekEndingTable':
          return {
            ...state,
            weekEndingData: {...state.weekEndingData, ...data},
          };
        case 'datatable':
          return {
            ...state,
            mainData: {...state.mainData, ...data},
          };
        case 'cab':
          return {
            ...state,
            cabData: {...state.cabData, ...data},
          };
        default:
          return state;
      }
    }
    case 'UPDATE': {
      const {table, data} = action.payload;
      switch (table) {
        case 'liftingTable':
          return {
            ...state,
            liftingData: {...state.liftingData, ...data},
          };
        case 'weekEndingTable':
          return {
            ...state,
            weekEndingData: {...state.weekEndingData, ...data},
          };
        case 'datatable':
          return {
            ...state,
            mainData: {...state.mainData, ...data},
          };
        case 'cab':
          return {
            ...state,
            cabData: {
              ...state.cabData,
              ...action.payload.data,
            },
          };
        default:
          return state;
      }
    }
    case 'DELETE': {
      const {table, data} = action.payload;
      switch (table) {
        case 'liftingTable':
          // Implement deletion logic specific to liftingTable
          return state;
        case 'weekEndingTable':
          // Implement deletion logic specific to weekEndingTable
          return state;
        case 'datatable':
          return state;
        case 'cab':
          const updatedCabData = state.cabData.Cab_Data.filter(
            (_, index) => index !== data.cabIndex, // Remove the cab at the specified index
          );
          return {
            ...state,
            cabData: {
              ...state.cabData,
              ...updatedCabData,
            },
          };
        default:
          return state;
      }
    }
    case 'REFRESH':
      const {table, data} = action.payload;
      switch (table) {
        case 'datatable':
          return {
            ...state,
            mainData: {
              ...state.mainData,
              ...data,
            }
          };
        default:
          return state;
      }
    case 'ERROR':
      console.error('Error action:', action.payload.message);
      return state;
    default:
      throw new Error(`Unhandled action type: ${action}`);
  }
};
