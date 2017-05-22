#!/bin/bash

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

copy_files
python sensor.py