import sys
import os
import sensors.configSensors as configSensors

def main():
	if ( sys.argv[1] == "logs"):
		if (len(sys.argv) == 2):
			os.system("cd docker-compose && sudo docker-compose logs")
		elif (len(sys.argv) == 3):
			container = "dockercompose_"+sys.argv[2]+"_1"
			os.system("sudo docker logs -t %(container)s"% vars())
		else:
			print("Invalid input")
	elif ( len(sys.argv) > 2 ):
		print("Invalid input: too much arguments. Execute 'python chocolate_factory.py help' for more information")
	elif ( len(sys.argv) <= 1):
		print("Invalid input: few arguments. Execute 'python chocolate_factory.py help' for more information")
	elif ( sys.argv[1] == "help"):
		help="""
		This python script use docker tools to deploy the application of the chocolate factory
		developed with Fiware Generic Enablers. This script allows several options:

		[1] Execute 'python chocolate_factory.py start' to run the application.

		[2] Execute 'python chocolate_factory.py stop' to stop the application.

		[3] Execute 'python chocolate_factory.py remove-containers' to remove containers and networks.

		[4] Execute 'python chocolate_factory.py remove-volumes' to remove volumes.

		[5] Execute 'python chocolate_factory.py logs' to view logs of all containers.
		    Execute 'python chocolate_factory.py logs name' to view individual logs of this containers:
				mongo
				orion
				authzforce
				idm
				pepproxy
				chocolatefactory
		"""
		print(help)
	elif ( sys.argv[1] == "start"):
		print("Start Chocolate Factory")
		start_factory()
	elif ( sys.argv[1] == "stop"):
		print("Stop Chocolate Factory")
		stop_factory()
	elif ( sys.argv[1] == "remove-containers"):
		print("Remove containers and networks")
		remove_containers()
	elif ( sys.argv[1] == "remove-volumes"):
		print("Remove persistent volumes")
		remove_volumes()
	else:
		print("Invalid input: execute 'python chocolate_factory.py help' for more information")


def start_factory():
	os.system("cd docker-compose && sudo docker-compose up -d")
	running_containers()

def stop_factory():
	os.system("sudo docker stop $(sudo docker inspect --format='{{.Name}}' $(sudo docker ps -aq --no-trunc) | grep sensor | cut -d '/' -f2)")
	os.system("cd docker-compose && sudo docker-compose stop")

def remove_containers():
	os.system("cd docker-compose && sudo docker-compose down")

def remove_volumes():
	os.system("sudo docker volume rm dockercompose_vol-idm dockercompose_vol-authzforce dockercompose_vol-mongo")

def running_containers():
	listSemaphore=[True,True,True,True,True,True]
	count=0
	while (count < 6):
		if (os.popen("curl --write-out %{http_code} --silent --output /dev/l http://172.18.0.3:27017").read() == "200") and (listSemaphore[0] == True):
			count += 1
			listSemaphore[0] = False
			print ("--MongoDB container is running--")
		elif (os.popen("curl --write-out %{http_code} --silent --output /dev/l http://172.18.0.4:1026/version").read() == "200") and (listSemaphore[1] == True):
			count += 1
			listSemaphore[1] = False
			print ("--Context Broker container is running--")
		elif (os.popen("curl --write-out %{http_code} --silent --output /dev/l http://172.18.0.5:8080").read() == "200") and (listSemaphore[2] == True):
			count += 1
			listSemaphore[2] = False
			print ("--Authzforce container is running--")
		elif (os.popen("curl --write-out %{http_code} --silent --output /dev/l http://172.18.0.6:8000").read() == "200") and (listSemaphore[3] == True):
			count += 1
			listSemaphore[3] = False
			print ("--Idm container is running--")
		elif (os.popen("curl --write-out %{http_code} --silent --output /dev/l http://172.18.0.7:8070").read() == "401") and (listSemaphore[4] == True):
			count += 1
			listSemaphore[4] = False
			print ("--Pep Proxy container is running--")
		elif (os.popen("curl --write-out %{http_code} --silent --output /dev/l http://172.18.0.8:1028").read() == "200") and (listSemaphore[5] == True):
			count += 1
			listSemaphore[5] = False
			print ("--Chocolate Factory container is running--")
			print ("--Scale sensors and run them--")
			os.system("cd docker-compose && sudo docker-compose scale sensor=25")
			configSensors.run_sensor()


if __name__ == "__main__":
	main()
