FROM ubuntu:14.04

WORKDIR /opt

# Install Ubuntu dependencies
RUN sudo apt-get update && \
    sudo apt-get install python-software-properties software-properties-common -y && \
    sudo add-apt-repository ppa:chris-lea/node.js -y && \
	sudo apt-get update && \
	sudo apt-get install nodejs git curl -y

# Clone code of Chocolate Factory and install npm dependencies
RUN git clone https://github.com/dmartr/chocolatefactory chocolatefactory

WORKDIR /opt/chocolatefactory

# Run application
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod 755 /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]

# Exposed port
EXPOSE 1028
