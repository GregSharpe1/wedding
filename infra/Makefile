SHELL := /bin/zsh

STAGING_PROJECT_NAME ?= thesharpes-wedding-staging
PRODUCTION_PROJECT_NAME ?= thesharpes-wedding
PRODUCTION_BRANCH ?= main
ROOT_DIR := ..
DIST_DIR := $(ROOT_DIR)/dist

export TF_VAR_cloudflare_account_id = $(CLOUDFLARE_ACCOUNT_ID)
export TF_VAR_cloudflare_zone_id = $(CLOUDFLARE_ZONE_ID)

.PHONY: init fmt validate plan apply import-project import-staging deploy deploy-staging deploy-production clean

init:
	@[[ -n "$(CLOUDFLARE_API_TOKEN)" ]] || { print -u2 "CLOUDFLARE_API_TOKEN is required"; exit 1; }
	@[[ -n "$(CLOUDFLARE_ACCOUNT_ID)" ]] || { print -u2 "CLOUDFLARE_ACCOUNT_ID is required"; exit 1; }
	@[[ -n "$(CLOUDFLARE_ZONE_ID)" ]] || { print -u2 "CLOUDFLARE_ZONE_ID is required"; exit 1; }
	terraform init

fmt:
	terraform fmt -recursive

validate: init
	terraform validate

plan: init
	terraform plan

apply: init
	terraform apply

import-project: init
	terraform import cloudflare_pages_project.staging "$(CLOUDFLARE_ACCOUNT_ID)/$(STAGING_PROJECT_NAME)"

import-staging: import-project

deploy:
	@$(MAKE) deploy-staging

deploy-staging:
	@[[ -n "$(CLOUDFLARE_API_TOKEN)" ]] || { print -u2 "CLOUDFLARE_API_TOKEN is required"; exit 1; }
	@[[ -n "$(CLOUDFLARE_ACCOUNT_ID)" ]] || { print -u2 "CLOUDFLARE_ACCOUNT_ID is required"; exit 1; }
	npm --prefix "$(ROOT_DIR)" run build
	npx wrangler pages deploy "$(DIST_DIR)" --project-name="$(STAGING_PROJECT_NAME)"

deploy-production:
	@[[ -n "$(CLOUDFLARE_API_TOKEN)" ]] || { print -u2 "CLOUDFLARE_API_TOKEN is required"; exit 1; }
	@[[ -n "$(CLOUDFLARE_ACCOUNT_ID)" ]] || { print -u2 "CLOUDFLARE_ACCOUNT_ID is required"; exit 1; }
	npm --prefix "$(ROOT_DIR)" run build
	npx wrangler pages deploy "$(DIST_DIR)" --project-name="$(PRODUCTION_PROJECT_NAME)"

clean:
	rm -rf .terraform .wrangler .terraform.lock.hcl
