import React from 'react';
import {Transaction, ResultSet} from '../PayingModule/Database/databaseTypes';
import {Alert} from 'react-native';
import db from '../PayingModule/Database/databaseService';
import {FormValues} from '../PayingModule/Components/EnterDataValues';

export type Action =
  | {type: 'INSERT'; payload: any}
  | {type: 'SELECT'; payload: any}
  | {type: 'UPDATE'; payload: any}
  | {type: 'DELETE'; payload: any}
  | {type: 'REFRESH'; payload: any}
  | {type: 'ERROR'; error: Error};

// weekEndingTable

export const selectWeekEndingTable = (dispatch: React.Dispatch<Action>) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject(new Error('db is undefined'));
    }
    db.transaction((txn: Transaction) => {
      txn.executeSql(
        'SELECT * FROM weekEndingTable',
        [],
        (_tx: Transaction, results: ResultSet) => {
          var len = results.rows.length;
          if (len > 0) {
            let temp = results.rows.item(0);
            dispatch({
              type: 'SELECT',
              payload: {data: temp, table: 'weekEndingTable'},
            });
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
  });
};
export function saveWeekEndingData(
  state: FormValues,
  dispatch: React.Dispatch<Action>,
  id?: number, // id is optional. If provided, update; if not, insert.
): Promise<ResultSet> {
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject(new Error('db is undefined'));
    }
    db.transaction((txn: Transaction) => {
      let query = '';
      let params = [];
      if (id) {
        query = `UPDATE weekEndingTable
                 SET Name = ?, Week_Ending_Date = ?, Week_Ending_Day = ?
                 WHERE id = ?`;
        params = [
          state.Name,
          state.Week_Ending_Date,
          state.Week_Ending_Day,
          id,
        ];
      } else {
        // id is not provided, perform insert
        query = `INSERT INTO weekEndingTable (
          Name, Week_Ending_Date, Week_Ending_Day) VALUES(?,?,?
          )`;
        params = [state.Name, state.Week_Ending_Date, state.Week_Ending_Day];
      }

      txn.executeSql(
        query,
        params,
        (_tx: Transaction, result: ResultSet) => {
          if (result.rowsAffected > 0) {
            const operationId = id ? id : result.insertId;
            dispatch({
              type: id ? 'UPDATE' : 'INSERT',
              payload: {insertId: operationId, table: 'weekEndingTable'},
            });
            resolve(result);
            Alert.alert(id ? 'Update successful' : 'Insert successful');
          } else {
            reject(
              new Error(
                id ? 'Update operation failed' : 'Insert operation failed',
              ),
            );
          }
        },
        (error: any) => {
          console.log('SQL execution error: ', error);
          reject(error);
        },
      );
    });
  });
}

// liftingTable

export const selectLiftingTable = (dispatch: React.Dispatch<Action>) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject(new Error('db is undefined'));
    }
    db.transaction((txn: Transaction) => {
      txn.executeSql(
        'SELECT * FROM liftingTable',
        [],
        (_tx: Transaction, results: ResultSet) => {
          var len = results.rows.length;
          if (len > 0) {
            let temp = results.rows.item(0);
            dispatch({
              type: 'SELECT',
              payload: {data: temp, table: 'liftingTable'},
            });
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
  });
};
export function upsertLiftingTable(
  state: FormValues,
  dispatch: React.Dispatch<Action>,
  id?: number, // Optional ID. If provided, perform an update; if not, perform an insert.
): Promise<ResultSet> {
  let Company_Comm_Rate = 100 - state.Driver_Comm_Rate;
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject(new Error('db is undefined'));
    }
    db.transaction((txn: Transaction) => {
      let query = '';
      let params = [];

      if (id) {
        query = `UPDATE liftingTable
                 SET Gov_Lifting_Fee = ?, Driver_Share_In_LiftingFee = ?, Gov_Levy = ?, Driver_Comm_Rate = ?, Company_Comm_Rate = ?
                 WHERE id = ?`;
        params = [
          state.Gov_Lifting_Fee,
          state.Driver_Share_In_LiftingFee,
          state.Gov_Levy,
          state.Driver_Comm_Rate,
          Company_Comm_Rate,
          id,
        ];
      } else {
        query = `INSERT INTO liftingTable (
          Gov_Lifting_Fee, Driver_Share_In_LiftingFee, Gov_Levy, Driver_Comm_Rate, Company_Comm_Rate
        ) VALUES (?, ?, ?, ?, ?)`;
        params = [
          state.Gov_Lifting_Fee,
          state.Driver_Share_In_LiftingFee,
          state.Gov_Levy,
          state.Driver_Comm_Rate,
          Company_Comm_Rate,
        ];
      }

      txn.executeSql(
        query,
        params,
        (_tx: Transaction, result: ResultSet) => {
          if (result.rowsAffected > 0) {
            const operationId = id ? id : result.insertId;
            dispatch({
              type: id ? 'UPDATE' : 'INSERT',
              payload: {insertId: operationId, table: 'liftingTable'},
            });
            resolve(result);
            //Alert.alert(id ? 'Update successful' : 'Insert successful');
          } else {
            reject(
              new Error(
                id ? 'Update operation failed' : 'Insert operation failed',
              ),
            );
          }
        },
        (error: any) => {
          console.log('SQL execution error: ', error);
          reject(error);
        },
      );
    });
  });
}

// Cab

export function insertCab(
  rego: string,
  dispatch: React.Dispatch<Action>,
): Promise<ResultSet> {
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject(new Error('db is undefined'));
    }
    db.transaction((txn: Transaction) => {
      txn.executeSql(
        'INSERT INTO cab (Cab) VALUES (?)',
        [rego],
        async (_tx: Transaction, result: ResultSet) => {
          if (result.rowsAffected > 0) {
            resolve(result);
            dispatch({
              type: 'INSERT',
              payload: {table: 'cab', rego},
            });
          } else {
            reject(new Error('Insert operation failed'));
          }
        },
        (error: any) => {
          Alert.alert('No duplicate entry is allowed');
          reject(error);
        },
      );
    });
  });
}

export const SelectCab = (dispatch: React.Dispatch<Action>) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject(new Error('db is undefined'));
    }
    db.transaction((txn: Transaction) => {
      txn.executeSql(
        'SELECT * FROM cab',
        [],
        (_tx: Transaction, results: ResultSet) => {
          var len = results.rows.length;
          if (len > 0) {
            let temp = [];
            for (let j = 0; j < len; j++) {
              temp.push(results.rows.item(j));
            }
            const filteredRes = temp.filter(item => item.Cab != null);
            if (filteredRes.length > 0) {
              dispatch({
                type: 'SELECT',
                payload: {data: filteredRes, table: 'cab'},
              });
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
  });
};

export function deleteCab(
  rego: string,
  dispatch: React.Dispatch<Action>,
): Promise<ResultSet> {
  //console.log('deleteCab==', rego);
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject(new Error('db is undefined'));
    }
    db.transaction((txn: Transaction) => {
      txn.executeSql(
        'DELETE FROM cab where Cab = ?',
        [rego],
        async (_tx: Transaction, results: ResultSet) => {
          if (results.rowsAffected > 0) {
            resolve(results);
            dispatch({
              type: 'DELETE',
              payload: {rego, table: 'cab'},
            });
          } else {
            reject(new Error('Delete operation failed'));
          }
        },
        (error: any) => {
          reject(error);
        },
      );
    });
  });
}

//main data

export const upsertData = (
  state: FormValues,
  dispatch: React.Dispatch<Action>,
) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      Alert.alert('Database not initialized');
      return reject(new Error('Database is undefined'));
    }
    if (!state.Date || state.Date === '') {
      Alert.alert('Please select a date');
      return reject(new Error('Date is required'));
    }

    const isUpdate = state.Search_Date && state.Search_Date !== '';

    const query = isUpdate
      ? `UPDATE datatable
      SET Date = ?, Day = ?, Shift = ?, Taxi = ?, Jobs_Done = ?, Hours_Worked = ?, 
      meterTotal = ?, Kms = ?,
      Paid_Kms = ?, Eftpos = ?, M3_Dockets = ?, Electronic_Account_Payments = ?, 
      Total_Manual_MPTP31_And_MPTP_Values = ?, Number_Of_Manual_Liftings = ?, 
      Eftpos_Liftings = ?, Car_Wash = ?, Misc = ?, Fuel = ?, Insurance = ?,  Shift_Total = ?,
      Levy = ?,
      Unpaid_Kms = ?,
      CPK = ?,
      Number_Of_Chairs = ?,
      Driver_Lifting_Value = ?,
      Commission_Driver = ?,
      Deductions = ?,
      Net_Payin = ?
  WHERE Date = ?`
      : `INSERT INTO datatable (Date, Day, Shift, Taxi, Jobs_Done, Hours_Worked, meterTotal, Kms, Paid_Kms, Eftpos, M3_Dockets, Electronic_Account_Payments, Total_Manual_MPTP31_And_MPTP_Values, Number_Of_Manual_Liftings, Eftpos_Liftings, Car_Wash, Misc, Fuel, Insurance,  
        Shift_Total,
        Levy,
        Unpaid_Kms,
        CPK,
        Number_Of_Chairs,
        Driver_Lifting_Value,
        Commission_Driver,
        Deductions,
        Net_Payin) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    const params = isUpdate
      ? [
          state.Date,
          state.Day,
          state.Shift,
          state.Taxi,
          state.Jobs_Done,
          state.Hours_Worked,
          state.meterTotal,
          state.Kms,
          state.Paid_Kms,
          state.Eftpos,
          state.M3_Dockets,
          state.Electronic_Account_Payments,
          state.Total_Manual_MPTP31_And_MPTP_Values,
          state.Number_Of_Manual_Liftings,
          state.Eftpos_Liftings,
          state.Car_Wash,
          state.Misc,
          state.Fuel,
          state.Insurance,
          state.Shift_Total,
          state.Levy,
          state.Unpaid_Kms,
          state.CPK,
          state.Number_Of_Chairs,
          state.Driver_Lifting_Value,
          state.Commission_Driver,
          state.Deductions,
          state.Net_Payin,
          state.Search_Date,
        ]
      : [
          state.Date,
          state.Day,
          state.Shift,
          state.Taxi,
          state.Jobs_Done,
          state.Hours_Worked,
          state.meterTotal,
          state.Kms,
          state.Paid_Kms,
          state.Eftpos,
          state.M3_Dockets,
          state.Electronic_Account_Payments,
          state.Total_Manual_MPTP31_And_MPTP_Values,
          state.Number_Of_Manual_Liftings,
          state.Eftpos_Liftings,
          state.Car_Wash,
          state.Misc,
          state.Fuel,
          state.Insurance,
          state.Shift_Total,
          state.Levy,
          state.Unpaid_Kms,
          state.CPK,
          state.Number_Of_Chairs,
          state.Driver_Lifting_Value,
          state.Commission_Driver,
          state.Deductions,
          state.Net_Payin,
        ];

    db.transaction((txn: Transaction) => {
      txn.executeSql(
        query,
        params,
        (tr: Transaction, resultSet: ResultSet) => {
          if (resultSet.rowsAffected > 0) {
            const actionType = isUpdate ? 'UPDATE' : 'INSERT';
            const message = isUpdate
              ? 'Record updated successfully!'
              : 'Record inserted successfully!';
            resolve(message);
            Alert.alert(message);
            dispatch({
              type: actionType,
              payload: {insertId: resultSet.insertId, table: 'datatable'},
            });
          } else {
            const error = new Error(
              isUpdate ? 'Update operation failed' : 'Insert operation failed',
            );
            reject(error);
            Alert.alert(error.message);
          }
        },
        (error: any) => {
          reject(error);
          Alert.alert('Database operation failed', error.message);
        },
      );
    });
  });
};

export const Select = (
  dispatch: React.Dispatch<Action>,
): Promise<FormValues[]> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject(new Error('db is undefined'));
    }
    db.transaction((txn: Transaction) => {
      txn.executeSql(
        'SELECT * from datatable',
        [],
        (_tx: Transaction, results: ResultSet) => {
          const len = results.rows.length;
          if (len > 0) {
            const lastRowData = results.rows.item(len - 1);
            dispatch({
              type: 'UPDATE',
              payload: {
                lastRowData,
                Number_Of_Entries: len,
              },
            });
          } else {
            // Handle the case where there are no entries
            dispatch({
              type: 'UPDATE',
              payload: {
                lastRowData: null,
                Number_Of_Entries: 0,
              },
            });
          }
        },
        (_t, error) => {
          console.log(error);
          reject(error);
          return true;
        },
      );
    });
  });
};

// View records

export const ViewRecordsByDate = (
  start_date: string,
  finish_date: string,
): Promise<FormValues[]> => {
  return new Promise((resolve, reject) => {
    if (!db) {
      return reject(new Error('db is undefined'));
    }

    db.transaction(txn => {
      txn.executeSql(
        'SELECT * FROM datatable WHERE Date BETWEEN ? AND ? ORDER BY Date',
        [start_date, finish_date],
        (_tx, results) => {
          if (results.rows.length > 0) {
            const res = Array.from({length: results.rows.length}, (_, i) =>
              results.rows.item(i),
            );
            resolve(res);
          } else {
            Alert.alert('No record exist on this date');
            reject(new Error('No records found'));
          }
        },
        error => {
          reject(error);
        },
      );
    });
  });
};

export const SelectFromDataTable = (
  dispatch: React.Dispatch<Action>,
): Promise<FormValues[]> => {
  return new Promise((resolve, reject) => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          'SELECT * from datatable',
          [],
          (_tx: Transaction, results: ResultSet) => {
            if (results.rows.length > 0) {
              const temp: any[] = [];
              for (let j = 0; j < results.rows.length; j++) {
                temp.push(results.rows.item(j));
              }
              resolve(temp);
              dispatch({type: 'UPDATE', payload: results.rows.length});
            } else {
              Alert.alert('Data does not exist');
            }
          },
          (_t, error) => {
            console.log(error);
            reject(error);
            return true;
          },
        );
      });
    } else {
      console.log('db is undefined');
      reject('db is undefined');
    }
  });
};

export const UpdateData = (
  Search_Date: string,
  dispatch: React.Dispatch<Action>,
) => {
  return new Promise((resolve, reject) => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          'SELECT * FROM datatable where Date = ?',
          [Search_Date],
          (_tx: Transaction, results: ResultSet) => {
            if (results.rows.length > 0) {
              let res = results.rows.item(0);
              dispatch({type: 'UPDATE', payload: {...res, Search_Date}});
              resolve(res);
            } else {
              reject();
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

export const deleteDataInTable = (date: string) => {
  // console.log('date in deleteDatatable',date);
  return new Promise((resolve, reject) => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          'DELETE FROM datatable WHERE Date = ?',
          [date],
          // 'DELETE FROM datatable WHERE Date IS NULL',
          // [],
          (_tx: Transaction, results: ResultSet) => {
            if (results.rowsAffected > 0) {
              resolve({
                status: 'Deleted successfully',
                length: results.rowsAffected,
              });
            } else {
              reject(new Error('No data found for the provided date'));
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

// display report

export const totalTable = (
  dispatch: React.Dispatch<Action>,
): Promise<FormValues[]> => {
  return new Promise((resolve, reject) => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          'SELECT Date as Date, SUM(Jobs_Done) as Jobs_Done, SUM(Insurance) as Insurance, SUM(Hours_Worked) as Hours_Worked, SUM(Shift_Total) as Shift_Total, SUM(Kms) as Kms, SUM(Paid_Kms) as Paid_Kms, SUM(Eftpos) as Eftpos, SUM(Number_Of_Manual_Liftings) as Number_Of_Manual_Liftings, SUM(Number_Of_Chairs) as Number_Of_Chairs, SUM(Total_Manual_MPTP31_And_MPTP_Values) as Total_Manual_MPTP31_And_MPTP_Values, SUM(M3_Dockets) as M3_Dockets, SUM(Electronic_Account_Payments) as Electronic_Account_Payments, SUM(Car_Wash) as Car_Wash, SUM(Misc) as Misc, SUM(Fuel) as Fuel, AVG(CPK) as CPK, SUM(Net_Payin) as Net_Payin FROM datatable',
          [],
          (tx: Transaction, results: ResultSet) => {
            // console.log('results in display report===', results.rows.item(0));
            var len = results.rows.length;
            if (len >= 0) {
              resolve(results.rows.item(0));
              dispatch({
                type: 'UPDATE',
                payload: {
                  total: results.rows.item(0),
                },
              });
            } else {
              Alert.alert('No data found');
            }
          },
        );
      });
    } else {
      console.log('db is undefined');
      reject('db is undefined');
    }
  });
};
