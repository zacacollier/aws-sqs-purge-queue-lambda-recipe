import * as cfg from './config';

// env variables set by jest.setup.js
const mockQueueUrl = 'QUEUE_URL';
const mockAwsRegion = 'AWS_REGION';

describe('config', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('returns environment configuration', () => {
    const config = cfg.getConfig();
    expect(config).toMatchObject({
      queueUrl: mockQueueUrl,
      region: mockAwsRegion,
    });
  });
});
