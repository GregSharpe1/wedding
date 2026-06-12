SHELL := /bin/zsh

STAGING_PROJECT_NAME ?= thesharpes-wedding-staging
PRODUCTION_PROJECT_NAME ?= thesharpes-wedding
ROOT_DIR := ..
DIST_DIR := $(ROOT_DIR)/dist
STAGING_DIR := staging
PRODUCTION_DIR := production
INVITES_FILE_STAGING ?= $(abspath $(ROOT_DIR)/invites/staging.json)
INVITES_FILE_PROD ?= $(abspath $(ROOT_DIR)/invites/prod.json)
STAGING_WRANGLER_CONFIG := $(ROOT_DIR)/wrangler.staging.toml
PRODUCTION_WRANGLER_CONFIG := $(ROOT_DIR)/wrangler.production.toml
STAGING_SLACK_WEBHOOK_URL ?= $(SLACK_WEBHOOK_URL)
PRODUCTION_SLACK_WEBHOOK_URL ?= $(SLACK_WEBHOOK_URL)

export TF_VAR_cloudflare_account_id = $(CLOUDFLARE_ACCOUNT_ID)
export TF_VAR_cloudflare_zone_id = $(CLOUDFLARE_ZONE_ID)
export TF_VAR_rsvp_invite_code = $(RSVP_INVITE_CODE)

.PHONY: check-env init-staging init-production fmt validate-staging validate-production plan-staging plan-production apply-staging apply-production deploy deploy-staging deploy-production migrate-staging migrate-production update-guests-staging update-guests-production reset-guests-staging reset-guests-production clean

check-env:
	@[[ -n "$(CLOUDFLARE_API_TOKEN)" ]] || { print -u2 "CLOUDFLARE_API_TOKEN is required"; exit 1; }
	@[[ -n "$(CLOUDFLARE_ACCOUNT_ID)" ]] || { print -u2 "CLOUDFLARE_ACCOUNT_ID is required"; exit 1; }
	@[[ -n "$(CLOUDFLARE_ZONE_ID)" ]] || { print -u2 "CLOUDFLARE_ZONE_ID is required"; exit 1; }
	@[[ -n "$(RSVP_INVITE_CODE)" ]] || { print -u2 "RSVP_INVITE_CODE is required"; exit 1; }

init-staging: check-env
	terraform -chdir="$(STAGING_DIR)" init

init-production: check-env
	terraform -chdir="$(PRODUCTION_DIR)" init

init-staging: export TF_VAR_slack_webhook_url = $(STAGING_SLACK_WEBHOOK_URL)

validate-staging: export TF_VAR_slack_webhook_url = $(STAGING_SLACK_WEBHOOK_URL)

plan-staging: export TF_VAR_slack_webhook_url = $(STAGING_SLACK_WEBHOOK_URL)

apply-staging: export TF_VAR_slack_webhook_url = $(STAGING_SLACK_WEBHOOK_URL)

init-production: export TF_VAR_slack_webhook_url = $(PRODUCTION_SLACK_WEBHOOK_URL)

validate-production: export TF_VAR_slack_webhook_url = $(PRODUCTION_SLACK_WEBHOOK_URL)

plan-production: export TF_VAR_slack_webhook_url = $(PRODUCTION_SLACK_WEBHOOK_URL)

apply-production: export TF_VAR_slack_webhook_url = $(PRODUCTION_SLACK_WEBHOOK_URL)

fmt:
	terraform fmt -recursive

validate-staging: init-staging
	terraform -chdir="$(STAGING_DIR)" validate

validate-production: init-production
	terraform -chdir="$(PRODUCTION_DIR)" validate

plan-staging: init-staging
	terraform -chdir="$(STAGING_DIR)" plan

plan-production: init-production
	terraform -chdir="$(PRODUCTION_DIR)" plan

apply-staging: init-staging
	terraform -chdir="$(STAGING_DIR)" apply

apply-production: init-production
	terraform -chdir="$(PRODUCTION_DIR)" apply

deploy:
	@$(MAKE) deploy-staging

deploy-staging:
	@[[ -n "$(CLOUDFLARE_API_TOKEN)" ]] || { print -u2 "CLOUDFLARE_API_TOKEN is required"; exit 1; }
	@[[ -n "$(CLOUDFLARE_ACCOUNT_ID)" ]] || { print -u2 "CLOUDFLARE_ACCOUNT_ID is required"; exit 1; }
	@PUBLIC_TURNSTILE_SITE_KEY="$$(terraform -chdir="$(STAGING_DIR)" output -raw turnstile_site_key)" npm --prefix "$(ROOT_DIR)" run build
	@(cd "$(ROOT_DIR)" && npx wrangler pages deploy "dist" --project-name="$(STAGING_PROJECT_NAME)" --commit-dirty=true)

deploy-production:
	@[[ -n "$(CLOUDFLARE_API_TOKEN)" ]] || { print -u2 "CLOUDFLARE_API_TOKEN is required"; exit 1; }
	@[[ -n "$(CLOUDFLARE_ACCOUNT_ID)" ]] || { print -u2 "CLOUDFLARE_ACCOUNT_ID is required"; exit 1; }
	@PUBLIC_TURNSTILE_SITE_KEY="$$(terraform -chdir="$(PRODUCTION_DIR)" output -raw turnstile_site_key)" npm --prefix "$(ROOT_DIR)" run build
	@(cd "$(ROOT_DIR)" && node scripts/run-with-wrangler-config.mjs --config "wrangler.production.toml" -- npx wrangler pages deploy "dist" --project-name="$(PRODUCTION_PROJECT_NAME)" --commit-dirty=true)

migrate-staging:
	@npx wrangler d1 migrations apply "$$(terraform -chdir="$(STAGING_DIR)" output -raw d1_database_name)" --config "$(STAGING_WRANGLER_CONFIG)" --remote

migrate-production:
	@npx wrangler d1 migrations apply "$$(terraform -chdir="$(PRODUCTION_DIR)" output -raw d1_database_name)" --config "$(PRODUCTION_WRANGLER_CONFIG)" --remote

update-guests-staging:
	@npm --prefix "$(ROOT_DIR)" run import:invites -- --input "$(INVITES_FILE_STAGING)" --database "$$(terraform -chdir="$(STAGING_DIR)" output -raw d1_database_name)" --config "$(STAGING_WRANGLER_CONFIG)" --remote

update-guests-production:
	@npm --prefix "$(ROOT_DIR)" run import:invites -- --input "$(INVITES_FILE_PROD)" --database "$$(terraform -chdir="$(PRODUCTION_DIR)" output -raw d1_database_name)" --config "$(PRODUCTION_WRANGLER_CONFIG)" --remote

reset-guests-staging:
	@npm --prefix "$(ROOT_DIR)" run import:invites -- --input "$(INVITES_FILE_STAGING)" --database "$$(terraform -chdir="$(STAGING_DIR)" output -raw d1_database_name)" --config "$(STAGING_WRANGLER_CONFIG)" --remote --clear-existing

reset-guests-production:
	@npm --prefix "$(ROOT_DIR)" run import:invites -- --input "$(INVITES_FILE_PROD)" --database "$$(terraform -chdir="$(PRODUCTION_DIR)" output -raw d1_database_name)" --config "$(PRODUCTION_WRANGLER_CONFIG)" --remote --clear-existing

clean:
	rm -rf "$(STAGING_DIR)/.terraform" "$(PRODUCTION_DIR)/.terraform" .wrangler
