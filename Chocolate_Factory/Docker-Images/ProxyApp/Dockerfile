FROM ubuntu:14.04

MAINTAINER FIWARE Wilma PEP Proxy Team. DIT-UPM

# Install Ubuntu dependencies
RUN sudo apt-get update && \
	sudo apt-get install make g++ software-properties-common python-software-properties -y && \
	sudo add-apt-repository ppa:chris-lea/node.js -y && \
	sudo apt-get update && \
	sudo apt-get install nodejs git -y && \
	sudo apt-get install curl -y

# Download latest version of the code and install npm dependencies
RUN git clone https://github.com/ging/fiware-pep-proxy.git && \
	cd fiware-pep-proxy && \
	git checkout tags/5.4 && \
	npm install

COPY config.js /fiware-pep-proxy/config.js
COPY root.js /fiware-pep-proxy/controllers/root.js
COPY azf.js /fiware-pep-proxy/lib/azf.js
COPY docker-entrypoint.sh /docker-entrypoint.sh

RUN chmod 755 /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]

# Exposed port
expose 8070
