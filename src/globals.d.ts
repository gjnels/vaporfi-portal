type Message =
  | { type: 'success'; message: string | string[] }
  | { type: 'error'; message: string | string[] }
