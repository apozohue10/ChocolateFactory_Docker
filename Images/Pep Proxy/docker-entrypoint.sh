#!/bin/bash


# Ver si esta disponible acceder a la información en idm
function conex_idm () {
  while
    CONEXIDM=`curl --write-out %{http_code} --silent --output /dev/null http://authzforce:8080`
    sleep 4
    (( $CONEXIDM != 200 )) 
  do :; done
}

# Ver si esta disponible acceder a la información en authzforce
function conex_auth () {
  while
    CONEXAUTH=`curl --write-out %{http_code} --silent --output /dev/null http://idm:8000`
    sleep 4  
    (( $CONEXAUTH != 200 ))
  do :; done
}

# Averiguar Ip de Authzforce
function ip_authzforce () {
  echo "---IP de Authzforce---"
  VARIP=`ifconfig eth0 | grep 'inet addr:' | cut -d: -f2 | awk '{ print $1}'`
  IFS='.' read -r -a arrayIp <<< "$VARIP"
  VARIPN=`expr ${arrayIp[3]} - 3` 
  VARIPAUTH="${arrayIp[0]}.${arrayIp[1]}.${arrayIp[2]}.$VARIPN"
  echo "$VARIPAUTH"
}

# Crear dominio en Authzforce y ponerlo en config.js
function crear_dominio () {

  VARCAT=`cat config.js | grep authzforce | cut -d/ -f4`
  VARDOM=`curl --write-out %{http_code} --silent --output /dev/null http://$VARIPAUTH:8080/authzforce/domains/$VARCAT`

  if [ "$VARDOM" == "404" ]; then
     echo "---Crear dominio y configurarlo en config.js---"
     VARAUTH=`curl -s --verbose --trace-ascii - --request POST --header "Content-Type: application/xml;charset=UTF-8" --data '<?xml version="1.0" encoding="UTF-8"?><taz:properties xmlns:taz="http://thalesgroup.com/authz/model/3.0/resource"><name>MyDomain</name><description>This is my domain.</description></taz:properties>' --header "Accept: application/xml" http://$VARIPAUTH:8080/authzforce/domains`
     arrayDom=$(echo $VARAUTH | tr "\"" "\n")

     VARPAS="false"

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
     sed -i "s|/authzforce/domains/$VARCAT|/authzforce/domains/$DOMINIO|" config.js
  else
     echo "El dominio ya esta creado"
  fi

}

# Configurar config.js
function configurar_config () {

  echo "---Configurar config.js---"
  
  VARCONFIG=`cat config.js | grep config.app_host | cut -d\' -f2`
  if [ "$VARCONFIG" == "localhost" ]; then
     echo "Configurando archivos..."
     sed -i "s|host: 'localhost'|host: '$VARIPAUTH'|" config.js
     sed -i "s|port: 8081|port: 8080|" config.js
     sed -i "s|config.account_host = 'http://localhost:8000'|config.account_host = 'http://idm:8000'|" config.js
     sed -i "s|config.keystone_host = 'localhost'|config.keystone_host = 'idm'|" config.js
     sed -i "s|config.keystone_port = 8050|config.keystone_port = 5000|" config.js
     sed -i "s|config.app_host = 'localhost'|config.app_host = 'http://chocolatefactory'|" config.js
  else 
     echo "Ya estan configurados"
  fi
}

VARIPAUTH=""
DOMINIO=""

conex_idm
conex_auth
ip_authzforce
crear_dominio
configurar_config

sudo node server.js
