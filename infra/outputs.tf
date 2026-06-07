output "staging_project_name" {
  description = "Cloudflare Pages staging project name."
  value       = cloudflare_pages_project.staging.name
}

output "staging_project_subdomain" {
  description = "Default Cloudflare Pages hostname for the staging project."
  value       = cloudflare_pages_project.staging.subdomain
}

output "staging_domain" {
  description = "Custom domain served by the staging Pages project."
  value       = cloudflare_pages_domain.staging.name
}

output "staging_domain_status" {
  description = "Cloudflare status for the staging custom domain."
  value       = cloudflare_pages_domain.staging.status
}

output "production_project_name" {
  description = "Cloudflare Pages production project name."
  value       = one(cloudflare_pages_project.production[*].name)
}

output "production_project_subdomain" {
  description = "Default Cloudflare Pages hostname for the production project."
  value       = one(cloudflare_pages_project.production[*].subdomain)
}

output "production_domain_status" {
  description = "Cloudflare status for the production apex custom domain."
  value       = one(cloudflare_pages_domain.production[*].status)
}

output "production_www_domain_status" {
  description = "Cloudflare status for the production www custom domain."
  value       = one(cloudflare_pages_domain.production_www[*].status)
}
