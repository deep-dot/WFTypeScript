// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, {useEffect} from 'react';
import {Transaction, ResultSet} from './databaseTypes';
import db from './databaseService';

const Database = () => {
 // console.log('db in database.tsx ==', db);

  //Home Screen
  useEffect(() => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='datatable'",
          [],
          (_tx: Transaction, res: ResultSet) => {
            if (res.rows.length === 0) {
              txn.executeSql('DROP TABLE IF EXISTS datatable', []);
              txn.executeSql(
                'CREATE TABLE IF NOT EXISTS datatable (user_id INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Date TEXT, Day TEXT, Shift TEXT, Taxi TEXT, Jobs NUMERIC, Ins NUMERIC, Hours_Worked NUMERIC, Total_Levy NUMERIC, Car_Wash NUMERIC, Meter_Start NUMERIC, Meter_Finish NUMERIC, Shift_Total NUMERIC, Com_GTN NUMERIC, Com_Driver NUMERIC, Km_Start NUMERIC, Km_Finish NUMERIC, Kms NUMERIC, Paidkm_Start NUMERIC, Paidkm_Finish NUMERIC, Paid_Kms NUMERIC, Unpaid_kms NUMERIC, Eftpos_Total NUMERIC, Eftpos_LFee NUMERIC, Dockets NUMERIC, Charge_Authority NUMERIC, Manual_MPTP_Total NUMERIC, No_of_Manual_Lifts NUMERIC, Total_Lifting_Fee_Value NUMERIC, Misc NUMERIC, Acc_Fuel NUMERIC, Net_Payin NUMERIC, Week_Ending_Date TEXT, Current_Date TEXT, manual_lifting_fee_value NUMERIC, no_wheelchair_lifts NUMERIC, company_portion_lifting_fee NUMERIC, driver_portion_lifting_fee NUMERIC, Gov_Sub_Manual NUMERIC, Gov_Sub_Manual31 NUMERIC, CPK NUMERIC, Deductions NUMERIC, Driver_Comm_Rate NUMERIC, Company_Comm_Rate NUMERIC)',
                [],
              );
            }
          },
        );
      });
    } else {
      console.log('db is undefined');
    }
  }, []);

  //Home Screen
  useEffect(() => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='nameweekendingtable'",
          [],
          (_tx: Transaction, res: ResultSet) => {
            console.log('table', res.rows.length);
            if (res.rows.length === 0) {
              txn.executeSql('DROP TABLE IF EXISTS nameweekendingtable', []);
              txn.executeSql(
                'CREATE TABLE IF NOT EXISTS nameweekendingtable (Name TEXT, Week_Ending_Date TEXT)',
                [],
              );
            }
          },
        );
      });
    } else {
      console.log('db is undefined');
    }
  }, []);

  //Taxi Picker from Ener Data Screen
  useEffect(() => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='cab'",
          [],
          (_tx: Transaction, res: ResultSet) => {
            if (res.rows.length === 0) {
              txn.executeSql('DROP TABLE IF EXISTS cab', []);
              txn.executeSql('CREATE TABLE IF NOT EXISTS cab (Cab TEXT)', []);
            }
          },
        );
      });
    } else {
      console.log('db is undefined');
    }
  }, []);

  return null;
};

export default Database;
