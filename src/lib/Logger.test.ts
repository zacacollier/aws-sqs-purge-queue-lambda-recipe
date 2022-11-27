import * as AWSLambda from 'aws-lambda';
import { Logger } from './Logger';

describe('Logger', () => {
  const event = {} as AWSLambda.APIGatewayEvent;
  const context = {
    awsRequestId: 'awsRequestId',
  } as AWSLambda.Context;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('sets loggingContext', () => {
    const logger = new Logger(event, context);
    expect(logger.getLoggingContext()).toMatchObject({
      reqId: context.awsRequestId,
    });
  });

  test('log debug', () => {
    const logSpy = jest.spyOn(Logger.prototype, 'log' as never);
    const logger = new Logger(event, context);
    const msg = 'message';
    const metadata = { meta: 'data' };
    logger.debug(msg, metadata);
    expect(logSpy).toHaveBeenCalledWith('debug', msg, metadata);
  });

  test('log info', () => {
    const logSpy = jest.spyOn(Logger.prototype, 'log' as never);
    const logger = new Logger(event, context);
    const msg = 'message';
    const metadata = { meta: 'data' };
    logger.info(msg, metadata);
    expect(logSpy).toHaveBeenCalledWith('info', msg, metadata);
  });

  test('log error', () => {
    const logSpy = jest.spyOn(Logger.prototype, 'log' as never);
    const logger = new Logger(event, context);
    const msg = 'message';
    const error = new Error('whoops');
    const errorMetadata = {
      message: 'whoops',
      name: 'Error',
      stack: expect.any(String),
    };
    logger.error(msg, error);
    expect(logSpy).toHaveBeenCalledWith('error', msg, errorMetadata);
  });
});
