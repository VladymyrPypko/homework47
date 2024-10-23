import { EventEmitter } from 'events';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const envFilePath =
  process.env.NODE_ENV === 'production'
    ? path.join(__dirname, '../.env.production')
    : path.join(__dirname, '../.env.development');

dotenv.config({ path: envFilePath });

class FileUploadLogger extends EventEmitter {
  private logFilePath: string;

  constructor() {
    super();
    this.logFilePath =
      process.env.LOG_FILE ||
      path.join(process.cwd(), 'logs', 'default_fileUpload.log');


    this.on('fileUploadStart', (message: string) => this.logEvent(message));
    this.on('fileUploadEnd', (message: string) => this.logEvent(message));
    this.on('fileUploadFailed', (message: string) => this.logEvent(message));
  }

  private logEvent(message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - ${message}\n`;

    fs.appendFile(this.logFilePath, logMessage, (err) => {
      if (err) {
        console.error('Failed to log event:', err);
      }
    });
  }
}

export const fileUploadLogger = new FileUploadLogger();
