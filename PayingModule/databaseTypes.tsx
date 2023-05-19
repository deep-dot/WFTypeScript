export type Transaction = {
  executeSql: (
    sql: string,
    args?: any[],
    success?: (transaction: Transaction, resultSet: ResultSet) => void,
    error?: (transaction: Transaction, error: any) => void,
  ) => void;
};

export type ResultSet = {
  rowsAffected: number;
  insertId?: number;
  rows: {
    length: number;
    item: (index: number) => any;
    _array: any[];
  };
};
