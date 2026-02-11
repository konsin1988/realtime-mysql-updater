dev:
	docker compose up -d dev

re:
	docker compose down
	docker image rm konsin1988/rtpc-debezium-dev:1.0.0 
	docker compose up -d --build dev

prod:
	docker compose up -d --build prod

clear:
	docker compose down
	docker image rm  konsin1988/rt-api:1.0.0

