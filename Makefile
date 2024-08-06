ENV := $(PWD)/.env
include $(ENV)

mysql:
	@echo "Starting MySQL container..."
	@sudo docker run -d --name mysql-container \
	-e MYSQL_ROOT_PASSWORD=$(MYSQL_ROOT_PASSWORD) \
	-e MYSQL_DATABASE=$(MYSQL_DATABASE) \
	-e MYSQL_PASSWORD=$(MYSQL_PASSWORD) \
	-p 3306:$(MYSQL_PORT) \
	-v $(PWD)/db/schema.sql:/docker-entrypoint-initdb.d/schema.sql \
	mysql:latest
	@sudo docker start mysql-container

removemysql:
	@echo "Stopping MySQL container..."
	@docker stop mysql-container
	@docker rm mysql-container

.PHONY: mysql removemysql