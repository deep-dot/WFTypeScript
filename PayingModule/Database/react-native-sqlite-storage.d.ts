// declare module 'react-native-sqlite-storage' {
//   interface SQLiteDatabase {
//     transaction: (callback: Function) => void;
//     executeSql: (
//       sqlStatement: string,
//       args?: any[],
//       callback?: (transaction: any, resultSet: any) => void,
//       error?: (transaction: any, error: any) => void,
//     ) => void;
//   }

//   export function openDatabase(
//     databaseName: any,
//     version: string,
//     description: string,
//     size: number,
//     callback?: () => void,
//     errorCallback?: (err: any) => void,
//   ): SQLiteDatabase;
// }


declare module 'react-native-sqlite-storage' {
  import {Transaction, ResultSet} from './databaseTypes';

  interface SQLiteDatabase {
    transaction: (callback: (transaction: Transaction) => void) => void;
    executeSql: (
      sqlStatement: string,
      args?: any[],
      callback?: (transaction: Transaction, resultSet: ResultSet) => void,
      error?: (transaction: Transaction, error: any) => void,
    ) => void;
  }

  export function openDatabase(
    databaseName: any,
    version: string,
    description: string,
    size: number,
    callback?: () => void,
    errorCallback?: (err: any) => void,
  ): SQLiteDatabase;
}
