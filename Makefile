up:
	docker compose -f compose-dev.yaml pull
	docker compose -f compose-dev.yaml up -d

stop:
	docker compose -f compose-dev.yaml stop

restart:
	docker compose -f compose-dev.yaml stop
	docker compose -f compose-dev.yaml up -d