resource "random_password" "rsvp_slack_notify_token" {
  length  = 48
  special = false
}

resource "cloudflare_turnstile_widget" "rsvp" {
  account_id = var.cloudflare_account_id
  name       = var.turnstile_widget_name
  mode       = "managed"
  domains    = var.turnstile_domains
}

resource "cloudflare_d1_database" "site" {
  account_id = var.cloudflare_account_id
  name       = var.d1_database_name

  read_replication = {
    mode = "disabled"
  }

  lifecycle {
    ignore_changes = [
      created_at,
      num_tables,
      version
    ]
  }
}

resource "cloudflare_pages_project" "site" {
  account_id        = var.cloudflare_account_id
  name              = var.project_name
  production_branch = var.production_branch

  deployment_configs = {
    preview = {
      compatibility_date = var.compatibility_date
      d1_databases = {
        DB = {
          id = cloudflare_d1_database.site.uuid
        }
      }
      env_vars = {
        PUBLIC_TURNSTILE_SITE_KEY = {
          type  = "plain_text"
          value = cloudflare_turnstile_widget.rsvp.sitekey
        }
        RSVP_INVITE_CODE = {
          type  = "secret_text"
          value = var.rsvp_invite_code
        }
        RSVP_SLACK_NOTIFY_TOKEN = {
          type  = "secret_text"
          value = random_password.rsvp_slack_notify_token.result
        }
        SLACK_WEBHOOK_URL = {
          type  = "secret_text"
          value = var.slack_webhook_url
        }
        TURNSTILE_SECRET_KEY = {
          type  = "secret_text"
          value = cloudflare_turnstile_widget.rsvp.secret
        }
      }
    }
    production = {
      compatibility_date = var.compatibility_date
      d1_databases = {
        DB = {
          id = cloudflare_d1_database.site.uuid
        }
      }
      env_vars = {
        PUBLIC_TURNSTILE_SITE_KEY = {
          type  = "plain_text"
          value = cloudflare_turnstile_widget.rsvp.sitekey
        }
        RSVP_INVITE_CODE = {
          type  = "secret_text"
          value = var.rsvp_invite_code
        }
        RSVP_SLACK_NOTIFY_TOKEN = {
          type  = "secret_text"
          value = random_password.rsvp_slack_notify_token.result
        }
        SLACK_WEBHOOK_URL = {
          type  = "secret_text"
          value = var.slack_webhook_url
        }
        TURNSTILE_SECRET_KEY = {
          type  = "secret_text"
          value = cloudflare_turnstile_widget.rsvp.secret
        }
      }
    }
  }
}

resource "cloudflare_dns_record" "primary" {
  zone_id = var.cloudflare_zone_id
  name    = var.primary_domain
  type    = "CNAME"
  ttl     = 1
  content = cloudflare_pages_project.site.subdomain
  proxied = true

  comment = var.primary_dns_comment
}

resource "cloudflare_pages_domain" "primary" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.site.name
  name         = var.primary_domain

  depends_on = [cloudflare_dns_record.primary]
}

resource "cloudflare_dns_record" "additional" {
  for_each = { for domain in var.additional_domains : domain.name => domain }

  zone_id = var.cloudflare_zone_id
  name    = each.value.name
  type    = "CNAME"
  ttl     = 1
  content = cloudflare_pages_project.site.subdomain
  proxied = true

  comment = each.value.comment
}

resource "cloudflare_pages_domain" "additional" {
  for_each = { for domain in var.additional_domains : domain.name => domain }

  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.site.name
  name         = each.value.name

  depends_on = [cloudflare_dns_record.additional]
}
