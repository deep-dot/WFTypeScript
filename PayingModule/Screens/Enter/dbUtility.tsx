import {Transaction, ResultSet} from '../../databaseTypes';

export function insertIntoCab(db: any, rego: string): Promise<ResultSet> {
  return new Promise((resolve, reject) => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          'INSERT INTO cab (Cab) VALUES (?)',
          [rego],
          (_tx: Transaction, results: ResultSet) => {
            if (results.rowsAffected > 0) {
              resolve(results);
            } else {
              reject(new Error('Insert operation failed'));
            }
          },
          (error: any) => {
            reject(error);
          },
        );
      });
    } else {
      reject(new Error('db is undefined'));
    }
  });
}

export const selectFromCab = (db: any): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          'SELECT * FROM cab',
          [],
          (_tx: Transaction, results: ResultSet) => {
            var len = results.rows.length;
            if (len > 0) {
              const temp = [];
              for (let j = 0; j < len; j++) {
                temp.push(results.rows.item(j));
              }
              resolve(temp);
            } else {
              resolve([]);
            }
          },
          (error: any) => {
            reject(error);
          },
        );
      });
    } else {
      reject(new Error('db is undefined'));
    }
  });
};

export const selectFromUpdateItems = (db: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          'SELECT GovLFee, CompanyLFee, DriverLFee, Levy, Driver_Comm_Rate, Company_Comm_Rate FROM UpdateItems',
          [],
          (_tx: Transaction, results: ResultSet) => {
            var len = results.rows.length;
            if (len > 0) {
              let res = results.rows.item(0);
              resolve(res);
            } else {
              resolve({
                GovLFee: 0,
                CompanyLFee: 0,
                DriverLFee: 0,
                Levy: 0,
                Driver_Comm_Rate: 0,
                Company_Comm_Rate: 0,
              });
            }
          },
          (error: any) => {
            reject(error);
          },
        );
      });
    } else {
      reject(new Error('db is undefined'));
    }
  });
};

export const selectCountFromDataTable = (db: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          'SELECT * from datatable',
          [],
          (_tx: Transaction, results: ResultSet) => {
            const len = results.rows.length;
            resolve(len);
          },
          (_t, error) => {
            console.log(error);
            reject(error);
            return true; // rollback transaction in case of error
          },
        );
      });
    } else {
      console.log('db is undefined');
      reject('db is undefined');
    }
  });
};
