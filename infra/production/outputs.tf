output "project_name" {
  description = "Cloudflare Pages production project name."
  value       = module.site.project_name
}

output "project_subdomain" {
  description = "Default Cloudflare Pages hostname for the production project."
  value       = module.site.project_subdomain
}

output "domain_status" {
  description = "Cloudflare status for the production apex custom domain."
  value       = module.site.primary_domain_status
}

output "www_domain_status" {
  description = "Cloudflare status for the production www custom domain."
  value       = module.site.additional_domain_statuses[var.www_domain]
}

output "d1_database_name" {
  description = "Cloudflare D1 database name for production RSVP data."
  value       = module.site.d1_database_name
}

output "d1_database_id" {
  description = "Cloudflare D1 database UUID for production RSVP data."
  value       = module.site.d1_database_id
}

output "turnstile_site_key" {
  description = "Cloudflare Turnstile site key for the production RSVP widget."
  value       = module.site.turnstile_site_key
}

output "turnstile_widget_id" {
  description = "Cloudflare Turnstile widget identifier for production."
  value       = module.site.turnstile_widget_id
}
