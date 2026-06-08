variable "cloudflare_account_id" {
  description = "Cloudflare account ID that owns the Pages project."
  type        = string
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID for thesharpes.wedding."
  type        = string
}

variable "project_name" {
  description = "Cloudflare Pages project name for staging."
  type        = string
  default     = "thesharpes-wedding-staging"
}

variable "production_branch" {
  description = "Production branch configured on the direct-upload Pages project."
  type        = string
  default     = "main"
}

variable "domain" {
  description = "Custom staging hostname served by the Pages project."
  type        = string
  default     = "staging.thesharpes.wedding"
}

variable "d1_database_name" {
  description = "D1 database name used by the staging Pages project for RSVP data."
  type        = string
  default     = "thesharpes-wedding-staging-rsvps"
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
  description = "Cloudflare Turnstile widget name used for the staging RSVP flow."
  type        = string
  default     = "thesharpes-wedding-staging-rsvp"
}

variable "compatibility_date" {
  description = "Compatibility date for Pages Functions bindings."
  type        = string
  default     = "2026-06-07"
}
