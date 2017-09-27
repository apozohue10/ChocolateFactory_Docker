FROM ubuntu:14.04

MAINTAINER FIWARE Indentity Manager Team. DIT-UPM

ENV HOME=/
ENV IDM_PASS=idm

# Install Ubuntu dependencies
RUN sudo apt-get update && \
    sudo apt-get install -y wget curl python git vim expect && \
    wget https://bootstrap.pypa.io/get-pip.py && \
    sudo python get-pip.py

# Install Ubuntu project dependencies
RUN sudo apt-get install -y python-dev python-virtualenv libssl-dev libffi-dev libjpeg8-dev libxml2-dev libxslt1-dev libsasl2-dev libssl-dev libldap2-dev libffi-dev libsqlite3-dev libmysqlclient-dev python-mysqldb

# Download latest version of the code 
RUN git clone https://github.com/ging/keystone && \
    cd keystone && \
    git checkout tags/keyrock-5.4.0
    
RUN git clone https://github.com/ging/horizon && \
    cd horizon && \
    git checkout tags/keyrock-5.4.1

# Configuring settings files
RUN cp keystone/etc/keystone.conf.sample keystone/etc/keystone.conf 
COPY local_settings.py horizon/openstack_dashboard/local/local_settings.py 
RUN sed -i s/\$\$IDM_PASS/${IDM_PASS}/g horizon/openstack_dashboard/local/local_settings.py

# Install python dependecies
RUN sudo python keystone/tools/install_venv.py && \
    sudo python horizon/tools/install_venv.py

WORKDIR keystone

# Sync database
RUN sudo tools/with_venv.sh bin/keystone-manage db_sync && \
    sudo tools/with_venv.sh bin/keystone-manage db_sync --extension=endpoint_filter && \
    sudo tools/with_venv.sh bin/keystone-manage db_sync --extension=oauth2 && \
    sudo tools/with_venv.sh bin/keystone-manage db_sync --extension=roles && \
    sudo tools/with_venv.sh bin/keystone-manage db_sync --extension=user_registration && \
    sudo tools/with_venv.sh bin/keystone-manage db_sync --extension=two_factor_auth 


# Install requirements
RUN sudo pip install -r requirements.txt

# Prepare to set up idm password
COPY expect_idm_password .
RUN sed -i s/\$\$IDM_PASS/${IDM_PASS}/g expect_idm_password && \
    chmod +x expect_idm_password && \
    sudo ./expect_idm_password

# Mount volumes to grant access from host
VOLUME /keystone/
VOLUME /horizon/

### Exposed ports
# - Keystone
EXPOSE 5000
# - Horizon (HTTP)
EXPOSE 8000

COPY default_provision.py /keystone/default_provision.py
COPY /templates /keystone/templates
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod 755 /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]

