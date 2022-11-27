class Config {
  queueUrl: string;
  region: string;
  constructor() {
    this.queueUrl = process.env.QUEUE_URL as string;
    this.region = process.env.AWS_REGION as string;
  }
}

let config: Config;

export const getConfig = (): Config => {
  if (!config) {
    config = new Config();
  }
  return config;
};
