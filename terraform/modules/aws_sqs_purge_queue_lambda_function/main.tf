locals {
  lambda_function_node_modules_archive_output_filename = "node_modules.zip"
  lambda_function_template_output_filename             = "index.js.zip"
  lambda_function_name                                 = "${var.queue_name}-purgeQueue"
}

data "aws_sqs_queue" "queue" {
  name = var.queue_name
}

resource "aws_iam_role" "purge_queue_lambda_iam_role" {
  name               = "${var.queue_name}-purgeDlq-execution-role"
  assume_role_policy = jsonencode({
    Statement = [
      {
        Action    = ["sts:AssumeRole"]
        Principal = {
          Service = "lambda.amazonaws.com"
        }
        Effect = "Allow"
        "Sid"  = ""
      }
    ]
  })
}

resource "aws_iam_policy" "purge_queue_lambda_iam_policy" {
  name        = "${local.lambda_function_name}-iam-policy"
  description = "PurgeQueue permissions for ${local.lambda_function_name} Lambda Function"

  policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [
      {
        Action   = ["sqs:PurgeQueue"]
        Effect   = "Allow"
        Resource = data.aws_sqs_queue.queue.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "purge_queue_lambda_iam_role_policy_attachment" {
  role       = aws_iam_role.purge_queue_lambda_iam_role.name
  policy_arn = aws_iam_policy.purge_queue_lambda_iam_policy.arn
}

data "archive_file" "lambda_function_templates_compiled_archive" {
  type             = "zip"
  source_dir       = "${path.module}/../../../dist"
  output_file_mode = "0666"
  output_path      = local.lambda_function_template_output_filename
}

resource "aws_lambda_function" "purge_queue_lambda_function" {
  depends_on = [data.archive_file.lambda_function_templates_compiled_archive]

  function_name = "${var.queue_name}-purgeQueue"
  role          = aws_iam_role.purge_queue_lambda_iam_role.arn

  filename         = local.lambda_function_template_output_filename
  handler          = "index.handler"
  source_code_hash = data.archive_file.lambda_function_templates_compiled_archive.output_base64sha256

  timeout = 60 * 14 // 15 minutes
  environment {
    variables = {
      QUEUE_URL = data.aws_sqs_queue.queue.url
    }
  }

  runtime = "nodejs16.x"
  tags    = var.tags
}

