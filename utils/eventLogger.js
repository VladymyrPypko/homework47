import { EventEmitter } from 'events';
import fs from 'fs';
import path from 'path';

class FileUploadLogger extends EventEmitter {
  constructor() {
    super();
    this.logFilePath = path.join(process.cwd(), 'logs', 'filesUpload.log');

    this.on('fileUploadStart', (message) => this.logEvent(message));
    this.on('fileUploadEnd', (message) => this.logEvent(message));
    this.on('fileUploadFailed', (message) => this.logEvent(message));
  }

  logEvent(message) {
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
