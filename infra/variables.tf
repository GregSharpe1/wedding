variable "cloudflare_account_id" {
  description = "Cloudflare account ID that owns the Pages project."
  type        = string
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID for thesharpes.wedding."
  type        = string
}

variable "staging_project_name" {
  description = "Cloudflare Pages project name for staging."
  type        = string
  default     = "thesharpes-wedding-staging"
}

variable "production_project_name" {
  description = "Cloudflare Pages project name for production."
  type        = string
  default     = "thesharpes-wedding"
}

variable "production_branch" {
  description = "Production branch configured on the direct-upload Pages project."
  type        = string
  default     = "main"
}

variable "staging_domain" {
  description = "Custom staging hostname served by the Pages project."
  type        = string
  default     = "staging.thesharpes.wedding"
}

variable "production_domain" {
  description = "Production apex hostname served by the production Pages project."
  type        = string
  default     = "thesharpes.wedding"
}

variable "production_www_domain" {
  description = "Production www hostname that redirects to the apex domain."
  type        = string
  default     = "www.thesharpes.wedding"
}

variable "enable_production" {
  description = "Whether to create the production Pages project and domains."
  type        = bool
  default     = true
}
