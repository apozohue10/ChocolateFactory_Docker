import os
import requests
import uuid

from string import Template
from keystoneclient.v3 import client
from xml.etree import ElementTree


def client_keystone():
    keystone_path='./keystone/'
    endpoint = 'http://{ip}:{port}/v3'.format(ip='127.0.0.1',
                                              port='35357')
    keystone = client.Client(
        username='idm',
        password='idm',
        project_name='idm',
        auth_url=endpoint)
    
    return keystone


def get_application_domain(keystone,application):
    """Checks if application has an associated domain in AC. If not, it creates it.
    """

    if not application.extra.has_key('ac_domain'):
        print('Create domain')

        context = {
            'app_id': application.id,
            'app_name': application.name
        }

        file = open('templates/domain.xacml')
        xml = Template(file.read()).substitute(context)
        
        headers = {
            'Accept': 'application/xml',
            'content-type': 'application/xml;charset=UTF-8',
            'X-Auth-Token': 'undefined'
        }

        url = 'http://authzforce:8080/authzforce-ce/domains'


        response = requests.post(
            url,
            data=xml,
            headers=headers,
            verify=False)

        tree = ElementTree.fromstring(response.content)

        domain_id = tree.attrib['href']

        print('Domain created: ' + domain_id)

        application_update = keystone.oauth2.consumers.update( 
            consumer=application.id, 
            redirect_uris=application.redirect_uris,
            scopes=application.scopes,
            ac_domain=domain_id)
        print(application_update)

    print('Authzforce Domain for application ' + application_update.id + ': ' + application_update.extra['ac_domain'])
    return application_update.extra['ac_domain']

def policyset_update(keystone, application):
    """Gets all role's permissions and generates a xacml file to
    update the Access Control.
    """

    app_id = application.id
    policy_id = str(uuid.uuid4())

    role_permissions = obtain_map_permissions(keystone,app_id)

    # Insert values in templates: policy_set, policy and rule
    xml = ""

    context = {
        'app_id': app_id,
        'policy_id': policy_id
    }

    file = open('templates/policy_set.xacml')
    xml = xml + Template(file.read()).substitute(context) + '\n'
    file.close()


    for role_id,permissions in role_permissions.items():
        file1 = open('templates/policy.xacml')
        context = {
            'role_id': role_id,
            'app_id': app_id
        } 
        xml = xml + Template(file1.read()).substitute(context) + '\n'
        for permission in permissions:
            file2 = open('templates/rule.xacml')
            context = {
                'permission_id': permission.id,
                'permission_name': permission.name,
                'permission_resource': permission.resource,
                'permission_action': permission.action,
                'role_id': role_id
            } 
            xml = xml + Template(file2.read()).substitute(context) + '\n'
            file2.close()
        file1.close()
        xml = xml + '</Policy>' + '\n'
    xml = xml + '</PolicySet>'

    # Send request creating policies
    headers = {
        'content-type': 'application/xml',
        'X-Auth-Token': 'undefined'
    }

    domain = get_application_domain(keystone, application)

    url = 'http://authzforce:8080/authzforce-ce/domains/' + domain + '/pap/policies'

    print('Sending request to : ' + url)

    response = requests.post(
        url,
        data=xml,
        headers=headers,
        verify=False)

    print('Response code from the AC GE: ' + str(response.status_code))

    # Insert values in template policy_properties
    file = open('templates/policy_properties.xacml')
    context = {
        'policy_id': policy_id
    }
                
    xml = Template(file.read()).substitute(context)

    # Send request to activate policy
    url = 'http://authzforce:8080/authzforce-ce/domains/' + domain + '/pap/pdp.properties'
    
    print('Activating policy ' + policy_id)
    print('Sending request to : ' + url)

    response = requests.put(
        url,
        data=xml,
        headers=headers,
        verify=False)

    print('Response code from activated policy: ' + str(response.status_code))

def obtain_map_permissions(keystone,applicationId):
    role_permissions = {}
    roles_chocolate = [
        role for role in keystone.fiware_roles.roles.list(
            application_id=applicationId)
        if role.is_internal == False
    ]
# MIRAR LO DE application_id para los permisos que se crean
    for role in roles_chocolate:
        public_permissions = [
            perm for perm in keystone.fiware_roles.permissions.list(
                role=role.id)
            if perm.is_internal == False
        ]
        if public_permissions:
            role_permissions[role.id] = public_permissions

    return role_permissions

# Registrar usuarios
def _register_user(keystone, name, password, activate=True):
    email = name + '@test.com'
    user = keystone.user_registration.users.register_user(
        name=email,
        password=password,
        username=name,
        domain='default')
    if activate:
        user = keystone.user_registration.users.activate_user(
            user=user.id,
            activation_key=user.activation_key)
    return user

def test_data():

    keystone = client_keystone()
    print('---Populate the database with the users and the app---')

    # Register WillyWonka and Oompa Loompa users
    print('Register WillyWonka and Oompa Loompa users')
    users = []
    users.append(_register_user(keystone, 'willywonka', 'willywonka'))
    users.append(_register_user(keystone, 'oompaloompaC', 'oompaloompaC'))
    users.append(_register_user(keystone, 'oompaloompaI', 'oompaloompaI'))
    users.append(_register_user(keystone, 'oompaloompaT', 'oompaloompaT'))
    users.append(_register_user(keystone, 'securityGuard', 'securityGuard'))

    # Create APP 
    print('Create APP')
    ipApp = os.environ['VARIPAPP']
    chocolateFactory_app = keystone.oauth2.consumers.create(
        name='Chocolate Factory',
        description='TFG',
        url='http://'+ipApp+':1028',
        redirect_uris=['http://'+ipApp+':1028/login'],
        scopes=['all_info'],
        client_type='confidential',
        grant_type='authorization_code')

    # print(chocolateFactory_app)
    # domain = get_application_domain(keystone,chocolateFactory_app)
    # print(domain)

    # Register pepProxy user
    print('Register pepProxy user')
    pep_user = keystone.users.create(name='pepProxy', password='pepProxy', domain='default')

    role_service = keystone.roles.create(
        name='service')

    keystone.roles.grant(
        role=role_service,
        user=pep_user,
        domain='default')

    # Create roles for the Chocolate Factory
    print('Create roles for the Chocolate Factory')

    role_factoryOwner = keystone.fiware_roles.roles.create(
        name='Factory Owner',
        application=chocolateFactory_app.id)

    role_chocolateRoom = keystone.fiware_roles.roles.create(
        name='Chocolate Room Oompa Loompa',
        application=chocolateFactory_app.id)

    role_inventingRoom = keystone.fiware_roles.roles.create(
        name='Inventing Room Oompa Loompa',
        application=chocolateFactory_app.id)

    role_televisionRoom = keystone.fiware_roles.roles.create(
        name='Television Room Oompa Loompa',
        application=chocolateFactory_app.id)

    role_securityGuard = keystone.fiware_roles.roles.create(
        name='Security Guard',
        application=chocolateFactory_app.id)

    # Adding permissions to roles

    # Adding permissions to Factory Owner
    print('Create permissions for the Factory Owner')

    perm_app = keystone.fiware_roles.permissions.find(
                name='Manage the application')
    keystone.fiware_roles.permissions.add_to_role(
                    role_factoryOwner, perm_app)


    perm_rol = keystone.fiware_roles.permissions.find(
                name='Manage roles')
    keystone.fiware_roles.permissions.add_to_role(
                    role_factoryOwner, perm_rol)


    perm_auth = keystone.fiware_roles.permissions.find(
                name='Manage Authorizations')
    keystone.fiware_roles.permissions.add_to_role(
                    role_factoryOwner, perm_auth)

    perm_rolassign = keystone.fiware_roles.permissions.find(
                name='Get and assign all internal application roles')
    keystone.fiware_roles.permissions.add_to_role(
                    role_factoryOwner, perm_rolassign)

    perm_pubrolassign = keystone.fiware_roles.permissions.find(
                name='Get and assign all public application roles')
    keystone.fiware_roles.permissions.add_to_role(
                    role_factoryOwner, perm_pubrolassign)

    perm_menu = keystone.fiware_roles.permissions.create(
                name='admin-menu', 
                application=chocolateFactory_app, 
                action= 'GET', 
                resource= 'admin-menu')
    keystone.fiware_roles.permissions.add_to_role(
                    role_factoryOwner, perm_menu)

    perm_map = keystone.fiware_roles.permissions.create(
                name='admin-map', 
                application=chocolateFactory_app, 
                action= 'GET', 
                resource= 'admin-map')
    keystone.fiware_roles.permissions.add_to_role(
                    role_factoryOwner, perm_map)

    perm_rooms = keystone.fiware_roles.permissions.create(
                name='admin-rooms', 
                application=chocolateFactory_app, 
                action= 'GET', 
                resource= 'admin-rooms')
    keystone.fiware_roles.permissions.add_to_role(
                    role_factoryOwner, perm_rooms)


    # Create permissions for Oompa Loompa Chocolate Room
    print('Create permissions for Oompa Loompa Chocolate Room')

    perm_choc = keystone.fiware_roles.permissions.create(
                name='chocolateroom', 
                application=chocolateFactory_app, 
                action= 'GET', 
                resource= 'chocolateroom')
    keystone.fiware_roles.permissions.add_to_role(
                    role_chocolateRoom, perm_choc)

    # Create permissions for Oompa Loompa Inventing Room
    print('Create permissions for Oompa Loompa Inventing Room')

    perm_inv = keystone.fiware_roles.permissions.create(
                name='inventingroom', 
                application=chocolateFactory_app, 
                action= 'GET', 
                resource= 'inventingroom')
    keystone.fiware_roles.permissions.add_to_role(
                    role_inventingRoom, perm_inv)

    # Create permissions for Oompa Loompa Television Room
    print('Create permissions for Oompa Loompa Television Room')

    perm_tv = keystone.fiware_roles.permissions.create(
                name='televisionroom', 
                application=chocolateFactory_app, 
                action= 'GET', 
                resource= 'televisionroom')
    keystone.fiware_roles.permissions.add_to_role(
                    role_televisionRoom, perm_tv)

    # Create permissions for Security Guard
    print('Create permissions for Security Guard')

    keystone.fiware_roles.permissions.add_to_role(
                    role_securityGuard, perm_map)

    # Assign roles to users
    print('Assign roles to users')

    keystone.fiware_roles.roles.add_to_user(
        role=role_factoryOwner.id,
        user=users[0].id,
        application=chocolateFactory_app.id,
        organization=users[0].default_project_id)

    keystone.fiware_roles.roles.add_to_user(
        role=role_chocolateRoom.id,
        user=users[1].id,
        application=chocolateFactory_app.id,
        organization=users[1].default_project_id)

    keystone.fiware_roles.roles.add_to_user(
        role=role_inventingRoom.id,
        user=users[2].id,
        application=chocolateFactory_app.id,
        organization=users[2].default_project_id)

    keystone.fiware_roles.roles.add_to_user(
        role=role_televisionRoom.id,
        user=users[3].id,
        application=chocolateFactory_app.id,
        organization=users[3].default_project_id)

    keystone.fiware_roles.roles.add_to_user(
        role=role_securityGuard.id,
        user=users[4].id,
        application=chocolateFactory_app.id,
        organization=users[4].default_project_id)

    policyset_update(keystone,chocolateFactory_app)

test_data()

