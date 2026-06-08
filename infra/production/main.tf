module "site" {
  source = "../modules/pages_rsvp_site"

  cloudflare_account_id = var.cloudflare_account_id
  cloudflare_zone_id    = var.cloudflare_zone_id
  project_name          = var.project_name
  production_branch     = var.production_branch
  primary_domain        = var.domain
  primary_dns_comment   = "Managed by Terraform for the production Pages site."
  additional_domains = [
    {
      name    = var.www_domain
      comment = "Managed by Terraform for the production www Pages hostname."
    },
  ]
  d1_database_name      = var.d1_database_name
  rsvp_invite_code      = var.rsvp_invite_code
  slack_webhook_url     = var.slack_webhook_url
  turnstile_widget_name = var.turnstile_widget_name
  turnstile_domains     = [var.domain, var.www_domain]
  compatibility_date    = var.compatibility_date
}

import {
  to = module.site.cloudflare_pages_project.site
  id = "81f602c2c7158220365dc26397c148c1/thesharpes-wedding"
}

import {
  to = module.site.cloudflare_dns_record.primary
  id = "fe50ab3e31dff3277e2fa1c370b8e685/763791a05ad9982dc61449067308da4b"
}

import {
  to = module.site.cloudflare_pages_domain.primary
  id = "81f602c2c7158220365dc26397c148c1/thesharpes-wedding/thesharpes.wedding"
}

import {
  to = module.site.cloudflare_dns_record.additional["www.thesharpes.wedding"]
  id = "fe50ab3e31dff3277e2fa1c370b8e685/47327b580b8228bc3a24b0acfe11ec22"
}

import {
  to = module.site.cloudflare_pages_domain.additional["www.thesharpes.wedding"]
  id = "81f602c2c7158220365dc26397c148c1/thesharpes-wedding/www.thesharpes.wedding"
}
