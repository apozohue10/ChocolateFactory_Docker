#!/bin/bash

# Entrypoint for Chocolate Factory application
# Group: ING from ETSIT-UPM


# Create Chocolate Room
function create_chocolateRoom () {

  echo "---Creando Chocolate Room---"
  VARENTYCR=`(curl orion:1026/v2/entities -s -S --header 'Content-Type: application/json' -d @-) <<EOF
{
      "id": "Chocolate_Room",
      "type": "Room",
      "Temperature": {
          "value": "0.0",
          "type": "Float"
      },
      "Pressure": {
          "value": "0",
          "type": "Integer"
      },
      "Waterfall_speed": {
          "value": "0.0",
          "type": "Float"
      },
      "River_level": {
          "value": "0",
          "type": "Integer"
      },
      "Occupation": {
          "value": "0",
          "type": "Integer"
      }
}
EOF`
  echo "$VARENTYCR"
}

# Create Inventing Room
function create_inventingRoom () {

  echo "---Creando Inventing Room---"
  VARENTYIR=`(curl orion:1026/v2/entities -s -S --header 'Content-Type: application/json' -d @-) <<EOF
{
      "id": "Inventing_Room",
      "type": "Room",
      "Temperature": {
          "value": "0.0",
          "type": "Float"
      },
      "Pressure": {
          "value": "0",
          "type": "Integer"
      },
      "Experimental_Chewing_Gum_size": {
          "value": "0.0",          
          "type": "Float"
      },
      "Experiments_volatility": {
          "value": "0",         
          "type": "Integer"
      },
      "Occupation": {
          "value": "0",
          "type": "Integer"
      }
}
EOF`
  echo "$VARENTYIR"
}

# Create Television Room
function create_televisionRoom () {

  echo "---Creando Television Room---"
  VARENTYTR=`(curl orion:1026/v2/entities -s -S --header 'Content-Type: application/json' -d @-) <<EOF
{
      "id": "Television_Room",
      "type": "Room",
      "Temperature": {
          "value": "0.0",
          "type": "Float"
      },
      "Pressure": {
          "value": "0",
          "type": "Integer"
      },
      "TVs_on": {
          "value": "0.0",
          "type": "Float"
      },
      "Power_consumed": {
          "value": "0",
          "type": "Integer"
      },
      "Occupation": {
          "value": "0",
          "type": "Integer"
      }
}
EOF`
  echo "$VARENTYTR"
}

# Create Big hall
function create_bigHall () {

  echo "---Creando Big hall---"
  VARENTYBG=`(curl orion:1026/v2/entities -s -S --header 'Content-Type: application/json' -d @-) <<EOF
{
      "id": "Big_hall",
      "type": "Room",
      "Temperature": {
          "value": "0.0",
          "type": "Float"
      },
      "Pressure": {
          "value": "0",
          "type": "Integer"
      },
      "Occupation": {
          "value": "0",
          "type": "Integer"
      }
}
EOF`
  echo "$VARENTYBG"
}

# Create Willy wonka office
function create_willyWonkaOffice () {

  echo "---Creando Willy wonka office---"
  VARENTYWO=`(curl orion:1026/v2/entities -s -S --header 'Content-Type: application/json' -d @-) <<EOF
{           
      "id": "Willy_wonka_office",
      "type": "Room", 
      "Temperature": {
          "value": "0.0",
          "type": "Float"
      },
      "Pressure": {
          "value": "0",
          "type": "Integer"
      },
      "Occupation": {
          "value": "0",
          "type": "Integer"
      }
}
EOF`
  echo "$VARENTYWO"
}

# Create Elevator
function create_elevator () {

  echo "---Creando Elevator---"
  VARENTYEL=`(curl orion:1026/v2/entities -s -S --header 'Content-Type: application/json' -d @-) <<EOF
{
      "id": "Elevator",
      "type": "Transportation",
      "Temperature": {
          "value": "0.0",
          "type": "Float"
      },
      "Pressure": {
          "value": "0",
          "type": "Integer"
      },
      "Floor": {
          "value": "0",
          "type": "Integer"
      },
      "Occupation": {
          "value": "0",
          "type": "Integer"
      }
}
EOF`
  echo "$VARENTYEL"
}

# See if access to Context Broker information is available
function conex_cb () {

  while
     CONEXCB=`curl --write-out %{http_code} --silent --output /dev/null http://orion:1026/version`
     sleep 2  
     (( $CONEXCB != 200 )) 
   do :; done
}
   
# Check if entities are created
function comprueba_entities () {

    echo "---Comprobando si las entidades estan creadas---"
    QUERY=`curl --write-out %{http_code} --silent --output /dev/null 172.18.0.4:1026/v2/entities/$1?type=$2 -s -S  --header 'Accept: application/json' | python -mjson.tool`

    if [ "$QUERY" == "404" ];then
      echo "---$1 no esta creado y hay que crearlo---"
      case $1 in
        "Chocolate_Room") create_chocolateRoom ;;
        "Inventing_Room") create_inventingRoom ;;
        "Television_Room") create_televisionRoom ;;
        "Big_hall") create_bigHall ;;
        "Willy_wonka_office") create_willyWonkaOffice ;;
        "Elevator") create_elevator ;;
        *) echo "Nombre entity incorrecto";;
      esac
    elif  [ "$QUERY" == "200" ];then
      echo "---$1 ya esta creado---"
    else
      echo "---Error de comunicación---"
    fi
}

# See if access to Idm information is available
function conex_idm () {

  while
    CONEXIDM=`curl --write-out %{http_code} --silent --output /dev/null http://idm:8000`
    sleep 4  
    (( $CONEXIDM != 200 )) 
  do :; done
}

# Actualize client_id on config.js
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



# Actualize client_secret on config.js
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


# Check connections
echo "Comprueba conexiones"
echo "Conexion a CB..."
conex_cb
echo "Conexion a IDM..."
conex_idm

# Array with entity names
varCho="Chocolate_Room"
varInv="Inventing_Room"
varTel="Television_Room"
varBig="Big_hall"
varWil="Willy_wonka_office"
varEle="Elevator"
varRoom="Room"
varTrans="Transportation"

# Check or create entities
comprueba_entities "${varCho}" "${varRoom}"
comprueba_entities "${varInv}" "${varRoom}"
comprueba_entities "${varTel}" "${varRoom}"
comprueba_entities "${varBig}" "${varRoom}"
comprueba_entities "${varWil}" "${varRoom}"
comprueba_entities "${varEle}" "${varTrans}"

# Check if data has beeen configured in files
client_id
client_secret

# Run app
node app.js
