# SQS PurgeQueue Lambda Function Recipe

A Terraform recipe to provision a Node.js Lambda function for purging a given SQS
queue.

## Usage
This module is packaged in NPM. Install it from there.
```shell
npm install -D aws-sqs-purge-queue-lambda-recipe
```

Copy `examples/example.tf` and reference the installed Node module path in `source`:
```terraform
module "example" {
  source     = "../../node_modules/aws_sqs_purge_queue_lambda_function/terraform/modules/aws_sqs_purge_queue_lambda_function"
  queue_name = "my-queue"
  tags       = {
    org = "engineering"
  }
}
```

Run `terraform init` and `terraform apply`.

## Motivation

Some companies only allow PurgeQueue to be executed by privileged administrative IAM roles – with good reason!

At the same time, the maintainer of one or more applications which makes heavy use of SQS (me) may want the ability to
purge a queue without having to always bother an SRE with it.

Using a Terraform module to create a Lambda function which is scoped to a specific queue, within a specific application, is an acceptable compromise.
