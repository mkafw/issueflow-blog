type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  ts: string;
  level: LogLevel;
  message: string;
  [key: string]: unknown;
}

function format(entry: LogEntry): string {
  return JSON.stringify(entry);
}

function log(level: LogLevel, message: string, ctx?: Record<string, unknown>) {
  const entry: LogEntry = { ts: new Date().toISOString(), level, message, ...ctx };

  if (process.env.NODE_ENV === 'production') {
    // Avoid logging sensitive info in production; hook up external service here
    const { stack, cause, ...safe } = entry;
    console[level](format(safe));
  } else {
    console[level](format(entry));
  }
}

export const logger = {
  debug: (msg: string, ctx?: Record<string, unknown>) => log('debug', msg, ctx),
  info: (msg: string, ctx?: Record<string, unknown>) => log('info', msg, ctx),
  warn: (msg: string, ctx?: Record<string, unknown>) => log('warn', msg, ctx),
  error: (msg: string, ctx?: Record<string, unknown>) => log('error', msg, ctx),
};
