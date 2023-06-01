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
                'CREATE TABLE IF NOT EXISTS datatable (Record_id INTEGER PRIMARY KEY AUTOINCREMENT, Date TEXT, Day TEXT, Shift TEXT, Taxi TEXT, Jobs_Done NUMERIC, Hours_Worked NUMERIC, Meter_Start NUMERIC, Meter_Finish NUMERIC, Km_Start NUMERIC, Km_Finish NUMERIC, Paidkm_Start NUMERIC, Paidkm_Finish NUMERIC, Eftpos NUMERIC, M3_Dockets NUMERIC, Electronic_Account_Payments NUMERIC, Total_Manual_MPTP31_And_MPTP_Values NUMERIC, Number_Of_Manual_Liftings NUMERIC, Eftpos_Lifting_Value NUMERIC, Car_Wash NUMERIC, Misc NUMERIC, Fuel NUMERIC, Insurance NUMERIC)',
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
