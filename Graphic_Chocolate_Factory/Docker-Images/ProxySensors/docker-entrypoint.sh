#!/bin/bash

# Author: Alejandro Pozo Huertas
# Entrypoint for Pep Proxy in chocolate factory application

# See if access to IdM information is available
function conex_idm () {
  while
    CONEXIDM=`curl --write-out %{http_code} --silent --output /dev/null http://idm:8000`
    sleep 1
    (( $CONEXIDM != 200 )) 
  do :; done
}

conex_idm
conex_auth

# Run Pep-proxy
cd /fiware-pep-proxy && sudo node server.js
