import * as AWSLambda from 'aws-lambda';

interface LoggingContext {
  reqId?: string;
}

type LogLevel = 'warn' | 'error' | 'debug' | 'info';

export class Logger {
  private loggingContext: LoggingContext;

  constructor(event: AWSLambda.APIGatewayEvent, context: AWSLambda.Context) {
    this.loggingContext = {
      reqId: context.awsRequestId,
    };
  }

  private log(
    level: LogLevel,
    msg: string,
    metadata?: Record<string, unknown>,
  ) {
    const log = JSON.stringify(
      {
        level,
        text: msg,
        context: this.loggingContext,
        metadata,
      },
      null,
      2,
    );
    console.log(log);
  }

  public debug(msg: string, metadata?: Record<string, unknown>) {
    this.log('debug', msg, metadata);
  }

  public info(msg: string, metadata?: Record<string, unknown>) {
    this.log('info', msg, metadata);
  }

  public error(msg: string, error: Error) {
    const errorMetadata = {
      message: error.message,
      name: error.name,
      stack: error.stack,
    };
    this.log('error', msg, errorMetadata);
  }

  public getLoggingContext() {
    return this.loggingContext;
  }

  setLoggingContext<O = Record<string, unknown>>(obj: O) {
    this.loggingContext = {
      ...this.loggingContext,
      ...obj,
    };
  }
}
