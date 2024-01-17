import {useEffect} from 'react';
import {Transaction, ResultSet} from './databaseTypes';
import db from './databaseService';

const initializeTable = (tableName: string, createTableSQL: string) => {
  if (db) {
    db.transaction((txn: Transaction) => {
      txn.executeSql(
        `SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}'`,
        [],
        (_tx: Transaction, res: ResultSet) => {
          if (res.rows.length === 0) {
            txn.executeSql(`DROP TABLE IF EXISTS ${tableName}`, []);
            txn.executeSql(createTableSQL, []);
          }
        },
      );
    });
  } else {
    console.log('db is undefined');
  }
};

// const Database = () => {
//   useEffect(() => {
//     initializeTable(
//       'datatable',
//       // 'CREATE TABLE IF NOT EXISTS datatable (Record_id INTEGER PRIMARY KEY AUTOINCREMENT, Name, Week_Ending_Date, Week_Ending_Day, Gov_Lifting_Fee TEXT, Driver_Share_In_LiftingFee TEXT, Gov_Levy TEXT, Driver_Comm_Rate TEXT, Company_Comm_Rate TEXT, Date TEXT, Day TEXT, Shift TEXT, Taxi TEXT, Jobs_Done NUMERIC, Hours_Worked NUMERIC, Meter_Start NUMERIC, Meter_Finish NUMERIC, Km_Start NUMERIC, Km_Finish NUMERIC, Paidkm_Start NUMERIC, Paidkm_Finish NUMERIC, Eftpos NUMERIC, M3_Dockets NUMERIC, Electronic_Account_Payments NUMERIC, Total_Manual_MPTP31_And_MPTP_Values NUMERIC, Number_Of_Manual_Liftings NUMERIC, Eftpos_Lifting_Value NUMERIC, Car_Wash NUMERIC, Misc NUMERIC, Fuel NUMERIC, Insurance NUMERIC)',
//       `CREATE TABLE IF NOT EXISTS datatable (
//         Record_id INTEGER PRIMARY KEY AUTOINCREMENT,
//         Name TEXT,
//         Week_Ending_Date TEXT,
//         Week_Ending_Day TEXT,
//         Gov_Lifting_Fee NUMERIC,
//         Driver_Share_In_LiftingFee NUMERIC,
//         Gov_Levy NUMERIC,
//         Driver_Comm_Rate NUMERIC,
//         Company_Comm_Rate NUMERIC,
//         Date TEXT,
//         Day TEXT,
//         Shift TEXT,
//         Taxi TEXT,
//         Hours_Worked NUMERIC,
//         Insurance NUMERIC,
//         Jobs_Done NUMERIC,
//         Meter_Start NUMERIC,
//         Meter_Finish NUMERIC,
//         Km_Start NUMERIC,
//         Km_Finish NUMERIC,
//         Paidkm_Start NUMERIC,
//         Paidkm_Finish NUMERIC,
//         Eftpos NUMERIC,
//         Eftpos_Liftings NUMERIC,
//         Number_Of_Manual_Liftings NUMERIC,
//         Total_Manual_MPTP31_And_MPTP_Values NUMERIC,
//         M3_Dockets NUMERIC,
//         Electronic_Account_Payments NUMERIC,
//         Car_Wash NUMERIC,
//         Misc NUMERIC,
//         Fuel NUMERIC,
//         Shift_Total NUMERIC,
//         Levy NUMERIC,
//         Kms NUMERIC,
//         Paid_Kms NUMERIC,
//         Unpaid_Kms NUMERIC,
//         CPK NUMERIC,
//         Number_Of_Chairs NUMERIC,
//         Driver_Lifting_Value NUMERIC,
//         Commission_Driver NUMERIC,
//         Deductions NUMERIC,
//         Net_Payin NUMERIC
//     )`,
//     );
//   }, []);

// useEffect(() => {
//   initializeTable(
//     'lifting',
//     'CREATE TABLE IF NOT EXISTS cab (id INTEGER PRIMARY KEY AUTOINCREMENT, Cab TEXT)',
//   );
// }, []);

const Database = () => {
  useEffect(() => {
    initializeTable(
      'datatable',
      `CREATE TABLE IF NOT EXISTS datatable (
        Record_id INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT,
        Week_Ending_Date TEXT,
        Week_Ending_Day TEXT,
        Gov_Lifting_Fee NUMERIC,
        Driver_Share_In_LiftingFee NUMERIC,
        Gov_Levy NUMERIC,
        Driver_Comm_Rate NUMERIC,
        Company_Comm_Rate NUMERIC,
        Date TEXT,
        Day TEXT,
        Shift TEXT,
        Taxi TEXT,        
        Hours_Worked NUMERIC,
        Insurance NUMERIC,
        Jobs_Done NUMERIC,
        meterTotal NUMERIC,
        Shift_Total NUMERIC,
        Kms NUMERIC,
        Paid_Kms NUMERIC,
        Eftpos NUMERIC,
        Eftpos_Liftings NUMERIC,
        Number_Of_Manual_Liftings NUMERIC,   
        Total_Manual_MPTP31_And_MPTP_Values NUMERIC,  
        M3_Dockets NUMERIC,
        Electronic_Account_Payments NUMERIC,                   
        Car_Wash NUMERIC,
        Misc NUMERIC,
        Fuel NUMERIC,          
        Levy NUMERIC,
        Unpaid_Kms NUMERIC,
        CPK NUMERIC,
        Number_Of_Chairs NUMERIC,
        Driver_Lifting_Value NUMERIC,
        Commission_Driver NUMERIC,
        Deductions NUMERIC,
        Net_Payin NUMERIC
    )`,
    );
  }, []);

  useEffect(() => {
    initializeTable(
      'cab',
      'CREATE TABLE IF NOT EXISTS cab (id INTEGER PRIMARY KEY AUTOINCREMENT, Cab TEXT)',
    );
  }, []);

  return null;
};

export default Database;
