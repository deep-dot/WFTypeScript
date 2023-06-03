export type Action =
  | {type: 'REFRESH'; payload: any}
  | {type: 'UPDATE'; payload: any}
  | {type: 'ERROR'; error: Error};
