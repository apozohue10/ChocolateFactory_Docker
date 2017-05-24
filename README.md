Chocolate Factory with Docker
==========

This project implements through Docker an application developed in NodeJS and based on the Fiware platform. The application code can be found in the following link:

https://github.com/dmartr/chocolatefactory

In the following links, you can find more information about docker and the catalogue of fiware:

https://docs.docker.com/ 
https://catalogue.fiware.org/

Description
--------------
The application architecture can be seen in the following image:

![Architecture](Chocolate_Factory_3.0/diagrams/Current_Architecture.png?raw=true "diagrama_general.png")

There are 7 containers: Chocolate Factory, IdM, AuthZForce, Pep Proxy, Context Broker, Sensor y MongoDB. 

Docker-compose download all images and orchestate them automatically. It also scales the sensor container which will update values in the rooms of the Context Broker when the environment is running. Docker-compose also creates two networks, one for connection with sensors and context broker and the other one to conect all componentes between each other to exception of the sensors. Three volume are created for IdM, Authzforce and MongoDB containers.

This elements are created automatically when running the environment:
- Rooms in Context Broker
- Users, roles and permissions in IdM
- Domain and Policies in Authzforce

Process:
- [1] The app redirects to the IDM portal in which the user sign in.
- [2] The user gets an access token.
- [3] The app uses the access token to send a request to obtain a webview permissions to the Pep Proxy.
- [4] Pep proxy send a request to IDM with the access token to obtain information about the user (specifically the role).
- [5] IDM sends information about the user to Pep Proxy.
- [6] Pep Proxy uses the information about the user to send a request to Authzforce in order to check if the user has permissions on an application resource.
- [7] Authzforce responds to Pep Proxy by allowing or denying the use of the resource.
- [8] Pep Proxy responds to the app with an http code (200 or 401) which depends on the authzforce decision.
- [9] The app sends a subscription request to the context broker.
- [10] The Context Croker obtain sensors information from mongo database.
- [11] The Context Broker notify the application with de sensors information.


Context Broker, MongoDB and Authzforce images are downloaded from Dockerhub:

- Orion Context Broker - https://hub.docker.com/r/fiware/orion/
- AuthZForce - https://hub.docker.com/r/fiware/authzforce-ce-server/
- MongoDB - [https://hub.docker.com/_/mongo/](https://hub.docker.com/_/mongo/)

Application, Pep Proxy, IdM and Sensor images are downloaded from this repository in Docker hub:

https://hub.docker.com/u/apozohue10/

Ports use for each container:

Container     | Port
--------    | --------
Chocolate Factory | 1028
Context Broker   | 1026
MongoDB    | 27017
IdM - Horizon  | 8000
IdM - Keystone  | 5000
Pep Proxy    | 8070
Authzforce    | 8080

Information about the generic enablers can be found in the following links:
- Orion Context Broker - https://fiware-orion.readthedocs.io/en/master/
- AuthZForce - http://authzforce-ce-fiware.readthedocs.io/en/release-5.4.1d/index.html
- IdM Keyrcok - http://fiware-idm.readthedocs.io/en/latest/index.html
- Pep Proxy - http://fiware-pep-proxy.readthedocs.io/en/latest/

File structure
--------------
The principal file is chocolate_factory.py which use docker-compose to run and scale the containers. It also calls other python function which will configure sensors using a template once they have been deployed. This function and the templates are stored in the sensors folder.

In Docker-Images we can find:
- App folder which contains: 
    - The dockerfile to create the image.
    - The entrypoint for the container.
    - All the nodejs code of the application inside chocolatefactory folder.
- IdM folder which contains:
    -  The dockerfile to create the image. 
    -  The entrypoint for the container. 
    -  The default_provision.py which creates all users, roles and permissions through keystone API and also creates domains and policies in authzforce.
    -  The local_settings to configure keystone and horizon.
    -  Templates folder which contains de templates to create the domain and policies.
- PepProxy folder which contains:
    - The dockerfile to create the image.
    - The entrypoint for the container.
    - Files with some changes needed that will overwrite the existing ones in the container.
- Sensor folder which contains:
    - The dockerfile to create the image.
    - The entrypoint for the container.

Finally in docker-compose folder you can find the .yml used to orchestate the environment.

Requeriments
-------------------
To run the environment you need to have installed:
- Docker 1.17
- Docker-compose 1.12
- Python 2.7

You can install docker on Linux, Windows o Mac OS:

- Ubuntu - https://docs.docker.com/engine/installation/ubuntulinux/
- Windows - https://docs.docker.com/engine/installation/windows/
- Mac OS - https://docs.docker.com/engine/installation/mac/

To install docker-compose:

https://github.com/docker/compose/releases/tag/1.12.0


Running
---------------------------
[1] Download github code:

*git clone https://github.com/apozohue10/ChocolateFactory_Docker*

[2] Access folder and run the application:

*cd ChocolateFactory_Docker/Chocolate_Factory_3.0*
*python chocolate_factory.py start*

[3] Access *localhost:1028* in a browser.

[4] Click Log in button, which will redirect you to Idm portal. Users and passwords to be used are the following:

User    | Password
--------    | --------
willywonka@test.com | willywonka
oompaloompaC@test.com    | oompaloompaC
oompaloompaT@test.com     | oompaloompaT
oompaloompaI@test.com     | oompaloompaI
securityGuard@test.com     | securityGuard

[5] Once the user has logged in,  it is redirected to a view depending on the role

Users can access this views:

User    | View
--------    | --------
willywonka | admin-menu, admin-rooms and admin-map
oompaloompaC    | chocolateroom
oompaloompaT     | televisionroom
oompaloompaI     | inventingroom
securityGuard     | admin-map

When the user log out from the application does not means to log out from idm. So to access with another user close the browser and open again or delete the cookies related to idm (whose ip is 172.18.0.6).

Other features
-------------------
To stop de application:

*python chocolate_factory.py stop*

To delete containers and networks:

*python chocolate_factory.py remove-containers*

To delete volumes:

*python chocolate_factory.py remove-volumes*

To view all logs:

*python chocolate_factory.py logs*

To view individual logs:

*python chocolate_factory.py logs name_container*

name_container could be: orion, mongo, idm, pepproxy, authzforce o chocolatefactory.

To delete all docker images of the project:

*sudo docker rmi apozohue10/sensor apozohue10/chocolatefactory apozohue10/idm apozohue10/pepproxy mongo:3.2 fiware/orion fiware/authzforce-ce-server:release-5.4.1*

