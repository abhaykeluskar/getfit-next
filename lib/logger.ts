export class Logger {
  static info(message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[INFO] ${message}`, data);
    }
  }

  static error(message: string, error?: any) {
    console.error(`[ERROR] ${message}`, error);
  }

  static sync(message: string, data?: any) {
    console.log(`[SYNC] ${message}`, data);
  }
}