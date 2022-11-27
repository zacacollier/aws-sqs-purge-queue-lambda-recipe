module "example" {
  source                       = "../terraform/modules/aws_sqs_purge_queue_lambda_function"
  queue_name                   = "bcampbell-deadletter"
  region                       = "us-east-1"
}
