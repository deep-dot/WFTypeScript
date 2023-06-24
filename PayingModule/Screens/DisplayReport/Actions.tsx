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
          'SELECT Date as Date, SUM(Jobs_Done) as Jobs_Done, SUM(Insurance) as Insurance, SUM(Hours_Worked) as Hours_Worked, SUM(Shift_Total) as Shift_Total, SUM(Kms) as Kms, SUM(Paid_Kms) as Paid_Kms, SUM(Eftpos) as Eftpos, SUM(Number_Of_Manual_Liftings) as Number_Of_Manual_Liftings, SUM(Total_Manual_MPTP31_And_MPTP_Values) as Total_Manual_MPTP31_And_MPTP_Values, SUM(M3_Dockets) as M3_Dockets, SUM(Electronic_Account_Payments) as Electronic_Account_Payments, SUM(Car_Wash) as Car_Wash, SUM(Misc) as Misc, SUM(Fuel) as Fuel, SUM(Net_Payin) as Net_Payin FROM datatable',
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
