variable "cloudflare_account_id" {
  description = "Cloudflare account ID that owns the Pages project."
  type        = string
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID for thesharpes.wedding."
  type        = string
}

variable "project_name" {
  description = "Cloudflare Pages project name for production."
  type        = string
  default     = "thesharpes-wedding"
}

variable "production_branch" {
  description = "Production branch configured on the direct-upload Pages project."
  type        = string
  default     = "main"
}

variable "domain" {
  description = "Production apex hostname served by the Pages project."
  type        = string
  default     = "thesharpes.wedding"
}

variable "www_domain" {
  description = "Production www hostname served by the Pages project."
  type        = string
  default     = "www.thesharpes.wedding"
}

variable "d1_database_name" {
  description = "D1 database name used by the production Pages project for RSVP data."
  type        = string
  default     = "thesharpes-wedding-rsvps"
}

variable "backup_bucket_name" {
  description = "R2 bucket name used for production RSVP database backups."
  type        = string
  default     = "thesharpes-wedding-production-backups"
}

variable "backup_bucket_location" {
  description = "R2 location hint used for production RSVP database backups."
  type        = string
  default     = "WEUR"
}

variable "rsvp_invite_code" {
  description = "Shared RSVP invite code used to open the gated RSVP flow."
  type        = string
  sensitive   = true
}

variable "slack_webhook_url" {
  description = "Slack incoming webhook URL used for RSVP notifications."
  type        = string
  sensitive   = true
  default     = ""
}

variable "turnstile_widget_name" {
  description = "Cloudflare Turnstile widget name used for the production RSVP flow."
  type        = string
  default     = "thesharpes-wedding-rsvp"
}

variable "compatibility_date" {
  description = "Compatibility date for Pages Functions bindings."
  type        = string
  default     = "2026-06-07"
}
