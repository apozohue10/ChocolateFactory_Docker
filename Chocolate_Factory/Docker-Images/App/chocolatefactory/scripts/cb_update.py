import requests, json
import ConfigParser
import io
import sys

NUM_ARG=len(sys.argv)
print NUM_ARG
if NUM_ARG==6:
	ENTITY_TYPE=sys.argv[1]
	ENTITY_ID=sys.argv[2]
	ENTITY_ATR=sys.argv[3]
	ENTITY_ATTR_TYPE=sys.argv[4]
	ENTITY_ATR_VAL=sys.argv[5] 
else:
	 print 'Usage: python cb_update.py [entity type] [entity ID] [attribute] [atribute type] [value]'
	 print
	 sys.exit(2)

HEADERS = {'content-type': 'application/json','accept': 'application/json'}
CB_URL = "http://localhost:8080"
URL = CB_URL + '/v1/updateContext'
PAYLOAD = '{ \
    "contextElements": [ \
        { \
            "type": '+ENTITY_TYPE', \
            "isPattern": "false",  \
            "id": '+ENTITY_ID+', \
            "attributes": [ \
            { \
                "name": '+ENTITY_ATTR+',  \
                "type": '+ENTITY_ATTR_TYPE+', \
                "value": '+ENTITY_ATTR_VALUE+' \
            } \
            ] \
        } \
    ], \
    "updateAction": "APPEND" \
}'

print "* Unsubscrining from ID "+SUB_ID
print "..."
r = requests.post(URL, data=PAYLOAD, headers=HEADERS)
print
print "* Status Code: "+str(r.status_code)
print "* Response: "
print r.text
print