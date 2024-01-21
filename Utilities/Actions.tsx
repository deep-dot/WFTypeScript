export type Action =
  | {type: 'INSERT'; payload: any}
  | {type: 'SELECT'; payload: any}
  | {type: 'UPDATE'; payload: any}
  | {type: 'DELETE'; payload: any}
  | {type: 'REFRESH'; payload: any}
  | {type: 'ERROR'; error: Error};
