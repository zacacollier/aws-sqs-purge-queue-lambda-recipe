import * as AWSLambda from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { getConfig } from './config';
import { handler } from '.';

jest.mock('./config');
jest.mock('aws-sdk', () => {
  return {
    ...jest.requireActual('aws-sdk'),
    SQS: jest.fn(),
  };
});

const mocks = {
  SQSClient: AWS.SQS as unknown as jest.Mock,
  getConfig: getConfig as jest.Mock,
};

const event = {} as AWSLambda.APIGatewayEvent;
const context = {} as AWSLambda.Context;
const callback = new Function() as AWSLambda.Callback;
const queueUrl = 'QUEUE_URL';
const awsRegion = 'AWS_REGION';

describe('handler', () => {
  const awsSdkPromiseMock = jest.fn();
  const sqsPurgeQueueMock = jest
    .fn()
    .mockReturnValue({ promise: awsSdkPromiseMock });

  beforeAll(() => {
    mocks.getConfig.mockReturnValue({
      queueUrl,
      awsRegion,
    });
    mocks.SQSClient.mockImplementation(() => {
      return {
        purgeQueue: sqsPurgeQueueMock,
      };
    });
  });

  test('happy path', async () => {
    await expect(handler(event, context, callback)).resolves.toMatchObject({
      success: true,
    });
    expect(getConfig).toHaveBeenCalled();
    expect(sqsPurgeQueueMock.mock.calls).toMatchSnapshot();
  });

  test('error handled', async () => {
    awsSdkPromiseMock.mockRejectedValueOnce(
      new Error('Service unavailable') as never,
    );
    await expect(handler(event, context, callback)).resolves.toMatchObject({
      success: false,
    });
    expect(getConfig).toHaveBeenCalled();
    expect(sqsPurgeQueueMock.mock.calls).toMatchSnapshot();
  });
});
