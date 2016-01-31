Chocolate Factory with Docker
==========

Introducción
---------------
Este proyecto consiste en la implementación a través de Docker de una aplicación basada en la plataforma FIWARE. El código de la aplicación, así como su descripción , se puede encontrar en el siguiente enlace:

https://github.com/dmartr/chocolatefactory

Docker es una plataforma de código abierto, que permite automatizar el despliegue de
aplicaciones gracias a la tecnología de los contenedores. Docker fue incluida recientemente como Generic Enabler en la plataforma de FIWARE.

En esencia, con Docker se despliega un microservicio en un contenedor, el cual
contiene todo lo necesario para ejecutarse dicho microservicio. Con Docker se alcanza un grado de portabilidad al que no puede llegar la virtualización.

Se puede encontrar más información acerca de Docker en el siguiente enlace:

https://docs.docker.com/ 

Descripción
--------------
La arquitectura de la aplicación con los puertos que usa se puede ver en la siguiente imagen:

![enter image description here](https://lh3.googleusercontent.com/j6ynncFLWojmrqzLcaFxokq86ZXsNyZkvtRzQjv3u4KWUmgV74UYNFB4Hy1RH5fSi0rz=s0 "diagrama_general.png")

Se observa que hay seis contenedores: Chocolate Factory, IdM, AuthZForce, Pep Proxy, Context Broker y MongoDB. 

La implementación a través de Docker se basa en dos partes:

- La creación de imágenes que sirven de plantilla para desplegar los contenedores.
- La ejecución conjunta de todos los contenedores mediante Docker Compose.

Las imágenes Context Broker, MongoDB y AuthZForce se descargan directamente de Docker-Hub.

- Orion Context Broker - https://hub.docker.com/r/fiware/orion/
- AuthZForce - https://hub.docker.com/r/fiware/authzforce/
- MongoDB - [https://hub.docker.com/_/mongo/](https://hub.docker.com/_/mongo/)

Las imágenes de la aplicación, del Pep Proxy y del IdM usados, se encuentran en el siguiente repositorio de DockerHub.

https://hub.docker.com/u/apozohue10/

El código para crear estas tres imágenes se encuentra en la carpeta images. Los ficheros Dockerfile son la base para crear las imágenes. Los ficheros docker-entrypoint.sh y default_provision.py (en el caso del IdM) son ficheros de arranque y configuración de los contenedores escritos en Bash y Python respectivamente.

Para el IdM, AuthZForce y MongoDB se crean una serie de volúmenes que permiten guardar de manera persistente ciertos datos como los usuarios, roles, dominios o entidades.

Por otro lado, en la carpeta Docker-compose se encuentra un fichero llamado docker-compose.yml a través del cual se descargan las imágenes de los contenedores y los arranca automáticamente.

Requerimientos
-------------------
Para poder ejecutar la aplicación es necesario instalar Docker. Este se puede instalar en Linux, Windows o Mac OS. En los siguientes enlaces se describe como realizar la instalación:

- Ubuntu - https://docs.docker.com/engine/installation/ubuntulinux/
- Windows - https://docs.docker.com/engine/installation/windows/
- Mac OS - https://docs.docker.com/engine/installation/mac/

Se ha puesto de ejemplo Ubuntu como SO en base Linux, pero se puede instalar en otros como CentOS o Debian. La instalación en Windows y Mac OS es algo más compleja ya que Docker se instala en una máquina virtual. Para ello se vale de Docker-Machine, Kitematic y Virtual Box.

Por otro lado también es necesario instalar Docker-Compose para orquestar todos los contenedores. En el siguiente enlace se explica como instalar Docker:

https://docs.docker.com/compose/install/

Se recomienda instalar Docker en Ubuntu 14.04, ya que tiene un manejo más sencillo.
Por último se debe instalar git en el sistema. Para ello ejecutamos los siguientes comandos en el terminal de Ubuntu:

*sudo apt-get update*
*sudo apt-get install git*

Ejecución
---------------------------
Para ejecutar la aplicación hay que crear un fichero vació llamado keystone.db dentro de la dirección */data/idm*. De esta manera aunque se borre el contenedor del IdM su base de datos no se perderá, ya que estará almacenada en el host. Este paso es opcional, ya que si solo se quiere probar la aplicación no sería necesario generar este volumen. Si se ha decidido no generar el volumen, en el fichero docker-compose.yml habría que borrar las siguientes líneas:

*volumes:*
     *- /data/idm/keystone.db:/opt/idm/keystone/keystone.db*

Una vez realizado el paso anterior, se descarga el código de GItHub mediante:

*git clone https://github.com/apozohue10/ChocolateFactory_Docker*

Por último y dentro de la carpeta Docker-compose de los archivos descargados de GitHub, se ejecuta la siguiente orden:

*docker-compose up*

Con esto se descargarán las imágenes de los contenedores, se arrancarán los contenedores y se configurarán automáticamente. En un navegador y a través de la dirección *localhost:1028* se podrá hacer uso de la aplicación. Los usuarios y contraseñas creados por defecto para la aplicación son los siguientes:

Usuario     | Contraseña
--------    | --------
willywonka@test.com | willywonka
oompaloompaC@test.com    | oompaloompaC
oompaloompaT@test.com     | oompaloompaT
oompaloompaI@test.com     | oompaloompaI

Si se paran y vuelven a arrancar, las configuraciones ya estan hechas y por tanto el tiempo en que tarda en arrancarse será menor.

Consideraciones
-------------------
Si al parar todos los contenedores arrancados mediante docker-compose se realiza un kill en vez de un stop o si algún contenedor no para de ejecutarse, es probable que no deje volver a arrancarlos. Para solucionar esto se problema, se paran todos los contenedores y se borran mediante los siguiente comandos:

*docker stop $(docker ps -a -q)*

*docker rm $(docker ps -a -q)*

Si el problema sigue persistiendo, se deben borrar los volúmenes. Para ello vaya a la carpeta data en el directorio raiz y borre los directorios mongodb y authzforce.

Si se desea borrar todas las imágenes se puede realizar mediante el siguiente comando:

docker rmi $(docker images -q)

