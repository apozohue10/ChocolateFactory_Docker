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

![Architecture](Chocolate_Factory_3.0/diagrams/Current_Architecture.png?raw=true "diagrama_general.png")

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
Se necesita tener instalado en el host las herramientas Docker(1.17) y Docker-compose(1.12), así como tener instalado Python(2.7).
Docker se puede instalar en Linux, Windows o Mac OS. En los siguientes enlaces se describe como realizar la instalación:

- Ubuntu - https://docs.docker.com/engine/installation/ubuntulinux/
- Windows - https://docs.docker.com/engine/installation/windows/
- Mac OS - https://docs.docker.com/engine/installation/mac/

En el siguiente enlace se describe como instalar Docker-compose:

https://docs.docker.com/compose/install/


Ejecución
---------------------------
[1] Descargar el código de GItHub mediante:

*git clone https://github.com/apozohue10/ChocolateFactory_Docker*

[2] Acceder al directorio donde estan los ficheros descargados y se arranca la aplicación:

*cd ChocolateFactory_Docker/Chocolate_Factory_3.0*
*python chocolate_factory.py start*

Con esto se descargarán las imágenes de los contenedores, se arrancarán los contenedores y se configurarán automáticamente. 
[3] En un navegador y a través de la dirección *localhost:1028* se podrá hacer uso de la aplicación. 

[4] Al pulsar el botón de Log In, se accede al portal de IdM. Los usuarios y contraseñas creados por defecto para la aplicación son los siguientes:

Usuario     | Contraseña
--------    | --------
willywonka@test.com | willywonka
oompaloompaC@test.com    | oompaloompaC
oompaloompaT@test.com     | oompaloompaT
oompaloompaI@test.com     | oompaloompaI
securityGuard@test.com     | securityGuard

[5] Una vez accedido, se redirige a una página en función del rol de cada usuario y se presentan los valores de los sensores.

Cuando se accede a través del portal de IDM se quedan almacenadas cookies en el navegador, por lo que para poder acceder mediante otro usuario distinto es necesario cerrar el navegador o borrar las cookies generadas.

Consideraciones
-------------------
Para parar la aplicación se ejecuta el siguiente comando:

*python chocolate_factory.py stop*

Para borrar los contenedores y las redes generadas:

*python chocolate_factory.py remove-containers*

Para borrar los volumenes generados:

*python chocolate_factory.py remove-volumes*

Se pueden ver los logs de todos los contenedores ejecutando:

*python chocolate_factory.py logs*

O ver los logs individuales de cada uno de ellos con:

*python chocolate_factory.py logs nombre_contendor*

Sustituyendo nombre_contenedor por: orion, mongo, idm, pepproxy, authzforce o chocolatefactory.

Si se desea borrar todas las imágenes se puede realizar mediante el siguiente comando:

*sudo docker rmi apozohue10/sensor apozohue10/chocolatefactory apozohue10/idm apozohue10/pepproxy mongo:3.2 fiware/orion fiware/authzforce-ce-server:release-5.4.1*

