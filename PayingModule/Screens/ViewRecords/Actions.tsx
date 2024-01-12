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
  console.log('res in updateData in dbUtility', start_date, finish_date);
  return new Promise((resolve, reject) => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          'SELECT * from datatable where Date between ? and ? order by Date',
          [start_date, finish_date],
          (_tx: Transaction, results: ResultSet) => {
            console.log(
              'results.rowsAffected===',
              results.rows.length,
              results.rows,
            );
            if (results.rows.length > 0) {
              let res: any[] = [];
              for (let i = 0; i < results.rows.length; i++) {
                res.push(results.rows.item(i));
              }
              resolve(res);
              //Alert.alert('Search successfully');
            } else {
              Alert.alert('No record exist on this date');
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
              resolve('Deleted successfully');
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
