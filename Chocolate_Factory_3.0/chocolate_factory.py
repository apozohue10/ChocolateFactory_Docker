# Interface to start, stop and delete all needed containers to deploy the
# chocolate factory of Willy Wonka.
#
# Author: Alejandro Pozo Huertas
# Project: TFM for ETSIT-UPM

import sys
import os
import subprocess
import requests
import sensors.configSensors as configSensors

# Take arguments from command line
def main():
	if ( len(sys.argv) <= 1):
		print("Invalid input: few arguments. Execute 'python chocolate_factory.py help' for more information")

	elif ( sys.argv[1] == "logs"):
		if (len(sys.argv) == 2):
			os.system("cd docker-compose && sudo docker-compose logs")
		elif (len(sys.argv) == 3):
			container = "dockercompose_"+sys.argv[2]+"_1"
			os.system("sudo docker logs -t %(container)s"% vars())
		else:
			print("Invalid input")

	elif ( sys.argv[1] == "build"):
		if (len(sys.argv) == 3):
			image = sys.argv[2]
			change_factory(image)
		else:
			print("Bad Input: Introduce the name of the container to be changed")

	elif ( sys.argv[1] == "remove-image"):
		if (len(sys.argv) == 4):
			image = sys.argv[2]
			tag = sys.argv[3]
			remove_image(image, tag)
		elif(len(sys.argv) == 3):
			image = sys.argv[2]
			tag = 'none'
			remove_image(image, tag)
		else:
			print("Bad Input: Introduce the name and the version of the image to be deleted or only the name to delete the original image")

	elif ( len(sys.argv) > 2 ):
		print("Invalid input: too much arguments. Execute 'python chocolate_factory.py help' for more information")

	elif ( sys.argv[1] == "help"):
		help="""
		This python script use docker tools to deploy the application of the chocolate factory
		developed with Fiware Generic Enablers. This script allows several options:

		[1] Execute 'python chocolate_factory.py start' to run the application.

		[2] Execute 'python chocolate_factory.py build name' to change images of this containers:
				idm
				proxyusers
				proxysensors
				chocolatefactory
				sensor

		[3] Execute 'python chocolate_factory.py stop' to stop the application.

		[4] Execute 'python chocolate_factory.py factory_images' to see docker images of application.

		[5] Execute 'python chocolate_factory.py remove-containers' to remove containers and networks.

		[6] Execute 'python chocolate_factory.py remove-volumes' to remove volumes.

		[7] Execute 'python chocolate_factory.py remove-image name' to remove the original image (tagged with latest).
			Execute 'python chocolate_factory.py remove-image name tag' to remove image. The image tagged with latest is the original image, so it shouldn't be removed. 
			Name of image can be:
				mongo
				orion
				authzforce
				idm
				proxyusers
				proxysensors
				chocolatefactory
				sensor


		[8] Execute 'python chocolate_factory.py logs' to view logs of all containers.
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
	os.system("cd docker-compose && sudo docker-compose up -d")
	running_containers()

# Change Chocolate Factory
def change_factory(image):
	if (image == "idm") or (image == "proxyusers") or (image == "proxysensors") or (image == "chocolatefactory") or (image == "sensor"):
		print("Change %(image)s"% vars())
		new_version_image_build(image)
	else:
		print("Invalid image name")

# Stop Chocolate Factory
def stop_factory():
	os.system("sudo docker stop $(sudo docker inspect --format='{{.Name}}' $(sudo docker ps -aq --no-trunc) | grep sensor | cut -d '/' -f2)")
	os.system("cd docker-compose && sudo docker-compose stop")

def factory_images():
	os.system("sudo docker images | grep -e apozohue10 -e orion -e mongo -e authzforce")

# Remove containers and networks of chocolate factory
def remove_containers():
	os.system("cd docker-compose && sudo docker-compose down")

# Remove volumes of chocolate factory
def remove_volumes():
	os.system("sudo docker volume rm dockercompose_vol-idm dockercompose_vol-authzforce dockercompose_vol-mongo")

def remove_image(image, version):
	if (version == 'none'):
		if (image == "idm") or (image == "proxyusers") or (image == "proxysensors") or (image == "chocolatefactory") or (image == "sensor"):
			imageName = 'apozohue10/'+image
			os.system("sudo docker rmi %(imageName)s"% vars())
			#print("Original %(image)s image deleted"% vars())
		elif (image == "mongo"):
			imageName = image + '3.2'
			os.system("sudo docker rmi %(imageName)s"% vars())
			#print("Original %(image)s image deleted"% vars()) 
		elif (image == "orion"): 
			imageName = 'fiware/'+image
			os.system("sudo docker rmi %(imageName)s"% vars())
			#print("Original %(image)s image deleted"% vars())
		elif (image == "authzforce"):
			imageName = 'fiware/'+image+'-ce-server:release-5.4.1'
			os.system("sudo docker rmi %(imageName)s"% vars())
			#print("Original %(image)s image deleted"% vars())
		else:
			print('The image does not exist or you cannot delete it with this script')
	else:
		if (image == "idm") or (image == "proxyusers") or (image == "proxysensors") or (image == "chocolatefactory") or (image == "sensor"):
			imageName = 'apozohue10/'+image
			os.system("sudo docker rmi %(imageName)s:%(version)s"% vars())

			# Change version of docker-compose.yml
			new_version_image_remove(image)
			
			#print("%(image)s image with version %(version)s deleted"% vars())
		else:
			print('You cannot delete this tagged image')

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

def new_version_image_remove(image):
	f = open("docker-compose/docker-compose.yml",'r')
	filedata = f.read()
	f.close()

	# Get version of last version configure in docker-compose file
	p1 = subprocess.Popen(["cat", "docker-compose/docker-compose.yml"], stdout=subprocess.PIPE)
	p2 = subprocess.Popen(["grep", "apozohue10/%(image)s"% vars()], stdin=p1.stdout, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
	versionDockerCompose = p2.communicate()[0].split(':')[-1][:-1]

	versionsDockerImage = get_all_versions_images(image)

	if (versionDockerCompose.isdigit() == True):
		if (max(versionsDockerImage) == 0):
			oldVersion = image + ':' + versionDockerCompose
			newdata = filedata.replace("apozohue10/%(oldVersion)s"% vars(), "apozohue10/%(image)s"% vars())
		elif (max(versionsDockerImage) > 0):
			newVersion = image + ':' + str(max(versionsDockerImage))
			oldVersion = image + ':' + versionDockerCompose
			newdata = filedata.replace("apozohue10/%(oldVersion)s"% vars(), "apozohue10/%(newVersion)s"% vars())
	else:
		if (max(versionsDockerImage) > 0):
			newVersion = image + ':' + str(max(versionsDockerImage))
			newdata = filedata.replace("apozohue10/%(image)s"% vars(), "apozohue10/%(newVersion)s"% vars())
		elif (max(versionsDockerImage) == 0):
			newdata = filedata.replace("apozohue10/%(image)s"% vars(), "apozohue10/%(image)s"% vars())

	f = open("docker-compose/docker-compose.yml",'w')
	f.write(newdata)
	f.close()

# Create new image and change docker-compose.yml with the new image
def new_version_image_build(image):

	# Get all versions of image
	versionsDockerImage = get_all_versions_images(image)

	# Get version of last version configure in docker-compose file
	p1 = subprocess.Popen(["cat", "docker-compose/docker-compose.yml"], stdout=subprocess.PIPE)
	p2 = subprocess.Popen(["grep", "apozohue10/%(image)s"% vars()], stdin=p1.stdout, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
	versionDockerCompose = p2.communicate()[0].split(':')[-1][:-1]

	f = open("docker-compose/docker-compose.yml",'r')
	filedata = f.read()
	f.close()

	# Configure docker-compose file using the latest version of image or the latest version configure in docker-compose file
	version = max(versionsDockerImage) + 1
	newVersion = image + ':' + str(version)
	oldVersion = image + ':' + str(version - 1)
	if (versionDockerCompose.isdigit() == False):
		newdata = filedata.replace("apozohue10/%(image)s"% vars(), "apozohue10/%(newVersion)s"% vars())
	elif (version == 1) and (versionDockerCompose.isdigit() == True):
		newdata = filedata.replace("apozohue10/%(image)s:%(versionDockerCompose)s"% vars(), "apozohue10/%(newVersion)s"% vars())
	else:
		newdata = filedata.replace("apozohue10/%(oldVersion)s"% vars(), "apozohue10/%(newVersion)s"% vars())

	# Create new image 
	f = open("docker-compose/docker-compose.yml",'w')
	f.write(newdata)
	f.close()
	if (image == "idm"):
		os.system("cd Docker-Images/IdM && sudo docker build -t apozohue10/%(newVersion)s ."% vars())
	elif (image == "proxyusers"):
		os.system("cd Docker-Images/ProxyApp && sudo docker build -t apozohue10/%(newVersion)s ."% vars())
	elif(image == "proxysensors"):
		os.system("cd Docker-Images/ProxySensors && sudo docker build -t apozohue10/%(newVersion)s ."% vars())
	elif(image == "chocolatefactory"):
		os.system("cd Docker-Images/App && sudo docker build -t apozohue10/%(newVersion)s ."% vars())
	elif(image == "sensor"):
		os.system("cd Docker-Images/Sensor && sudo docker build -t apozohue10/%(newVersion)s ."% vars())

# Get all version of image in an array	
def get_all_versions_images(image):

	p1 = subprocess.Popen(["sudo", "docker", "images"], stdout=subprocess.PIPE)
	p2 = subprocess.Popen(["grep", "apozohue10/%(image)s"% vars()], stdin=p1.stdout, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
	output = ' '.join(p2.communicate()[0].split())

	versionsDockerImage = []
	k = 1
	for i in range (0, len(output.split())/8):
		if (output.split()[k] == 'latest'):
			versionsDockerImage.append(0)
		else:
			versionsDockerImage.append(int(output.split()[k]))
		k = k +8
	return versionsDockerImage


# Run Application
if __name__ == "__main__":
	main()
