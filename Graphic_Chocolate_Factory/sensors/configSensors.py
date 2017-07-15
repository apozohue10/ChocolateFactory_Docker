# Script to configure sensors containers
#
# Author: Alejandro Pozo Huertas
# Project: TFM for ETSIT-UPM
import collections
import os
import platform
import subprocess

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
						elif (attr[:2] == "TV") or (attr == "Power_consumed") or (attr == "Waterfall_speed") or (attr == "River_level"):
							line =line.replace("update_values(randomVal)", "#update_values(randomVal)")
						line = line.replace("minVal", dictRooms[room][attr][1])
						line = line.replace("maxVal", dictRooms[room][attr][2])
						new_fileSensor.write(line)
			numberSensor=nameSensor+str(i)
			if (platform.system() == "Windows"):
				os.system("docker cp sensors/sensor.py %(numberSensor)s:sensor.py"% vars())
			else:
				os.system("sudo docker cp sensors/sensor.py %(numberSensor)s:sensor.py"% vars())
			i=i+1

	subprocess.call(["powershell.exe","rm sensors/sensor.py"])

# See if config files are copied to sensors containers
def run_sensor():

	if (platform.system() == "Windows"):
		process = subprocess.check_output(["powershell.exe", "docker inspect --format='{{.Name}}' $(docker ps -aq --no-trunc) | Select-String -Pattern dockercompose_sensor | %{$_ -replace '/', ''}"], shell=True)
		nameSensor=sorted(process[:-1].split("\n"))[0][:-1]
		isCreated=subprocess.check_output("docker exec %(nameSensor)s [ -e sensor.py ] && echo yes || echo no"% vars(), shell=True).strip()
	else:
		nameSensor=sorted(os.popen("sudo docker inspect --format='{{.Name}}' $(sudo docker ps -aq --no-trunc) | grep sensor | tr -d '/'").read()[:-1].split("\n"))[0]
		isCreated=os.popen("sudo docker exec %(nameSensor)s [ -e sensor.py ] && echo 'yes' || echo 'no'"% vars()).read()[:-1]

	dictRooms=read_data("sensors/sensorsInfo")
	if ( isCreated == 'no' ):
		print('Copying files to sensors...')
		change_sensor(dictRooms,nameSensor[:-1])
	elif ( isCreated == 'yes' ):
		print('Config files have been already copied')
	else:
		print('Error when copying files')
