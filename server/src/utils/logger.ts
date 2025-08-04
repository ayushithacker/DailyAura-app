import { Request } from 'express';

// Log levels
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

// Log entry interface
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: any;
  requestId?: string;
  userId?: string;
  ip?: string;
  userAgent?: string;
  method?: string;
  url?: string;
  duration?: number;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

// Generate request ID
const generateRequestId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Format log entry
const formatLogEntry = (entry: LogEntry): string => {
  const baseLog: any = {
    timestamp: entry.timestamp,
    level: entry.level.toUpperCase(),
    message: entry.message,
    ...(entry.context && { context: entry.context }),
    ...(entry.requestId && { requestId: entry.requestId }),
    ...(entry.userId && { userId: entry.userId }),
    ...(entry.ip && { ip: entry.ip }),
    ...(entry.method && { method: entry.method }),
    ...(entry.url && { url: entry.url }),
    ...(entry.duration && { duration: `${entry.duration}ms` })
  };

  if (entry.error) {
    baseLog.error = {
      name: entry.error.name,
      message: entry.error.message,
      ...(entry.error.stack && { stack: entry.error.stack })
    };
  }

  if (entry.data) {
    baseLog.data = entry.data;
  }

  return JSON.stringify(baseLog, null, 2);
};

// Logger class
class Logger {
  private requestId: string;

  constructor() {
    this.requestId = generateRequestId();
  }

  private log(level: LogLevel, message: string, data?: any, context?: string): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      data,
      requestId: this.requestId
    };

    const formattedLog = formatLogEntry(entry);
    
    // Color coding for different log levels
    const colors = {
      [LogLevel.ERROR]: '\x1b[31m', // Red
      [LogLevel.WARN]: '\x1b[33m',  // Yellow
      [LogLevel.INFO]: '\x1b[36m',  // Cyan
      [LogLevel.DEBUG]: '\x1b[35m'  // Magenta
    };

    const resetColor = '\x1b[0m';
    const color = colors[level] || '';
    
    console.log(`${color}${formattedLog}${resetColor}`);
  }

  error(message: string, error?: Error, context?: string): void {
    this.log(LogLevel.ERROR, message, undefined, context);
    if (error) {
      this.log(LogLevel.ERROR, 'Error details', {
        name: error.name,
        message: error.message,
        stack: error.stack
      }, context);
    }
  }

  warn(message: string, data?: any, context?: string): void {
    this.log(LogLevel.WARN, message, data, context);
  }

  info(message: string, data?: any, context?: string): void {
    this.log(LogLevel.INFO, message, data, context);
  }

  debug(message: string, data?: any, context?: string): void {
    if (process.env.NODE_ENV === 'development') {
      this.log(LogLevel.DEBUG, message, data, context);
    }
  }

  // Request-specific logging
  logRequest(req: Request, context?: string): void {
    this.log(LogLevel.INFO, 'Incoming request', {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body,
      query: req.query,
      params: req.params
    }, context);
  }

  logResponse(req: Request, res: any, duration: number, context?: string): void {
    this.log(LogLevel.INFO, 'Response sent', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`
    }, context);
  }

  // Authentication logging
  logAuthAttempt(email: string, success: boolean, context?: string): void {
    this.log(success ? LogLevel.INFO : LogLevel.WARN, 
      success ? 'Authentication successful' : 'Authentication failed', 
      { email, success }, 
      context
    );
  }

  logRegistration(username: string, email: string, success: boolean, context?: string): void {
    this.log(success ? LogLevel.INFO : LogLevel.WARN, 
      success ? 'User registration successful' : 'User registration failed', 
      { username, email, success }, 
      context
    );
  }

  // Database logging
  logDatabaseOperation(operation: string, collection: string, success: boolean, duration?: number, context?: string): void {
    this.log(success ? LogLevel.INFO : LogLevel.ERROR, 
      `Database ${operation}`, 
      { collection, success, ...(duration && { duration: `${duration}ms` }) }, 
      context
    );
  }

  // Performance logging
  logPerformance(operation: string, duration: number, context?: string): void {
    const level = duration > 1000 ? LogLevel.WARN : LogLevel.INFO;
    this.log(level, `Performance: ${operation}`, { duration: `${duration}ms` }, context);
  }
}

// Create and export logger instance
export const logger = new Logger();

// Middleware to add request logging
export const requestLogger = (req: Request, res: any, next: any): void => {
  const startTime = Date.now();
  const requestLogger = new Logger();

  // Log incoming request
  requestLogger.logRequest(req, 'HTTP_REQUEST');

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any): void {
    const duration = Date.now() - startTime;
    requestLogger.logResponse(req, res, duration, 'HTTP_RESPONSE');
    originalEnd.call(this, chunk, encoding);
  };

  next();
}; 