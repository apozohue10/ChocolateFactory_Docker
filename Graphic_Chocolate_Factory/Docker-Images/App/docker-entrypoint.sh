#!/bin/bash

# Entrypoint for Chocolate Factory application
# Author: Alejandro Pozo Huertas
# Project: TFM for ETSIT-UPM


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
          "value": "20",
          "type": "Integer"
      },
      "River_level": {
          "value": "100",
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
      "TV1_on": {
          "value": "0",
          "type": "Integer"
      },
      "TV2_on": {
          "value": "0",
          "type": "Integer"
      },
      "TV3_on": {
          "value": "0",
          "type": "Integer"
      },
      "TV4_on": {
          "value": "0",
          "type": "Integer"
      },
      "TV5_on": {
          "value": "0",
          "type": "Integer"
      },
      "TV6_on": {
          "value": "0",
          "type": "Integer"
      },
      "TV7_on": {
          "value": "0",
          "type": "Integer"
      },
      "TV8_on": {
          "value": "0",
          "type": "Integer"
      },
      "TV9_on": {
          "value": "0",
          "type": "Integer"
      },
      "TV10_on": {
          "value": "0",
          "type": "Integer"
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

# Create Squirrel 1
function create_squirrel1 () {

  echo "---Creando Squirrel1---"
  VARENTYEL=`(curl orion:1026/v2/entities -s -S --header 'Content-Type: application/json' -d @-) <<EOF
{
      "id": "Squirrel1",
      "type": "Animal",
      "Position": {
          "value": "40.925450, -4.063100",
          "type": "geo:point"
      }
}
EOF`
  echo "$VARENTYEL"
}

# Create Squirrel 2
function create_squirrel2 () {

  echo "---Creando Squirrel2---"
  VARENTYEL=`(curl orion:1026/v2/entities -s -S --header 'Content-Type: application/json' -d @-) <<EOF
{
      "id": "Squirrel2",
      "type": "Animal",
      "Position": {
          "value": "40.925850, -4.063300",
          "type": "geo:point"
      }
}
EOF`
  echo "$VARENTYEL"
}

# Create Squirrel 3
function create_squirrel3 () {

  echo "---Creando Squirrel3---"
  VARENTYEL=`(curl orion:1026/v2/entities -s -S --header 'Content-Type: application/json' -d @-) <<EOF
{
      "id": "Squirrel3",
      "type": "Animal",
      "Position": {
          "value": "40.925550, -4.063500",
          "type": "geo:point"
      }
}
EOF`
  echo "$VARENTYEL"
}

# Create Squirrel 4
function create_squirrel4 () {

  echo "---Creando Squirrel4---"
  VARENTYEL=`(curl orion:1026/v2/entities -s -S --header 'Content-Type: application/json' -d @-) <<EOF
{
      "id": "Squirrel4",
      "type": "Animal",
      "Position": {
          "value": "40.925320, -4.063800",
          "type": "geo:point"
      }
}
EOF`
  echo "$VARENTYEL"
}

# Create Squirrel 5
function create_squirrel5 () {

  echo "---Creando Squirrel5---"
  VARENTYEL=`(curl orion:1026/v2/entities -s -S --header 'Content-Type: application/json' -d @-) <<EOF
{
      "id": "Squirrel5",
      "type": "Animal",
      "Position": {
          "value": "40.925230, -4.063750",
          "type": "geo:point"
      }
}
EOF`
  echo "$VARENTYEL"
}

# Create Squirrel 6
function create_squirrel6 () {

  echo "---Creando Squirrel6---"
  VARENTYEL=`(curl orion:1026/v2/entities -s -S --header 'Content-Type: application/json' -d @-) <<EOF
{
      "id": "Squirrel6",
      "type": "Animal",
      "Position": {
          "value": "40.927430, -4.063850",
          "type": "geo:point"
      }
}
EOF`
  echo "$VARENTYEL"
}

# Create Squirrel 7
function create_squirrel7 () {

  echo "---Creando Squirrel7---"
  VARENTYEL=`(curl orion:1026/v2/entities -s -S --header 'Content-Type: application/json' -d @-) <<EOF
{
      "id": "Squirrel7",
      "type": "Animal",
      "Position": {
          "value": "40.926230, -4.064050",
          "type": "geo:point"
      }
}
EOF`
  echo "$VARENTYEL"
}

# Create Squirrel 8
function create_squirrel8 () {

  echo "---Creando Squirrel8---"
  VARENTYEL=`(curl orion:1026/v2/entities -s -S --header 'Content-Type: application/json' -d @-) <<EOF
{
      "id": "Squirrel8",
      "type": "Animal",
      "Position": {
          "value": "40.926210, -4.063450",
          "type": "geo:point"
      }
}
EOF`
  echo "$VARENTYEL"
}

# Create Squirrel 9
function create_squirrel9 () {

  echo "---Creando Squirrel9---"
  VARENTYEL=`(curl orion:1026/v2/entities -s -S --header 'Content-Type: application/json' -d @-) <<EOF
{
      "id": "Squirrel9",
      "type": "Animal",
      "Position": {
          "value": "40.924630, -4.063450",
          "type": "geo:point"
      }
}
EOF`
  echo "$VARENTYEL"
}

# Create Squirrel 10
function create_squirrel10 () {

  echo "---Creando Squirrel10---"
  VARENTYEL=`(curl orion:1026/v2/entities -s -S --header 'Content-Type: application/json' -d @-) <<EOF
{
      "id": "Squirrel10",
      "type": "Animal",
      "Position": {
          "value": "40.924630, -4.063750",
          "type": "geo:point"
      }
}
EOF`
  echo "$VARENTYEL"
}

# See if access to Context Broker information is available
function conex_cb () {

  while
     CONEXCB=`curl --write-out %{http_code} --silent --output /dev/null http://orion:1026/version`
     sleep 1  
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
        "Squirrel1") create_squirrel1 ;;
        "Squirrel2") create_squirrel2 ;;
        "Squirrel3") create_squirrel3 ;;
        "Squirrel4") create_squirrel4 ;;
        "Squirrel5") create_squirrel5 ;;
        "Squirrel6") create_squirrel6 ;;
        "Squirrel7") create_squirrel7 ;;
        "Squirrel8") create_squirrel8 ;;
        "Squirrel9") create_squirrel9 ;;
        "Squirrel10") create_squirrel10 ;;
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
    sleep 1  
    (( $CONEXIDM != 200 )) 
  do :; done
}

# Actualize client_id of config.js
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



# Actualize client_secret of config.js
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
varSq1="Squirrel1"
varSq2="Squirrel2"
varSq3="Squirrel3"
varSq4="Squirrel4"
varSq5="Squirrel5"
varSq6="Squirrel6"
varSq7="Squirrel7"
varSq8="Squirrel8"
varSq9="Squirrel9"
varSq10="Squirrel10"
varRoom="Room"
varTrans="Transportation"
varAnim="Animal"

# Check or create entities
comprueba_entities "${varCho}" "${varRoom}"
comprueba_entities "${varInv}" "${varRoom}"
comprueba_entities "${varTel}" "${varRoom}"
comprueba_entities "${varBig}" "${varRoom}"
comprueba_entities "${varWil}" "${varRoom}"
comprueba_entities "${varEle}" "${varTrans}"
comprueba_entities "${varSq1}" "${varAnim}"
comprueba_entities "${varSq2}" "${varAnim}"
comprueba_entities "${varSq3}" "${varAnim}"
comprueba_entities "${varSq4}" "${varAnim}"
comprueba_entities "${varSq5}" "${varAnim}"
comprueba_entities "${varSq6}" "${varAnim}"
comprueba_entities "${varSq7}" "${varAnim}"
comprueba_entities "${varSq8}" "${varAnim}"
comprueba_entities "${varSq9}" "${varAnim}"
comprueba_entities "${varSq10}" "${varAnim}"

# Check if data has beeen configured in files
client_id
client_secret

# Run app
node app.js
