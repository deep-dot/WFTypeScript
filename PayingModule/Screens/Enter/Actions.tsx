import React from 'react';
import {Transaction, ResultSet} from '../../Database/databaseTypes';
import {Alert} from 'react-native';
import db from '../../Database/databaseService';
import {Action} from '../../../Utilities/Actions';
import {FormValues} from '../../Components/EnterDataValues';

export const Select = (
  dispatch: React.Dispatch<Action>,
): Promise<FormValues[]> => {
  return new Promise((resolve, reject) => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          'SELECT * from datatable',
          [],
          (_tx: Transaction, results: ResultSet) => {
            var len = results.rows.length;
            // console.log(
            //   'from datatable in Home actions===',
            //   results.rows.item(len - 1).Name,
            //   results.rows.item(len - 1).Week_Ending_Date,
            //   results.rows.item(len - 1),
            // );
            dispatch({
              type: 'UPDATE',
              payload: {
                ...results.rows.item(len - 1),
                Number_Of_Entries: len,
              },
            });
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

export const Insert = (state: FormValues, dispatch: React.Dispatch<Action>) => {
  let Company_Comm_Rate = 100 - state.Driver_Comm_Rate;
  return new Promise((resolve, reject) => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          'SELECT * FROM datatable WHERE Date = ?',
          [state.Date],
          (_: Transaction, results: ResultSet) => {
            if (results.rows.length > 0) {
              // Record with same date already exists.
              resolve('Same Date');
              Alert.alert(
                'A record with this date already exists. Please choose another date.',
              );
            } else {
              txn.executeSql(
                'INSERT INTO datatable (Name, Week_Ending_Date, Week_Ending_Day, Gov_Lifting_Fee, Driver_Share_In_LiftingFee, Gov_Levy, Driver_Comm_Rate, Company_Comm_Rate, Date, Day, Shift, Taxi, Jobs_Done, Hours_Worked, Meter_Start, Meter_Finish, Km_Start, Km_Finish, Paidkm_Start, Paidkm_Finish, Eftpos, M3_Dockets, Electronic_Account_Payments, Total_Manual_MPTP31_And_MPTP_Values, Number_Of_Manual_Liftings, Eftpos_Lifting_Value, Car_Wash, Misc, Fuel, Insurance) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
                [
                  state.Name,
                  state.Week_Ending_Date,
                  state.Week_Ending_Day,
                  state.Gov_Lifting_Fee,
                  state.Driver_Share_In_LiftingFee,
                  state.Gov_Levy,
                  state.Driver_Comm_Rate,
                  Company_Comm_Rate,
                  state.Date,
                  state.Day,
                  state.Shift,
                  state.Taxi,
                  state.Jobs_Done,
                  state.Hours_Worked,
                  state.Meter_Start,
                  state.Meter_Finish,
                  state.Km_Start,
                  state.Km_Finish,
                  state.Paidkm_Start,
                  state.Paidkm_Finish,
                  state.Eftpos,
                  state.M3_Dockets,
                  state.Electronic_Account_Payments,
                  state.Total_Manual_MPTP31_And_MPTP_Values,
                  state.Number_Of_Manual_Liftings,
                  state.Eftpos_Lifting_Value,
                  state.Car_Wash,
                  state.Misc,
                  state.Fuel,
                  state.Insurance,
                ],
                (transaction: Transaction, resultSet: ResultSet) => {
                  if (resultSet.rowsAffected > 0) {
                    resolve('Inserted');
                    Alert.alert(
                      'Record Saved Successfully!',
                      'Do you want to add another record?',
                      [
                        {
                          text: 'Yes',
                          onPress: () => {
                            dispatch({type: 'REFRESH', payload: null});
                          },
                        },
                        {
                          text: 'No',
                          onPress: () => {
                            // navigation.navigate('Home');
                          },
                        },
                        {
                          text: 'Cancel',
                          style: 'cancel',
                        },
                      ],
                      {cancelable: true},
                    );
                  } else {
                    reject(new Error('Insert operation failed'));
                  }
                },
                (error: any) => {
                  reject(error);
                },
              );
            }
          },
        );
      });
    } else {
      console.log('db is undefined');
    }
  });
};

export function Update(
  state: FormValues,
  dispatch: React.Dispatch<Action>,
): Promise<ResultSet> {
  let Company_Comm_Rate = 100 - state.Driver_Comm_Rate;
  return new Promise((resolve, reject) => {
    if (db) {
      db.transaction((txn: Transaction) => {
        if (state.Search_Date) {
          txn.executeSql(
            `UPDATE datatable 
             SET Date = ?, Day = ?, Shift = ?, Taxi = ?, Jobs_Done = ?, Hours_Worked = ?, 
                 Meter_Start = ?, Meter_Finish = ?, Km_Start = ?, Km_Finish = ?, Paidkm_Start = ?, 
                 Paidkm_Finish = ?, Eftpos = ?, M3_Dockets = ?, Electronic_Account_Payments = ?, 
                 Total_Manual_MPTP31_And_MPTP_Values = ?, Number_Of_Manual_Liftings = ?, 
                 Eftpos_Lifting_Value = ?, Car_Wash = ?, Misc = ?, Fuel = ?, Insurance = ? 
             WHERE Date = ?`,
            [
              state.Date,
              state.Day,
              state.Shift,
              state.Taxi,
              state.Jobs_Done,
              state.Hours_Worked,
              state.Meter_Start,
              state.Meter_Finish,
              state.Km_Start,
              state.Km_Finish,
              state.Paidkm_Start,
              state.Paidkm_Finish,
              state.Eftpos,
              state.M3_Dockets,
              state.Electronic_Account_Payments,
              state.Total_Manual_MPTP31_And_MPTP_Values,
              state.Number_Of_Manual_Liftings,
              state.Eftpos_Lifting_Value,
              state.Car_Wash,
              state.Misc,
              state.Fuel,
              state.Insurance,
              state.Search_Date,
            ],
            (_tx: Transaction, results: ResultSet) => {
              if (results.rowsAffected > 0) {
                dispatch({
                  type: 'UPDATE',
                  payload: {
                    Search_Date: '',
                  },
                });
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
        } else {
          txn.executeSql(
            `UPDATE datatable
             SET Gov_Lifting_Fee = ?, Driver_Share_In_LiftingFee = ?, Gov_Levy = ?, Driver_Comm_Rate = ?, Company_Comm_Rate = ? WHERE Week_Ending_Date = ?`,
            [
              state.Gov_Lifting_Fee,
              state.Driver_Share_In_LiftingFee,
              state.Gov_Levy,
              state.Driver_Comm_Rate,
              Company_Comm_Rate,
              state.Week_Ending_Date,
            ],
            (_tx: Transaction, result: ResultSet) => {
              if (result.rowsAffected > 0) {
                console.log(result);
                dispatch({type: 'UPDATE', payload: result});
                resolve(result);
                Alert.alert('Update operation successful');
              } else {
                reject(new Error('Update operation failed'));
              }
            },
            (error: any) => {
              console.log('SQL execution error: ', error);
              reject(error);
            },
          );
        }
      });
    } else {
      reject(new Error('db is undefined'));
    }
  });
}

// Cab

export function insertCab(
  rego: string,
  cabCount: number,
  dispatch: React.Dispatch<Action>,
): Promise<ResultSet> {
  console.log('formValues.rego==', cabCount);
  return new Promise((resolve, reject) => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          'INSERT INTO cab (Cab) VALUES (?)',
          [rego],
          async (_tx: Transaction, results: ResultSet) => {
            if (results.rowsAffected > 0) {
              resolve(results);
              Alert.alert('Added successfully');
              dispatch({
                type: 'UPDATE',
                payload: {cabCount: cabCount + 1},
              });
              await SelectCab(dispatch);
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

export function deleteCab(
  rego: string,
  cabCount: number,
  dispatch: React.Dispatch<Action>,
): Promise<ResultSet> {
  console.log('deleteCab==', cabCount);
  return new Promise((resolve, reject) => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          'DELETE FROM cab where Cab = ?',
          [rego],
          async (_tx: Transaction, results: ResultSet) => {
            if (results.rowsAffected > 0) {
              resolve(results);
              Alert.alert('Deleted successfully');
              dispatch({
                type: 'UPDATE',
                payload: cabCount,
              });
              await SelectCab(dispatch);
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

export const SelectCab = (dispatch: React.Dispatch<Action>) => {
  return new Promise((resolve, reject) => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          'SELECT Cab FROM cab',
          [],
          (_tx: Transaction, results: ResultSet) => {
            var len = results.rows.length;
            if (len > 0) {
              const temp: any[] = [];
              for (let j = 0; j < len; j++) {
                temp.push(results.rows.item(j));
              }
              //console.log('temp', temp);
              resolve(temp);
              const filteredRes = temp.filter(item => item.Cab != null);
              if (filteredRes.length > 0) {
                dispatch({type: 'UPDATE', payload: {Cab_Data: filteredRes}});
              }
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
