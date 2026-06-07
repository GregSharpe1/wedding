resource "cloudflare_pages_project" "staging" {
  account_id        = var.cloudflare_account_id
  name              = var.staging_project_name
  production_branch = var.production_branch
}

resource "cloudflare_dns_record" "staging" {
  zone_id = var.cloudflare_zone_id
  name    = var.staging_domain
  type    = "CNAME"
  ttl     = 1
  content = cloudflare_pages_project.staging.subdomain
  proxied = true

  comment = "Managed by Terraform for the staging Pages site."
}

resource "cloudflare_pages_domain" "staging" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.staging.name
  name         = var.staging_domain

  depends_on = [cloudflare_dns_record.staging]
}

resource "cloudflare_pages_project" "production" {
  count = var.enable_production ? 1 : 0

  account_id        = var.cloudflare_account_id
  name              = var.production_project_name
  production_branch = var.production_branch
}

resource "cloudflare_dns_record" "production" {
  count = var.enable_production ? 1 : 0

  zone_id = var.cloudflare_zone_id
  name    = var.production_domain
  type    = "CNAME"
  ttl     = 1
  content = cloudflare_pages_project.production[0].subdomain
  proxied = true

  comment = "Managed by Terraform for the production Pages site."
}

resource "cloudflare_pages_domain" "production" {
  count = var.enable_production ? 1 : 0

  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.production[0].name
  name         = var.production_domain

  depends_on = [cloudflare_dns_record.production]
}

resource "cloudflare_dns_record" "production_www" {
  count = var.enable_production ? 1 : 0

  zone_id = var.cloudflare_zone_id
  name    = var.production_www_domain
  type    = "CNAME"
  ttl     = 1
  content = cloudflare_pages_project.production[0].subdomain
  proxied = true

  comment = "Managed by Terraform for the production www Pages hostname."
}

resource "cloudflare_pages_domain" "production_www" {
  count = var.enable_production ? 1 : 0

  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.production[0].name
  name         = var.production_www_domain

  depends_on = [cloudflare_dns_record.production_www]
}
