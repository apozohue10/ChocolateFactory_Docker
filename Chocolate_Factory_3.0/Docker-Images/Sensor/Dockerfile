FROM ubuntu:14.04

# Install dependencies
RUN sudo apt-get update && \
	sudo apt-get install python python-pip curl -y

RUN sudo pip install requests

# Copy files
COPY docker-entrypoint.sh /docker-entrypoint.sh

# Run application
RUN chmod 755 /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]