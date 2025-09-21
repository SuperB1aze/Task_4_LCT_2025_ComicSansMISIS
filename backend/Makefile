.PHONY: help
help: ## Показ команд
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

compose-up: ## Запуск docker compose
	docker compose up --build -d && docker compose logs -f
.PHONY: compose-up

compose-down: ## Остановка docker compose
	docker compose down --remove-orphans
.PHONY: compose-down
