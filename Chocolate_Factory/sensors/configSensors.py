# Script to configure sensors containers
#
# Group: ING from ETSIT-UPM

import collections
import os

# Read data sensors from file
# The file structure is:  "Name of Room"-"Type of Room"/"Name of Sensor"-"Variable Type"-"Min Value of Variable"-"Max value of Variable"|"Name of Sensor"....
def read_data(file):
	data = collections.defaultdict(dict)
	with open(file) as f:
		for line in f:
   			keyRoom = line.rstrip("\n").split("/")[0]
   			keyAttr = line.rstrip("\n").split("/")[1].split("|")
   			for attr in keyAttr:
   				valAttr = attr.split("-")
				data[keyRoom][valAttr[0]] = valAttr[1:]
	return data

# Use the dictionary obtained from read_data to change values in sensor.py.template
# Copy the file generated from the template to each sensor container
def change_sensor(dictRooms,nameSensor):
	i=1
	for room in dictRooms:
		for attr in dictRooms[room]:
			roomName=room.split("-")[0]
			sensorIdM=roomName.split("_")[0]+'_'+attr.split("_")[0]
			with open("sensors/sensor.py.template") as fileSensor:
				with open("sensors/sensor.py", "w") as new_fileSensor:
					for line in fileSensor:
						line = line.replace("nameSensorIdM", sensorIdM)
						line = line.replace("passSensorIdM", sensorIdM)
						line = line.replace("roomName", room.split("-")[0])
						#line = line.replace("typeRoom", room.split("-")[1])
						line = line.replace("attributeName", attr)
						line = line.replace("typeName", dictRooms[room][attr][0])
						if ( "random.uniform" in line) and (dictRooms[room][attr][0] == "Integer" ):
							line =line.replace("random.uniform", "random.randint")
						line = line.replace("minVal", dictRooms[room][attr][1])
						line = line.replace("maxVal", dictRooms[room][attr][2])
						new_fileSensor.write(line)
			numberSensor=nameSensor+str(i)
			os.system("sudo docker cp sensors/sensor.py %(numberSensor)s:sensor.py"% vars())
			i=i+1

	os.system("rm sensors/sensor.py")

# See if config files are copied to sensors containers
def run_sensor():

	nameSensor=sorted(os.popen("sudo docker inspect --format='{{.Name}}' $(sudo docker ps -aq --no-trunc) | grep sensor | tr -d '/'").read()[:-1].split("\n"))[0]
	dictRooms=read_data("sensors/sensorsInfo")

	isCreated=os.popen("sudo docker exec %(nameSensor)s [ -e sensor.py ] && echo 'yes' || echo 'no'"% vars()).read()[:-1]

	if ( isCreated == "no" ):
		print('Copying files to sensors...')
		change_sensor(dictRooms,nameSensor[:-1])
	elif ( isCreated == "yes" ):
		print('Config files have been already copied')
	else:
		print('Error when copying files')
