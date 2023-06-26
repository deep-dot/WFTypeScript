import SQLite from 'react-native-sqlite-storage';

type Transaction = {
  executeSql: (
    sql: string,
    args?: any[],
    success?: (transaction: Transaction, resultSet: ResultSet) => void,
    error?: (transaction: Transaction, error: any) => void,
  ) => void;
};

type ResultSet = {
  rowsAffected: number;
  insertId?: number;
  rows: {
    length: number;
    item: (index: number) => any;
    _array: any[];
  };
};

interface SQLiteDatabase {
  transaction: (callback: (transaction: Transaction) => void) => void;
  executeSql: (
    sqlStatement: string,
    args?: any[],
    callback?: (transaction: Transaction, resultSet: ResultSet) => void,
    error?: (transaction: Transaction, error: any) => void,
  ) => void;
}
let db: SQLiteDatabase | undefined;
db = (SQLite.openDatabase as any)(
  //{name: 'database.db', createFromLocation: 1},
  {name: 'database.db'},
  () => {},
  (error: any) => {
    console.log('ERROR:' + error);
  },
);

export default db;
