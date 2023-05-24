function executeSqlQuery(queryType: 'insert' | 'update', /* other parameters */, callback: Function) {
    let sqlQuery = '';
    let params = [
      // parameters for SQL query
      date,
      day,
      shift,
      // and so on, order them according to your SQL query
      deductions,
      netpayin,
      // and so on
    ];
  
    if (queryType === 'insert') {
      sqlQuery = 'INSERT INTO datatable (/* column names */) VALUES(/* placeholders for values */)';
    } else if (queryType === 'update') {
      sqlQuery = 'UPDATE datatable set Date = ?, Day = ?, Shift = ?, /* and so on */ where Date = ?';
      params.push(search_date); // assuming the 'search_date' is the date you want to update
    }
  
    if (db) {
      db.transaction((txn: Transaction) => {
        txn.executeSql(
          sqlQuery,
          params,
          (_tx: Transaction, results: ResultSet) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              callback();
            }
          },
        );
      });
    } else {
      console.log('db is undefined');
    }
  }
  