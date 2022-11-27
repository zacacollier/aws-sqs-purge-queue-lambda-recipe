variable "queue_name" {
  type = string
}

variable "region" {
  type = string
}

variable "tags" {
  type    = map(string)
  default = null
}

// encryption
variable "kms_master_key_id" {
  type    = string
  default = null
}

variable "kms_data_key_reuse_period_seconds" {
  type = number
  default = 0
}

variable "dlq_redrive_allow_policy" {
  description = "Custom DLQ redrive IAM Allow policy. Optional"
  type        = string
  default     = null
}
