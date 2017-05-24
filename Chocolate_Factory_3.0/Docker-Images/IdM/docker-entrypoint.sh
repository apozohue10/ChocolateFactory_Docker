#!/bin/bash

# Author: Alejandro Pozo Huertas
# Entrypoint for IDM in chocolate factory application

# Get ip of the chocolate factory
function ip_app () {

  echo "---Ips de app---"
  VARIPAPP=`ping -c 1 chocolatefactory | grep -m 1 "" | cut -d "(" -f2 | cut -d ")" -f1`
  echo "$VARIPAPP"
  export VARIPAPP

}

# Provide consumer, users and roles to the application
function _data_provision () {
        echo "---Database---"
        VARTAM=`du /keystone/keystone.db`
        arrayTam=$(echo $VARTAM | tr "  " "\n")

        VARPAS="true"
        for x in $arrayTam
        do
           if [ $VARPAS == "true" ]; then
              VARNS=$x
              VARPAS="false"
           fi
        done

        if [ -e /keystone/keystone.db ] && [  $VARNS -gt 112 ]; then
           echo "---Provision has been done already---"
        else
           python default_provision.py
        fi
}

# See if access to Authzforce information is available
function conex_auth () {
  while
    CONEXAUTH=`curl --write-out %{http_code} --silent --output /dev/null http://authzforce:8080`
    sleep 4  
    (( $CONEXAUTH != 200 ))
  do :; done
}

# Run Keystone and Horizon
conex_auth
ip_app

echo "---Run Keystone---"
./tools/with_venv.sh bin/keystone-all ${KEYSTONE_VERBOSE_LOG} >> /var/log/keystone.log 2>&1 &

sleep 5

_data_provision

echo "---Run Horizon---"
sudo /horizon/tools/with_venv.sh python /horizon/manage.py runserver 0.0.0.0:8000

