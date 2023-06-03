import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';

let db: SQLiteDatabase | undefined;
db = (SQLite.openDatabase as any)(
  {name: 'database.db', createFromLocation: 1},
  () => {},
  (error: any) => {
    console.log('ERROR:' + error);
  },
);

export default db;
