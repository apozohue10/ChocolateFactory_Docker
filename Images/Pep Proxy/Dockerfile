FROM ubuntu:14.04

WORKDIR /opt

# Install Ubuntu dependencies
RUN sudo apt-get update && \
	sudo apt-get install make g++ software-properties-common python-software-properties -y && \
	sudo add-apt-repository ppa:chris-lea/node.js -y && \
	sudo apt-get update && \
	sudo apt-get install nodejs git curl -y

# Clone code of Pep-proxy and install npm dependencies
RUN git clone https://github.com/dmartr/PEP-Proxy fiware-pep-proxy

# Run PEP Proxy
WORKDIR /opt/fiware-pep-proxy
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod 755 /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]

# Exposed port
expose 8070

