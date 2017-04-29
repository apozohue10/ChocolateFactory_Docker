Chocolate Factory with Docker
==========

Introducción
---------------
Este proyecto consiste en la implementación a través de Docker de una aplicación basada en la plataforma FIWARE. El código de la aplicación, así como su descripción , se puede encontrar en el siguiente enlace:

https://github.com/dmartr/chocolatefactory

Docker es una plataforma de código abierto, que permite automatizar el despliegue de
aplicaciones a través contenedores. Docker esta incluido como Generic Enabler en la plataforma de FIWARE.

En esencia, con Docker se despliega cada microservicio en un contenedor, el cual
contiene todo lo necesario para ejecutase dicho microservicio. 

Se puede encontrar más información acerca de Docker en el siguiente enlace:

https://docs.docker.com/ 

Descripción
--------------
La arquitectura de la aplicación con los puertos que usa se puede ver en la siguiente imagen:

![enter image description here](https://lh3.googleusercontent.com/j6ynncFLWojmrqzLcaFxokq86ZXsNyZkvtRzQjv3u4KWUmgV74UYNFB4Hy1RH5fSi0rz=s0 "diagrama_general.png")

Hay seis contenedores: Chocolate Factory, IdM, AuthZForce, Pep Proxy, Context Broker y MongoDB. 

La implementación a través de Docker se basa en dos partes:

- La creación de imágenes que sirven de plantilla para desplegar los contenedores.
- La ejecución conjunta de todos los contenedores mediante Docker Compose.

Las imágenes Context Broker, MongoDB y AuthZForce se descargan directamente de Docker-Hub.

- Orion Context Broker - https://hub.docker.com/r/fiware/orion/
- AuthZForce - https://hub.docker.com/r/fiware/authzforce-ce-server/
- MongoDB - [https://hub.docker.com/_/mongo/](https://hub.docker.com/_/mongo/)

Las imágenes de la aplicación, del Pep Proxy y del IdM usados, se encuentran en el siguiente repositorio de DockerHub.

https://hub.docker.com/u/apozohue10/

El código para crear estas tres imágenes se encuentra en la carpeta images. Los ficheros Dockerfile son la base para crear las imágenes. Los ficheros docker-entrypoint.sh y default_provision.py (en el caso del IdM) son ficheros de arranque y configuración de los servicios en los contenedores.

Para el IdM, AuthZForce y MongoDB se crean volúmenes loc cuales permiten guardar de manera persistente ciertos datos como los usuarios, roles, dominios o entidades.

Por último, en la carpeta docker-compose se encuentra un fichero llamado docker-compose.yml a través del cual se descargan las imágenes de los contenedores y los arranca automáticamente.

Requerimientos
-------------------
Para poder ejecutar la aplicación es necesario instalar Docker. Este se puede instalar en Linux, Windows o Mac OS. En los siguientes enlaces se describe como realizar la instalación:

- Ubuntu - https://docs.docker.com/engine/installation/ubuntulinux/
- Windows - https://docs.docker.com/engine/installation/windows/
- Mac OS - https://docs.docker.com/engine/installation/mac/

También es necesario instalar Docker-Compose para orquestar todos los contenedores. En el siguiente enlace se explica como instalar Docker:

https://docs.docker.com/compose/install/

Se recomienda instalar Docker en Ubuntu 16.04, ya que tiene un manejo más sencillo.

Ejecución
---------------------------
Descargar el código de GItHub mediante:

*git clone https://github.com/apozohue10/ChocolateFactory_Docker*

Dentro de la carpeta docker-compose de los archivos descargados de GitHub, se ejecuta la siguiente orden:

*sudo docker-compose up*

Con esto se descargarán las imágenes de los contenedores, se arrancarán los contenedores y se configurarán automáticamente. 
En un navegador y a través de la dirección *localhost:1028* se podrá hacer uso de la aplicación. 

Los usuarios y contraseñas creados por defecto para la aplicación son los siguientes:

Usuario     | Contraseña
--------    | --------
willywonka@test.com | willywonka
oompaloompaC@test.com    | oompaloompaC
oompaloompaT@test.com     | oompaloompaT
oompaloompaI@test.com     | oompaloompaI


Consideraciones
-------------------
Si al parar todos los contenedores arrancados mediante docker-compose se realiza un kill en vez de un stop o si algún contenedor no para de ejecutarse, es probable que no deje volver a arrancarlos. Para solucionar esto se problema, se paran todos los contenedores y se borran mediante el siguiente comando:

*sudo docker-compose down*

El comando anterior tambien borra la red con la que se conectan los contenedores entre si.

Si el problema sigue persistiendo, se deben borrar los volúmenes. 

*sudo docker volume rm vol-idm vol-mongo vol-authzforce*

Si se desea borrar todas las imágenes se puede realizar mediante el siguiente comando:

*sudo docker rmi apozohue10/chocolatefactory apozohue10/idm apozohue10/pepproxy mongo:3.2 fiware/orion fiware/authzforce-ce-server:release-5.4.1*

