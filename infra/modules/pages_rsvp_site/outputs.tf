output "project_name" {
  value = cloudflare_pages_project.site.name
}

output "project_subdomain" {
  value = cloudflare_pages_project.site.subdomain
}

output "primary_domain" {
  value = cloudflare_pages_domain.primary.name
}

output "primary_domain_status" {
  value = cloudflare_pages_domain.primary.status
}

output "additional_domain_statuses" {
  value = {
    for name, domain in cloudflare_pages_domain.additional : name => domain.status
  }
}

output "d1_database_name" {
  value = cloudflare_d1_database.site.name
}

output "d1_database_id" {
  value = cloudflare_d1_database.site.uuid
}

output "turnstile_site_key" {
  value = cloudflare_turnstile_widget.rsvp.sitekey
}

output "turnstile_widget_id" {
  value = cloudflare_turnstile_widget.rsvp.id
}
