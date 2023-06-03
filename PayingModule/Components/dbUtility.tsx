import {Transaction, ResultSet} from '../Database/databaseTypes';
import {Alert} from 'react-native';
import db from '../Database/databaseService';
import {Action} from '../../Utilities/Actions';
import {FormValues} from '../Screens/Enter/component/EnterDataValues';

export function insertIntoCab(rego: string): Promise<ResultSet> {
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

export function deleteIntoCab(rego: string): Promise<ResultSet> {
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
          'SELECT GovLFee, DriverLFee, Levy, Driver_Comm_Rate FROM UpdateItems',
          [],
          (_tx: Transaction, results: ResultSet) => {
            var len = results.rows.length;
            if (len > 0) {
              let res = results.rows.item(0);
              resolve(res);
            } else {
              resolve({
                GovLFee: '',
                DriverLFee: '',
                Levy: '',
                Driver_Comm_Rate: '',
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

export const insertData = (
  formValues: FormValues,
  callback: (tx: Transaction, results: ResultSet) => void = () => {},
) => {
  if (db) {
    db.transaction((txn: Transaction) => {
      txn.executeSql(
        'INSERT INTO datatable (Date, Day, Shift, Taxi, Jobs_Done, Hours_Worked, Meter_Start, Meter_Finish, Km_Start, Km_Finish, Paidkm_Start, Paidkm_Finish, Eftpos, M3_Dockets, Electronic_Account_Payments, Total_Manual_MPTP31_And_MPTP_Values, Number_Of_Manual_Liftings, Eftpos_Lifting_Value, Car_Wash, Misc, Fuel, Insurance) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [
          formValues.Date,
          formValues.Day,
          formValues.Shift,
          formValues.Taxi,
          formValues.Jobs_Done,
          formValues.Hours_Worked,
          formValues.Meter_Start,
          formValues.Meter_Finish,
          formValues.Km_Start,
          formValues.Km_Finish,
          formValues.Paidkm_Start,
          formValues.Paidkm_Finish,
          formValues.Eftpos,
          formValues.M3_Dockets,
          formValues.Electronic_Account_Payments,
          formValues.Total_Manual_MPTP31_And_MPTP_Values,
          formValues.Number_Of_Manual_Liftings,
          formValues.Eftpos_Lifting_Value,
          formValues.Car_Wash,
          formValues.Misc,
          formValues.Fuel,
          formValues.Insurance,
        ],
        callback,
      );
    });
  } else {
    console.log('db is undefined');
  }
};

export const UpdateData = (
  Search_Date: string,
  dispatch: React.Dispatch<Action>,
) => {
  //console.log('res in updateData in dbUtility', searchByDate);
  return new Promise((resolve, reject) => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          'SELECT * FROM datatable where Date = ?',
          [Search_Date],
          (_tx: Transaction, results: ResultSet) => {
            if (results.rows.length > 0) {
              let res = results.rows.item(0);
              // console.log('res in updateData in dbUtility', res);
              resolve(res);
              dispatch({type: 'UPDATE', payload: {...res, Search_Date}});
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

export function updateDataInTable(formValues: FormValues): Promise<ResultSet> {
  return new Promise((resolve, reject) => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          `UPDATE datatable 
           SET Date = ?, Day = ?, Shift = ?, Taxi = ?, Jobs_Done = ?, Hours_Worked = ?, 
               Meter_Start = ?, Meter_Finish = ?, Km_Start = ?, Km_Finish = ?, Paidkm_Start = ?, 
               Paidkm_Finish = ?, Eftpos = ?, M3_Dockets = ?, Electronic_Account_Payments = ?, 
               Total_Manual_MPTP31_And_MPTP_Values = ?, Number_Of_Manual_Liftings = ?, 
               Eftpos_Lifting_Value = ?, Car_Wash = ?, Misc = ?, Fuel = ?, Insurance = ? 
           WHERE Date = ?`,
          [
            formValues.Date,
            formValues.Day,
            formValues.Shift,
            formValues.Taxi,
            formValues.Jobs_Done,
            formValues.Hours_Worked,
            formValues.Meter_Start,
            formValues.Meter_Finish,
            formValues.Km_Start,
            formValues.Km_Finish,
            formValues.Paidkm_Start,
            formValues.Paidkm_Finish,
            formValues.Eftpos,
            formValues.M3_Dockets,
            formValues.Electronic_Account_Payments,
            formValues.Total_Manual_MPTP31_And_MPTP_Values,
            formValues.Number_Of_Manual_Liftings,
            formValues.Eftpos_Lifting_Value,
            formValues.Car_Wash,
            formValues.Misc,
            formValues.Fuel,
            formValues.Insurance,
            formValues.Search_Date,
          ],
          (_tx: Transaction, results: ResultSet) => {
            if (results.rowsAffected > 0) {
              resolve(results);
              Alert.alert('Update operation successful');
            } else {
              reject(new Error('Update operation failed'));
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
