#!/bin/bash

# Obtener ip de la app
function ip_app () {

  echo "---Ips de app---"
  VARIP=`ifconfig eth0 | grep 'inet addr:' | cut -d: -f2 | awk '{ print $1}'`
  IFS='.' read -r -a arrayIp <<< "$VARIP"
  VARIPN=`expr ${arrayIp[3]} + 2` 
  VARIPAPP="${arrayIp[0]}.${arrayIp[1]}.${arrayIp[2]}.$VARIPN"
  echo "$VARIPAPP"
  export VARIPAPP

}

# Popular la base de datos
function _data_provision () {
        VARTAM=`du /opt/idm/keystone/keystone.db`
        arrayTam=$(echo $VARTAM | tr "  " "\n")

        VARPAS="true"
        for x in $arrayTam
        do
           if [ $VARPAS == "true" ]; then
              VARNS=$x
              VARPAS="false"
           fi
        done

        if [ -e /opt/idm/keystone/keystone.db ] && [  $VARNS -gt 0 ]; then
           echo "---Provision has been done already---"
        else
           local FILE=default_provision
           sed -i "/from deployment import keystone/a from deployment import ${FILE}" /opt/idm/fabfile.py
           workon idm_tools
           echo "---Creating Keystone database---"
           fab keystone.database_create
           echo "---Provisioning users, roles, and apps---"
           fab keystone.populate
           fab ${FILE}.test_data
           echo "---Provision done---"
        fi
}

# Arrancar Keystone
function start_keystone () {

    echo "---Starting Keystone server---"
    (
        workon idm_tools
        cd /opt/idm/keystone/
        ./tools/with_venv.sh bin/keystone-all ${KEYSTONE_VERBOSE_LOG} >> /var/log/keystone.log 2>&1 &

    )
     
}

# Arrancar Horizon
function start_horizon () {

    echo "---Starting Horizon Front-end---"
    workon idm_tools
    fab horizon.dev_server
}

source /usr/local/bin/virtualenvwrapper.sh
ip_app
start_keystone
_data_provision
start_horizon

