import {Transaction, ResultSet} from '../../databaseTypes';
import {Alert} from 'react-native';
import db from '../../databaseService';
import {Action} from './StateProvider';

export function insertIntoCab(
  //db: any,
  rego: string | string[] | boolean,
): Promise<ResultSet> {
  //console.log('formValues.rego==', rego);
  return new Promise((resolve, reject) => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          'INSERT INTO cab (Cab) VALUES (?)',
          [rego],
          (_tx: Transaction, results: ResultSet) => {
            if (results.rowsAffected > 0) {
              resolve(results);
              Alert.alert('Added successfully');
            } else {
              reject(new Error('Insert operation failed'));
            }
          },
          (error: any) => {
            reject(error);
          },
        );
      });
    } else {
      reject(new Error('db is undefined'));
    }
  });
}

export function deleteIntoCab(
  // db: any,
  rego: string | string[] | boolean,
): Promise<ResultSet> {
  //console.log('formValues.rego==', rego);
  return new Promise((resolve, reject) => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          'DELETE FROM cab where Cab = ?',
          [rego],
          (_tx: Transaction, results: ResultSet) => {
            if (results.rowsAffected > 0) {
              resolve(results);
              Alert.alert('Deleted successfully');
            } else {
              reject(new Error('Delete operation failed'));
            }
          },
          (error: any) => {
            reject(error);
          },
        );
      });
    } else {
      reject(new Error('db is undefined'));
    }
  });
}

export const selectFromCab = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          'SELECT * FROM cab',
          [],
          (_tx: Transaction, results: ResultSet) => {
            var len = results.rows.length;
            if (len > 0) {
              const temp = [];
              for (let j = 0; j < len; j++) {
                temp.push(results.rows.item(j));
              }
              resolve(temp);
            } else {
              resolve([]);
            }
          },
          (error: any) => {
            reject(error);
          },
        );
      });
    } else {
      reject(new Error('db is undefined'));
    }
  });
};

export const selectFromUpdateItems = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          'SELECT GovLFee, CompanyLFee, DriverLFee, Levy, Driver_Comm_Rate, Company_Comm_Rate FROM UpdateItems',
          [],
          (_tx: Transaction, results: ResultSet) => {
            var len = results.rows.length;
            if (len > 0) {
              let res = results.rows.item(0);
              resolve(res);
            } else {
              resolve({
                GovLFee: '',
                CompanyLFee: '',
                DriverLFee: '',
                Levy: '',
                Driver_Comm_Rate: '',
                Company_Comm_Rate: '',
              });
            }
          },
          (error: any) => {
            reject(error);
          },
        );
      });
    } else {
      reject(new Error('db is undefined'));
    }
  });
};

export const selectCountFromDataTable = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          'SELECT * from datatable',
          [],
          (_tx: Transaction, results: ResultSet) => {
            const len = results.rows.length;
            resolve(len);
          },
          (_t, error) => {
            console.log(error);
            reject(error);
            return true; // rollback transaction in case of error
          },
        );
      });
    } else {
      console.log('db is undefined');
      reject('db is undefined');
    }
  });
};

interface Cab {
  Cab: string;
}
type FormValues = {
  [key: string]: string | boolean | string[] | Cab[];
  cabData: Cab[];
};
export const insertData = (
  formValues: FormValues,
  callback: (tx: Transaction, results: ResultSet) => void = () => {},
) => {
  if (db) {
    db.transaction((txn: Transaction) => {
      txn.executeSql(
        'INSERT INTO datatable (Date, Day, Shift, Taxi, Jobs, Ins, Hours_Worked, Total_Levy, Car_Wash, Meter_Start, Meter_Finish, Shift_Total, Com_GTN, Com_Driver, Km_Start, Km_Finish, Kms, Paidkm_Start, Paidkm_Finish, Paid_Kms, Unpaid_kms, Eftpos_Total, Eftpos_LFee, Dockets, Charge_Authority, Manual_MPTP_Total, No_of_Manual_Lifts, Total_Lifting_Fee_Value, Misc, Acc_Fuel, Net_Payin, manual_lifting_fee_value, no_wheelchair_lifts, company_portion_lifting_fee, driver_portion_lifting_fee, Deductions, Gov_Sub_Manual31, CPK, Gov_Sub_Manual, Driver_Comm_Rate, Company_Comm_Rate) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [
          formValues.date,
          formValues.day,
          formValues.shift,
          formValues.Taxi,
          formValues.numberofJobs,
          formValues.insurancefee,
          formValues.hours,
          formValues.totallevy,
          formValues.carwash,
          formValues.meter1,
          formValues.meter2,
          formValues.totalmeter,
          formValues.commissiongtn,
          formValues.commissiondriver,
          formValues.km1,
          formValues.km2,
          formValues.resultkm,
          formValues.paidkm1,
          formValues.paidkm2,
          formValues.resultpaidkm,
          formValues.unpaidkm,
          formValues.eftpos,
          formValues.eftposlifting,
          formValues.cc,
          formValues.chargeAuthority,
          formValues.manualMptp,
          formValues.numberofmanuallifting,
          formValues.totallifting,
          formValues.misc,
          formValues.accountFuel,
          formValues.netpayin,
          formValues.manuallifting,
          formValues.numberofChairs,
          formValues.gtnLFee,
          formValues.driverLFee,
          formValues.deductions,
          formValues.govSubManual31,
          formValues.cpk,
          formValues.manualMptp,
          formValues.drivercommrate,
          formValues.companycommrate,
        ],
        callback,
      );
    });
  } else {
    console.log('db is undefined');
  }
};

export const UpdateData = (
  searchByDate: string | number | null | undefined,
  dispatch: React.Dispatch<Action>,
) => {
  //console.log('res in updateData in dbUtility', searchByDate);
  return new Promise((resolve, reject) => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          'SELECT * FROM datatable where Date = ?',
          [searchByDate],
          (_tx: Transaction, results: ResultSet) => {
            if (results.rows.length > 0) {
              let res = results.rows.item(0);
              // console.log('res in updateData in dbUtility', res);
              resolve(res);
              dispatch({type: 'UPDATE', payload: res});
              Alert.alert('Search successfully');
            } else {
              reject(new Error('Search operation failed'));
            }
          },
          (error: any) => {
            reject(error);
          },
        );
      });
    } else {
      reject(new Error('db is undefined'));
    }
  });
};
