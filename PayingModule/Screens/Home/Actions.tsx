import React from 'react';
import {Transaction, ResultSet} from '../../Database/databaseTypes';
// import {Alert} from 'react-native';
import db from '../../Database/databaseService';
import {Action} from '../../../Utilities/Actions';
import {FormValues} from '../../Components/EnterDataValues';
// import {StackNavigationProp} from '@react-navigation/stack';
// import {StackParamList} from '../../../App';

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
