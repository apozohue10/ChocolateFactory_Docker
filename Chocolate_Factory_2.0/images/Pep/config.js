var config = {};

// Used only if https is disabled
config.pep_port = 8070;

// Set this var to undefined if you don't want the server to listen on HTTPS
config.https = {
    enabled: false,
    cert_file: 'cert/cert.crt',
    key_file: 'cert/key.key',
    port: 443
};

config.account_host = 'https://idm:8000';

config.keystone_host = 'idm';
config.keystone_port = 5000;

config.app_host = 'http://chocolatefactory';
config.app_port = '1028';

// Use true if the app server listens in https
config.app_ssl = false;

// Credentials obtained when registering PEP Proxy in Account Portal
config.username = 'pepProxy';
config.password = 'pepProxy';

// in seconds
config.cache_time = 300;

// if enabled PEP checks permissions with AuthZForce GE. 
// only compatible with oauth2 tokens engine
//
// you can use custom policy checks by including programatic scripts 
// in policies folder. An script template is included there
config.azf = {
	enabled: true,
	protocol: 'http',
    host: 'authzforce',
    path: '/authzforce-ce/domains/Gn8mxiWtEeeE9wJCrBEAAg/pdp',
    port: 8080,
    custom_policy: undefined // use undefined to default policy checks (HTTP verb + path).
};

// list of paths that will not check authentication/authorization
// example: ['/public/*', '/static/css/']
config.public_paths = [];

// options: oauth2/keystone
config.tokens_engine = 'oauth2';

config.magic_key = undefined;

module.exports = config;