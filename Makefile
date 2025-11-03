up:
	docker compose -f compose-dev.yaml pull
	docker compose -f compose-dev.yaml up -d

stop:
	docker compose -f compose-dev.yaml stop

down:
	docker compose -f compose-dev.yaml down

restart:
	docker compose -f compose-dev.yaml down
	docker compose -f compose-dev.yaml up -d