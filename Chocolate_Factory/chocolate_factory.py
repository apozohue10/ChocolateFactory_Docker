# Interface to start, stop and delete all needed containers to deploy the
# chocolate factory of Willy Wonka.
#
# Group: ING from ETSIT-UPM

import sys
import os
import subprocess
import requests
import sensors.configSensors as configSensors
import platform

# Take arguments from command line
def main():
	if ( len(sys.argv) <= 1):
		print("Invalid input: few arguments. Execute 'python chocolate_factory.py help' for more information")

	elif ( sys.argv[1] == "logs"):
		if (len(sys.argv) == 2):
			if (platform.system() == "Windows"):
				os.system("cd docker-compose && docker-compose logs")
			else:
				os.system("cd docker-compose && sudo docker-compose logs")
		elif (len(sys.argv) == 3):
			container = "dockercompose_"+sys.argv[2]+"_1"
			if (platform.system() == "Windows"):
				os.system("docker logs -t %(container)s"% vars())
			else:
				os.system("sudo docker logs -t %(container)s"% vars())
		else:
			print("Invalid input")

	elif ( len(sys.argv) > 2 ):
		print("Invalid input: too much arguments. Execute 'python chocolate_factory.py help' for more information")

	elif ( sys.argv[1] == "help"):
		help="""
		This python script use docker tools to deploy the application of the chocolate factory
		developed with Fiware Generic Enablers. This script allows several options:

		[1] Execute 'python chocolate_factory.py start' to run the application.

		[2] Execute 'python chocolate_factory.py stop' to stop the application.

		[3] Execute 'python chocolate_factory.py factory_images' to see docker images of application.

		[4] Execute 'python chocolate_factory.py remove-containers' to remove containers and networks.

		[5] Execute 'python chocolate_factory.py remove-volumes' to remove volumes.

		[6] Execute 'python chocolate_factory.py remove-image name' to remove the original image (tagged with latest).

		[7] Execute 'python chocolate_factory.py logs' to view logs of all containers.
		    Execute 'python chocolate_factory.py logs name' to view individual logs of this containers:
				mongo
				orion
				authzforce
				idm
				pepproxy
				pepproxySensors
				chocolatefactory
		"""
		print(help)
	elif ( sys.argv[1] == "start"):
		print("Start Chocolate Factory")
		start_factory()

	elif ( sys.argv[1] == "stop"):
		print("Stop Chocolate Factory")
		stop_factory()

	elif ( sys.argv[1] == "factory_images"):
		print("See images of Chocolate Factory")
		factory_images()

	elif ( sys.argv[1] == "remove-containers"):
		print("Remove containers and networks")
		remove_containers()

	elif ( sys.argv[1] == "remove-volumes"):
		print("Remove persistent volumes")
		remove_volumes()

	else:
		print("Invalid input: execute 'python chocolate_factory.py help' for more information")

# Start Chocolate Factory
def start_factory():
	if (platform.system() == "Windows") or (platform.system() == "Mac OS X"):
		os.system("cd docker-compose && docker-compose up -d"% vars())
		running_containers_windows_mac()
	else:
		os.system("cd docker-compose && sudo docker-compose up -d"% vars())
		running_containers()

# Stop Chocolate Factory
def stop_factory():
	# os.system("sudo docker stop $(sudo docker inspect --format='{{.Name}}' $(sudo docker ps -aq --no-trunc) | grep sensor | cut -d '/' -f2)")
	if (platform.system() == "Windows"):
		os.system("cd docker-compose && docker-compose stop")
	else:
		os.system("cd docker-compose && sudo docker-compose stop")

# Images of Chocolate factory
def factory_images():
	if (platform.system() == "Windows"):
		# Select-String -Pattern apozohue10
		print(subprocess.check_output(["powershell.exe","docker images | Select-String -Pattern apozohue10"])[:-6])
		print(subprocess.check_output(["powershell.exe","docker images | Select-String -Pattern orion"])[:-6])
		print(subprocess.check_output(["powershell.exe","docker images | Select-String -Pattern mongo"])[:-6])
		print(subprocess.check_output(["powershell.exe","docker images | Select-String -Pattern authzforce"])[:-6])
	else:
		os.system("sudo docker images | grep -e apozohue10 -e orion -e mongo -e authzforce")

# Remove containers and networks of chocolate factory
def remove_containers():
	if (platform.system() == "Windows"):
		os.system("cd docker-compose && docker-compose down")
	else:
		os.system("cd docker-compose && sudo docker-compose down")

# Remove volumes of chocolate factory
def remove_volumes():
	if (platform.system() == "Windows"):
		os.system("docker volume rm dockercompose_vol-idm dockercompose_vol-authzforce dockercompose_vol-mongo")
	else:
		os.system("sudo docker volume rm dockercompose_vol-idm dockercompose_vol-authzforce dockercompose_vol-mongo")

# See if containers are running. Scale sensors and configure them, using the configSensors.py function.
def running_containers():
	listSemaphore=[True,True,True,True,True,True, True]
	count=0
	request = requests.Session()
	request.mount('http://', requests.adapters.HTTPAdapter(max_retries=1))
	while (count < 7):
		try:
			if (request.get('http://172.18.0.3:27017').status_code == 200) and (listSemaphore[0] == True):
				count += 1
				listSemaphore[0] = False
				print ("--MongoDB container is running--")
			elif (request.get('http://172.18.0.4:1026/version').status_code == 200) and (listSemaphore[1] == True):
				count += 1
				listSemaphore[1] = False
				print ("--Context Broker container is running--")
			elif (request.get('http://172.18.0.5:8080').status_code == 200) and (listSemaphore[2] == True):
				count += 1
				listSemaphore[2] = False
				print ("--Authzforce container is running--")
			elif (request.get('http://172.18.0.6:8000').status_code == 200) and (listSemaphore[3] == True):
				count += 1
				listSemaphore[3] = False
				print ("--Idm container is running--")
			elif (request.get('http://172.18.0.7:8070').status_code == 401) and (listSemaphore[4] == True):
				count += 1
				listSemaphore[4] = False
				print ("--Pep Proxy App container is running--")
			elif (request.get('http://172.18.1.30:8070').status_code == 401) and (listSemaphore[5] == True):
				count += 1
				listSemaphore[5] = False
				print ("--Pep Proxy Sensors container is running--")
			elif (request.get('http://172.18.0.8:1028').status_code == 200) and (listSemaphore[6] == True):
				count += 1
				listSemaphore[6] = False
				print ("--Chocolate Factory container is running--")
				print ("--Scale sensors and run them--")
				os.system("cd docker-compose && sudo docker-compose scale sensor=25")
				configSensors.run_sensor()
		except requests.exceptions.ConnectionError:
			pass

# See if containers are running in windows. Scale sensors and configure them, using the configSensors.py function.
def running_containers_windows_mac():
	listSemaphore=[True,True,True,True,True,True, True]
	count=0
	request = requests.Session()
	request.mount('http://', requests.adapters.HTTPAdapter(max_retries=1))
	while (count < 7):
		try:
			if (request.get('http://localhost:27017').status_code == 200) and (listSemaphore[0] == True):
				count += 1
				listSemaphore[0] = False
				print ("--MongoDB container is running--")
			elif (request.get('http://localhost:1026/version').status_code == 200) and (listSemaphore[1] == True):
				count += 1
				listSemaphore[1] = False
				print ("--Context Broker container is running--")
			elif (request.get('http://localhost:8080').status_code == 200) and (listSemaphore[2] == True):
				count += 1
				listSemaphore[2] = False
				print ("--Authzforce container is running--")
			elif (request.get('http://localhost:8000').status_code == 200) and (listSemaphore[3] == True):
				count += 1
				listSemaphore[3] = False
				print ("--Idm container is running--")
			elif (request.get('http://localhost:8070').status_code == 401) and (listSemaphore[4] == True):
				count += 1
				listSemaphore[4] = False
				print ("--Pep Proxy App container is running--")
			elif (request.get('http://localhost:8071').status_code == 401) and (listSemaphore[5] == True):
				count += 1
				listSemaphore[5] = False
				print ("--Pep Proxy Sensors container is running--")
			elif (request.get('http://localhost:1028').status_code == 200) and (listSemaphore[6] == True):
				count += 1
				listSemaphore[6] = False
				print ("--Chocolate Factory container is running--")
				print ("--Scale sensors and run them--")
				os.system("cd docker-compose && docker-compose scale sensor=34")
				configSensors.run_sensor()
		except requests.exceptions.ConnectionError:
			pass


# Change data in docker-compose.yml
def changeDockerComposeToWindowsMac():
	f = open("docker-compose/docker-compose.yml",'r')
	filedata = f.read()
	f.close()

	listSemaphore=[False,False]
	with open("docker-compose/docker-compose.yml") as f:
		for line in f:
			if ("idmwindows" in line):
				listSemaphore[0] = True
			elif ("chocolatefactorywindows" in line):
				listSemaphore[1] = True

	if (not listSemaphore[0]) and (not listSemaphore[1]):
		print('Configure windows in docker-compose.yml')
		newdata = filedata.replace("apozohue10/idm", "apozohue10/idmwindows")
		windowsCompose = newdata.replace("apozohue10/chocolatefactory", "apozohue10/chocolatefactorywindows")
		f = open("docker-compose/docker-compose.yml",'w')
		f.write(windowsCompose)
		f.close()
	elif (not listSemaphore[0]) and (listSemaphore[1]):
		print('Configure windows in docker-compose.yml')
		newdata = filedata.replace("apozohue10/idm", "apozohue10/idmwindows")
		# windowsCompose = newdata.replace("apozohue10/chocolatefactory", "apozohue10/chocolatefactorywindows")
		f = open("docker-compose/docker-compose.yml",'w')
		f.write(newdata)
		f.close()
	elif (not listSemaphore[1]) and (listSemaphore[0]):
		print('Configure windows in docker-compose.yml')
		newdata = filedata.replace("apozohue10/chocolatefactory", "apozohue10/chocolatefactorywindows")
		f = open("docker-compose/docker-compose.yml",'w')
		f.write(newdata)
		f.close()
	else:
		print("docker-compose.yml already configured with windows")


# Run Application
if __name__ == "__main__":
	if (platform.system() == "Windows") or (platform.system() == "Mac OS X"):
		changeDockerComposeToWindowsMac()

	main()