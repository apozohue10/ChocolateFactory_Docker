# Security and IoT management example using FIWARE's GEs: WillyWonka's Chocolate Factory

+ [Introduction](#def-introduction)
+ [Functionalities overview](#def-overview)
+ [Requirements](#def-requirements)
+ [How to build and install](#install)

<a name="def-introduction"></a>
Introduction
============

This project is part of [FIWARE](http://fiware.org). You will find
more information about FIWARE [here](http://catalogue.fiware.org).

-  You will find the source code of the WebApp in GitHub [here](https://github.com/dmartr/chocolatefactory).
-  You will find the virtual image of the WebApp in Docker [here](https://hub.docker.com/r/dmartr/chocolatefactory).

The "Willy Wonka's Chocolate Factory" is a metaphoric implementation of a real IoT and security industrial application. The core application is a web server powered by node.js that connects to various FIWARE components known as Generic Enablers. The implementation is composed by two main modules: the IoT module and the Security module. The Chocolate Factory is composed of four FIWARE Generic Enablers:
  - In the IoT module: Orion context Broker
  - In the security module: Keyrock Identity Management, Wilma PEP Proxy and AuthZforce Authorization PDP. 

The mentioned Generic Enablers are not included in this repository and must be installed and configured by the user in order to make the WebApp work. 

<a name="def-overview"></a>
Functionalities overview
=======================

The Willy Wonka’s Chocolate Factory is a modular web application, which serves as a basic example of how to develop an app using FIWARE GEs. The main purpose of this app is to implement different FIWARE GEs into a horizontal and vertical scalable application. The application should set up a simple environment, easy to install, to help new FIWARE developers get started. 

This application aims to reproduce how the core intelligent software of the factory would be developed in a scenario in which Willy Wonka has decided to implement cyber physical systems (sensors) to control context parameters (temperature, occupation…) in each room of the factory. Willy Wonka also decided to implement a role hierarchy to control permissions and provide more security.  Because of the inaccessibility of real sensor data, the Web App must virtualize sensor data streams in the most realistic way possible, periodically updating the context information.  

The Orion Context Broker GEi manages each room context information and pushes the sensor data, on change, towards the Web App. 

The IdM GEi brings user life-cycle management, Single Sign-On (SSO) and security profiles relied in personal user attributes. 

The Pep Proxy GE in this scenario acts a bit different compared to his normal use. Normally the PEP Proxy would be used to cover an internal REST API offered by the backend of the Web App, redirecting the allowed requests to the resource and blocking the not authorized requests. However, in this case, the Pep Proxy is acting as a mere token validator for the backend router when the frontend asks for a GET verb. The Pep Proxy asks the AuthZForce PDP for the authorization based on the role and permissions assigned to that role in the IdM Keystone database. 

<a name="def-requirements"></a>
Requirements
------------

Node.js and npm must be installed in order to run the core application (represented in this repository). Additionally, you must check the particular requirements in the documentation of each component (Generic Enabler) that composes the application.  

<a name="def-install"></a>
How to Build & Install
======================

To install the WebApp you can clone this repository and install the npm modules ("sudo npm install") or run the Docker image in `here <https://hub.docker.com/r/dmartr/chocolatefactory/>`__  

To build and Install each Generic Enabler you must follow the Installation and Configuration guide in the documentation of each GE: 
  - Orion Context Broker: [Installation guide in CentOS](https://fiware-orion.readthedocs.org/en/develop/admin/install/index.html) [Installation guide using a Docker image](https://fiware-orion.readthedocs.org/en/develop/user/docker/index.html). 
  - Keyrock Identity Management: [Installation guide](https://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/Identity_Management_-_KeyRock_-_Installation_and_Administration_Guide)
  - Wilma PEP Proxy: [Installation guide](http://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/PEP_Proxy_-_Wilma_-_Installation_and_Administration_Guide)
  - AuthZforce Authorization PDP: [Installation guide](https://forge.fiware.org/plugins/mediawiki/wiki/fiware/index.php/Authorization_PDP_-_AuthZForce_-_Installation_and_Administration_Guide_%28R4.2.0%29) 

<a name="def-configuration"></a>
Configuration 
==============

The Node.js WebApp comunicated with the GEs using a REST API. Therefore the ports and urls in which each GE is deployed must be the speficied in the WebApp code.

  - Orion Context Broker: localhost:8080. You must create the entities representing each room and the parameters monitorized. Run "cb_init.py" in the scripts folder to create all the rooms and the attributes. 

  - Keyrock Identity Management: To create the roles and permissions you must enter in the IdM portal (default localhost:8000). The administrator of the application (Willy Wonka) must register the Chocolate Factory as an application in the local instance of the IdM portal. Then the IdM provides the App two unique and permanent credentials: the OAuth Client ID and Client Secret.  This credentials must be included in the WebApp's config file.
 
  -Wilma PEP Proxy & AuthZforce Authentication PDP: A new dominion must be created in the AuthZforce and this dominion must be specified in the WebApp and PEP Proxy configuration files. 

