FROM fiware/idm

COPY default_provision.py /opt/idm/deployment/default_provision.py
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod 755 /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]


### Exposed ports
# - Keystone
EXPOSE 5000
# - Horizon 
EXPOSE 8000
