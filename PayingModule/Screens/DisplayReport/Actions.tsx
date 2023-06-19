import React from 'react';
import {Transaction, ResultSet} from '../../Database/databaseTypes';
import {Alert} from 'react-native';
import db from '../../Database/databaseService';
import {Action} from '../../../Utilities/Actions';
import {FormValues} from '../../Components/EnterDataValues';

export const totalTable = (
  dispatch: React.Dispatch<Action>,
): Promise<FormValues[]> => {
  return new Promise((resolve, reject) => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          'SELECT Date as Date, SUM(Jobs_Done) as Jobs_Done, SUM(Insurance) as Insurance FROM datatable',
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

// export const SelectFromDataTable = (
//   dispatch: React.Dispatch<Action>,
// ): Promise<FormValues[]> => {
//   return new Promise((resolve, reject) => {
//     if (db) {
//       db.transaction((txn: Transaction) => {
//         txn.executeSql(
//           'SELECT * from datatable',
//           [],
//           (_tx: Transaction, results: ResultSet) => {
//             var len = results.rows.length;
//             dispatch({
//               type: 'UPDATE',
//               payload: {
//                 ...results.rows.item(len - 1),
//                 Number_Of_Entries: len,
//               },
//             });
//           },
//           (_t, error) => {
//             console.log(error);
//             reject(error);
//             return true;
//           },
//         );
//       });
//     } else {
//       console.log('db is undefined');
//       reject('db is undefined');
//     }
//   });
// };
