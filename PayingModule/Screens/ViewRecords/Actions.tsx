import React from 'react';
import {Transaction, ResultSet} from '../../Database/databaseTypes';
import {Alert} from 'react-native';
import db from '../../Database/databaseService';
import {Action} from '../../../Utilities/Actions';
import {FormValues} from '../../Components/EnterDataValues';

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
