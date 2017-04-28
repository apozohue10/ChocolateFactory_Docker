#!/bin/bash

# Author: Alejandro Pozo Huertas
# Entrypoint for Pep Proxy in chocolate factory application

# See if access to Authzforce information is available
function conex_idm () {
  while
    CONEXIDM=`curl --write-out %{http_code} --silent --output /dev/null http://authzforce:8080`
    sleep 4
    (( $CONEXIDM != 200 )) 
  do :; done
}

# See if access to IDM information is available
function conex_auth () {
  while
    CONEXAUTH=`curl --write-out %{http_code} --silent --output /dev/null http://idm:8000`
    sleep 4  
    (( $CONEXAUTH != 200 ))
  do :; done
}

# Create domain in Authzforce and put it in the config.js file
function crear_dominio () {

  # See if the domain has been created
  VARCAT=`cat /fiware-pep-proxy/config.js | grep domains | cut -d/ -f4`
  VARDOM=`curl --write-out %{http_code} --silent --output /dev/null http://authzforce:8080/authzforce-ce/domains/$VARCAT`

  if [ "$VARDOM" == "200" ]; then
    echo "El dominio ya esta creado"
  else
    echo "---Crear dominio y configurarlo en config.js---"
    VARAUTH=`curl -s --request POST --header "Accept: application/xml" --header "Content-Type: application/xml;charset=UTF-8" --data '<?xml version="1.0" encoding="UTF-8"?><taz:domainProperties xmlns:taz="http://authzforce.github.io/rest-api-model/xmlns/authz/5" />' http://authzforce:8080/authzforce-ce/domains`
    arrayDom=$(echo $VARAUTH | tr "\"" "\n")

    VARPAS="false"

    # Obtain the domain id from the response of Authzforce when the domain is created
    for x in $arrayDom
    do
      if [ $VARPAS == "true" ]; then
          DOMINIO=$x
          VARPAS="false" 
      fi
      if [ $x == "href=" ];then
          VARPAS="true"
      fi
    done
    echo "El dominio es $DOMINIO"
    sed -i "s|/authzforce-ce/domains/$VARCAT|/authzforce-ce/domains/$DOMINIO|" /fiware-pep-proxy/config.js
  fi

}


VARIPAUTH=""
DOMINIO=""

conex_idm
conex_auth
crear_dominio

# Run Pep-proxy
cd /fiware-pep-proxy && sudo node server.js
