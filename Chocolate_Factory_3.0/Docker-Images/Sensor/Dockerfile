FROM ubuntu:14.04

# Install dependencies
RUN sudo apt-get update && \
	sudo apt-get install python -y

# Run application
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod 755 /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]