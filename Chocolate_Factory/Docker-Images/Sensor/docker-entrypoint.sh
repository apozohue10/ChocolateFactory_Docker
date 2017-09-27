#!/bin/bash

# Entrypoint for Sensor in chocolate factory application
# Group: ING from ETSIT-UPM

# See if Context Broker is deployed
function conex_cb () {

  while
     CONEXCB=`curl --write-out %{http_code} --silent --output /dev/null http://orion:1026/version`
     sleep 2  
     (( $CONEXCB != 200 )) 
   do :; done
}

# See if Pep Proxy for Sensors is deployed
function conex_pep () {

  while
     CONEXCB=`curl --write-out %{http_code} --silent --output /dev/null http://pepproxySensors:8070`
     sleep 2  
     (( $CONEXCB != 401 )) 
   do :; done
}

# See if the script sensor.py is copied in the container
function copy_files () {

	VARCOPY="NO"

	while [ $VARCOPY == "NO" ]
	do
    	if [ -e sensor.py ]; then
        	VARCOPY="OK"
   		else
        	sleep 2
    	fi
	done
}

conex_cb
conex_pep
copy_files
# Run script
python -u sensor.py