import * as AWSLambda from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { Logger } from './lib/Logger';
import { getConfig } from './config';

const getSQSClient = () => {
  const config = getConfig();
  return new AWS.SQS({
    region: config.region,
  });
};

export const handler: AWSLambda.Handler = async (event, context) => {
  const logger = new Logger(event, context);
  const config = getConfig();

  logger.setLoggingContext({
    queueUrl: config.queueUrl,
  });

  try {
    const sqs = getSQSClient();

    const response = await sqs
      .purgeQueue({
        QueueUrl: config.queueUrl,
      })
      .promise();

    logger.info('Purged queue', { response });

    return {
      success: true,
    };
  } catch (error) {
    logger.error('Error purging queue', error as Error);

    return {
      success: false,
    };
  }
};
