/* eslint-disable react/react-in-jsx-scope */
import {useReducer, createContext, ReactNode} from 'react';

const initialState = {
  date: '',
  day: '',
  shift: '',
  taxi: '',
  hours: 0,
  numberOfJobs: 0,
  totalLevy: 0,
  cpk: 0,
  insuranceFee: 0,
  meter1: 0,
  meter2: 0,
  totalMeter: 0,
  km1: 0,
  km2: 0,
  resultKm: 0,
  paidKm1: 0,
  paidKm2: 0,
  resultPaidKm: 0,
  unpaidKm: 0,
  eftpos: 0,
  eftposLifting: 0,
  cc: 0,
  manualMptp: 0,
  govSubManual31: 0,
  numberOfManualLifting: 0,
  manualLifting: 0,
  chargeAuthority: 0,
  misc: 0,
  carWash: 0,
  accountFuel: 0,
  totalLifting: 0,
  numberOfChairs: 0,
  gtnLFee: 0,
  driverLFee: 0,
  deductions: 0,
  commissionDriver: 0,
  commissionGtn: 0,
  fare: 0,
  netPayIn: 0,
};
interface State {
  date: string;
  day: string;
  shift: string;
  taxi: string;
  hours: number;
  numberOfJobs: number;
  totalLevy: number;
  cpk: number;
  insuranceFee: number;
  meter1: number;
  meter2: number;
  totalMeter: number;
  km1: number;
  km2: number;
  resultKm: number;
  paidKm1: number;
  paidKm2: number;
  resultPaidKm: number;
  unpaidKm: number;
  eftpos: number;
  eftposLifting: number;
  cc: number;
  manualMptp: number;
  govSubManual31: number;
  numberOfManualLifting: number;
  manualLifting: number;
  chargeAuthority: number;
  misc: number;
  carWash: number;
  accountFuel: number;
  totalLifting: number;
  numberOfChairs: number;
  gtnLFee: number;
  driverLFee: number;
  deductions: number;
  commissionDriver: number;
  commissionGtn: number;
  fare: number;
  netPayIn: number;
}

type Action = {type: 'REFRESH'};

interface ContextValue {
  state: State;
  dispatch: React.Dispatch<Action>;
}

export const StateContext = createContext<ContextValue | undefined>(undefined);

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'REFRESH':
      return initialState;
    default:
      throw new Error();
  }
};

interface Props {
  children: ReactNode;
}
export const StateProvider = ({children}: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
 // console.log('refresh in stateprovider==', state);
  return (
    <StateContext.Provider value={{state, dispatch}}>
      {children}
    </StateContext.Provider>
  );
};
