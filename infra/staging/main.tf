module "site" {
  source = "../modules/pages_rsvp_site"

  cloudflare_account_id = var.cloudflare_account_id
  cloudflare_zone_id    = var.cloudflare_zone_id
  project_name          = var.project_name
  production_branch     = var.production_branch
  primary_domain        = var.domain
  primary_dns_comment   = "Managed by Terraform for the staging Pages site."
  d1_database_name      = var.d1_database_name
  rsvp_invite_code      = var.rsvp_invite_code
  slack_webhook_url     = var.slack_webhook_url
  turnstile_widget_name = var.turnstile_widget_name
  turnstile_domains     = [var.domain]
  compatibility_date    = var.compatibility_date
}

resource "cloudflare_r2_bucket" "backups" {
  account_id = var.cloudflare_account_id
  name       = var.backup_bucket_name
  location   = var.backup_bucket_location
}

import {
  to = module.site.cloudflare_pages_project.site
  id = "81f602c2c7158220365dc26397c148c1/thesharpes-wedding-staging"
}

import {
  to = module.site.cloudflare_dns_record.primary
  id = "fe50ab3e31dff3277e2fa1c370b8e685/b8f593f3a2f092fde7e1b076a03e435a"
}

import {
  to = module.site.cloudflare_pages_domain.primary
  id = "81f602c2c7158220365dc26397c148c1/thesharpes-wedding-staging/staging.thesharpes.wedding"
}
