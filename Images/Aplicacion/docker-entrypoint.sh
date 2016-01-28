#!/bin/bash

# Función que crea entidad Chocolate Room
function create_chocolateRoom () {

  echo "---Creando Chocolate Room---"
  VARENTYCR=`(curl orion:1026/v1/updateContext -s -S --header 'Content-Type: application/json' --header 'Accept: application/json' -d @- | python -mjson.tool) <<EOF
{
    "contextElements": [
        {
            "type": "Room",
            "isPattern": "false",
            "id": "Chocolate Room",
            "attributes": [
            {
                "name": "Temperature",
                "type": "float",
                "value": "0.0"
            },
            {
                "name": "Pressure",
                "type": "integer",
                "value": "0"
            },
            {
                "name": "Waterfall speed",
                "type": "float",
                "value": "0.0"
            },
            {
                "name": "River level",
                "type": "integer",
                "value": "0"
            },
            {
                "name": "Occupation",
                "type": "integer",
                "value": "0"
            }
            ]
        }
    ],
    "updateAction": "APPEND"
}
EOF`
  echo "$VARENTYCR"
}

# Función que crea entidad Inventing Room
function create_inventingRoom () {

  echo "---Creando Inventing Room---"
  VARENTYIR=`(curl orion:1026/v1/updateContext -s -S --header 'Content-Type: application/json' --header 'Accept: application/json' -d @- | python -mjson.tool) <<EOF
{
    "contextElements": [
        {
            "type": "Room",
            "isPattern": "false",
            "id": "Inventing Room",
            "attributes": [
            {
                "name": "Temperature",
                "type": "float",
                "value": "0.0"
            },
            {
                "name": "Pressure",
                "type": "integer",
                "value": "0"
            },
            {
                "name": "Experimental Chewing Gum size",
                "type": "float",
                "value": "0.0"
            },
            {
                "name": "Experiments volatility",
                "type": "integer",
                "value": "0"
            },
            {
                "name": "Occupation",
                "type": "integer",
                "value": "0"
            }
            ]
        }
    ],
    "updateAction": "APPEND"
}
EOF`
  echo "$VARENTYIR"
}

# Función que crea entidad Television Room
function create_televisionRoom () {

  echo "---Creando Television Room---"
  VARENTYTR=`(curl orion:1026/v1/updateContext -s -S --header 'Content-Type: application/json' --header 'Accept: application/json' -d @- | python -mjson.tool) <<EOF
{
    "contextElements": [
        {
            "type": "Room",
            "isPattern": "false",
            "id": "Television Room",
            "attributes": [
            {
                "name": "Temperature",
                "type": "float",
                "value": "0.0"
            },
            {
                "name": "Pressure",
                "type": "integer",
                "value": "0"
            },
            {
                "name": "TVs on",
                "type": "float",
                "value": "0.0"
            },
            {
                "name": "Power consumed",
                "type": "integer",
                "value": "0"
            },
            {
                "name": "Occupation",
                "type": "integer",
                "value": "0"
            }
            ]
        }
    ],
    "updateAction": "APPEND"
}
EOF`
  echo "$VARENTYTR"
}

# Función que crea entidad Big hall
function create_bigHall () {

  echo "---Creando Big hall---"
  VARENTYBG=`(curl orion:1026/v1/updateContext -s -S --header 'Content-Type: application/json' --header 'Accept: application/json' -d @- | python -mjson.tool) <<EOF
{
    "contextElements": [
        {
            "type": "Room",
            "isPattern": "false",
            "id": "Big hall",
            "attributes": [
            {
                "name": "Temperature",
                "type": "float",
                "value": "0.0"
            },
            {
                "name": "Pressure",
                "type": "integer",
                "value": "0"
            },
            {
                "name": "Occupation",
                "type": "integer",
                "value": "0"
            }
            ]
        }
    ],
    "updateAction": "APPEND"
}
EOF`
  echo "$VARENTYBG"
}

# Función que crea entidad Willy wonka office
function create_willyWonkaOffice () {

  echo "---Creando Willy wonka office---"
  VARENTYWO=`(curl orion:1026/v1/updateContext -s -S --header 'Content-Type: application/json' --header 'Accept: application/json' -d @- | python -mjson.tool) <<EOF
{
    "contextElements": [
        {
            "type": "Room",
            "isPattern": "false",
            "id": "Willy wonka office",
            "attributes": [
            {
                "name": "Temperature",
                "type": "float",
                "value": "0.0"
            },
            {
                "name": "Pressure",
                "type": "integer",
                "value": "0"
            },
            {
                "name": "Occupation",
                "type": "integer",
                "value": "0"
            }
            ]
        }
    ],
    "updateAction": "APPEND"
}
EOF`
  echo "$VARENTYWO"
}

# Función que crea entidad Elevator
function create_elevator () {

  echo "---Creando Elevator---"
  VARENTYEL=`(curl orion:1026/v1/updateContext -s -S --header 'Content-Type: application/json' --header 'Accept: application/json' -d @- | python -mjson.tool) <<EOF
{
    "contextElements": [
        {
            "type": "Transportation",
            "isPattern": "false",
            "id": "Elevator",
            "attributes": [
            {
                "name": "Temperature",
                "type": "float",
                "value": "0.0"
            },
            {
                "name": "Pressure",
                "type": "integer",
                "value": "0"
            },
            {
                "name": "Floor",
                "type": "integer",
                "value": "0"
            },
            {
                "name": "Occupation",
                "type": "integer",
                "value": "0"
            }
            ]
        }
    ],
    "updateAction": "APPEND"
}
EOF`
  echo "$VARENTYEL"
}

# Ver si esta disponible acceder a Context Broker
function conex_cb () {

  while
     CONEXCB=`curl --write-out %{http_code} --silent --output /dev/null http://orion:1026`
     sleep 2  
     (( $CONEXCB != 200 )) 
   do :; done
}
   
# Comprobar si las entidades estan creadas
function comprueba_entities () {

    echo "---Comprobando si las entidades estan creadas---"
    QUERY=`(curl orion:1026/v1/queryContext -s -S --header 'Content-Type: application/json' --header 'Accept: application/json' -d @- | python -mjson.tool) <<EOF
    {
      "entities": [
          {
              "type": "$2",
              "isPattern": "false",
              "id": "$1"
          }
      ]
    }
EOF`
    VARPAS="false"
    arrayEn=$(echo $QUERY | tr "\"" "\n")
    array=()
    for x in $arrayEn
    do
      
      if [ $x == "code" ];then
        VARPAS="true"
      fi
      if [ $x == "," ];then
        VARPAS="false"
      fi
      if [ $VARPAS == "true" ]; then
        array+=($x)
      fi
    done

    VARR=${array[2]}

    if [ "$VARR" == "404" ];then
      echo "---$1 no esta creado y hay que crearlo---"
      case $1 in
        "Chocolate Room") create_chocolateRoom ;;
        "Inventing Room") create_inventingRoom ;;
        "Television Room") create_televisionRoom ;;
        "Big hall") create_bigHall ;;
        "Willy wonka office") create_willyWonkaOffice ;;
        "Elevator") create_elevator ;;
        *) echo "Nombre entity incorrecto";;
      esac
    elif  [ "$VARR" == "200" ];then
      echo "---$1 ya esta creado---"
    else
      echo "---Error de comunicación---"
    fi
}

# Ver si esta disponible acceder a la información en idm
function conex_idm () {

  while
    CONEXIDM=`curl --write-out %{http_code} --silent --output /dev/null http://idm:8000`
    sleep 4  
    (( $CONEXIDM != 200 )) 
  do :; done
}

# Actualizar client_id de config.js
function client_id () {

  echo "---Client Id---"
  VARID=`curl -s --header "X-Auth-Token: ADMIN" http://idm:5000/v3/OS-OAUTH2/consumers`
  IFS='\"' read -r -a arrayId <<< "$VARID"

  for ((n=${#arrayId[@]}; n>0; n--))
  {
      if [ "${arrayId[n]}" == "name" ];then
         if [ "${arrayId[n+2]}" == "Chocolate Factory" ];then
            CLIENTID="${arrayId[n-2]}"
         fi	
      fi
  }

  VARCLIENT=`cat config.js | grep config.client_id | cut -d: -f2 | awk '{ print $3}'`
  if [ "$VARCLIENT" == "'5d43e494421946edbb2add4a630f34f2';" ]; then
     sed -i "s/config.client_id = '5d43e494421946edbb2add4a630f34f2';/config.client_id = '$CLIENTID';/" config.js
     echo "Client_id es $CLIENTID"
  elif [ "$VARCLIENT" == "'$CLIENTID';" ]; then
     echo "Client_id ya esta configurado"
  elif [ "$VARCLIENT" != "'$CLIENTID';" ]; then
     sed -i "s/config.client_id = $VARCLIENT/config.client_id = '$CLIENTID';/" config.js
     echo "El nuevo client_id es $CLIENTID"
  fi
  
}



# Actualizar client_secret de config.js
function client_secret () {

  echo "---Client Secret---"
  VARSEC=`curl -s --header "X-Auth-Token: ADMIN" http://idm:5000/v3/OS-OAUTH2/consumers/$CLIENTID`
  IFS='\"' read -r -a arraySec <<< "$VARSEC"

  for ((n=${#arraySec[@]}; n>0; n--))
  {
     if [ "${arraySec[n]}" == "secret" ];then
        CLIENTSEC="${arraySec[n+2]}"
     fi
  }

  VARSECRET=`cat config.js | grep config.client_secret | cut -d: -f2 | awk '{ print $3}'`
  if [ "$VARSECRET" == "'76eafec1c7a545faa07a9007ad523fb9';" ]; then
     sed -i "s/config.client_secret = '76eafec1c7a545faa07a9007ad523fb9';/config.client_secret = '$CLIENTSEC';/" config.js
     echo "Client_secret es $CLIENTSEC"
  elif [ "$VARSECRET" == "'$CLIENTSEC';" ]; then
     echo "Client_secret ya esta configurado"
  elif [ "$VARSECRET" != "'$CLIENTSEC';" ]; then
     sed -i "s/config.client_secret = $VARSECRET/config.client_secret = '$CLIENTSEC';/" config.js
     echo "El nuevo client_secret es $CLIENTSEC"
  fi

}

# Actualizar config.js, app.js, subscription.js y updateContext.js
function actualizar_archivos () {

  echo "---Configurar config.js, app.js, subscription.js y updateContext.js---"
  VARIP=`ifconfig eth0 | grep 'inet addr:' | cut -d: -f2 | awk '{ print $1}'`
  echo "Ip de app $VARIP"
  IFS='.' read -r -a arrayIp <<< "$VARIP"
  VARIPN=`expr ${arrayIp[3]} - 2` 
  VARIPIDM="${arrayIp[0]}.${arrayIp[1]}.${arrayIp[2]}.$VARIPN"
  echo "Ip de idm $VARIPIDM"

  VARCONFIG=`cat config.js | grep config.idmURL | cut -d " " -f3`
  if [ "$VARCONFIG" == "'http://localhost:8000';" ]; then
     echo "Configurando archivos..."
     sed -i "s|config.idmURL = 'http://localhost:8000';|config.idmURL = 'http://$VARIPIDM:8000';|" config.js
     sed -i "s|config.callbackURL = 'http://localhost:1028/login';|config.callbackURL = 'http://$VARIP:1028/login';|" config.js
     sed -i "s/localhost/orion/" context_operations/updateContext.js
     sed -i "s/8080/1026/" context_operations/updateContext.js
     sed -i "s/138.4.7.25/$VARIP/" context_operations/subscription.js
     sed -i "s/localhost/orion/" context_operations/subscription.js
     sed -i "s/8080/1026/" context_operations/subscription.js
     sed -i "s/localhost/pepproxy/" app.js
  else
     echo "Ya estan configurados"
  fi
  
}

#Comprobar conexiones
conex_cb
conex_idm

# Array con nombres de entidades
varCho="Chocolate Room"
varInv="Inventing Room"
varTel="Television Room"
varBig="Big hall"
varWil="Willy wonka office"
varEle="Elevator"
varRoom="Room"
varTrans="Transportation"

# Comprueba o crea entidades
comprueba_entities "${varCho}" "${varRoom}"
comprueba_entities "${varInv}" "${varRoom}"
comprueba_entities "${varTel}" "${varRoom}"
comprueba_entities "${varBig}" "${varRoom}"
comprueba_entities "${varWil}" "${varRoom}"
comprueba_entities "${varEle}" "${varTrans}"

# Comprueba si estan configurados ciertos datos en la App
client_id
client_secret
actualizar_archivos

# Arrancar aplicación
node app.js
