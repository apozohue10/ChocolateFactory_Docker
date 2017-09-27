#!/bin/bash

# Group: ING from ETSIT-UPM
# Entrypoint for Pep Proxy in chocolate factory application

# See if access to IdM information is available
function conex_idm () {
  while
    CONEXIDM=`curl --write-out %{http_code} --silent --output /dev/null http://idm:8000`
    sleep 4
    (( $CONEXIDM != 200 )) 
  do :; done
}

# See if access to Authzforce information is available
function conex_auth () {
  while
    CONEXAUTH=`curl --write-out %{http_code} --silent --output /dev/null http://authzforce:8080`
    sleep 4  
    (( $CONEXAUTH != 200 ))
  do :; done
}


conex_idm
conex_auth

# Run Pep-proxy
cd /fiware-pep-proxy && sudo node server.js
