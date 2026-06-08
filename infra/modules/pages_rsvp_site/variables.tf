variable "cloudflare_account_id" {
  type = string
}

variable "cloudflare_zone_id" {
  type = string
}

variable "project_name" {
  type = string
}

variable "production_branch" {
  type = string
}

variable "primary_domain" {
  type = string
}

variable "primary_dns_comment" {
  type = string
}

variable "additional_domains" {
  type = list(object({
    name    = string
    comment = string
  }))
  default = []
}

variable "d1_database_name" {
  type = string
}

variable "rsvp_invite_code" {
  type      = string
  sensitive = true
}

variable "slack_webhook_url" {
  type      = string
  sensitive = true
  default   = ""
}

variable "turnstile_widget_name" {
  type = string
}

variable "turnstile_domains" {
  type = list(string)
}

variable "compatibility_date" {
  type = string
}
