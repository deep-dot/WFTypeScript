import React from 'react';
import {Transaction, ResultSet} from '../../Database/databaseTypes';
import {Alert} from 'react-native';
import db from '../../Database/databaseService';
import {Action} from '../../../Utilities/Actions';
import {FormValues} from '../../Components/EnterDataValues';

export const SelectCountFromDataTable = (
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
            if (len > 0) {
              const temp = [];
              for (let j = 0; j < len; j++) {
                temp.push(results.rows.item(j));
              }
              //resolve({len, temp});
              resolve(temp);
              dispatch({
                type: 'UPDATE',
                payload: {Number_Of_Entries: len},
              });
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
