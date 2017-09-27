import requests, json
import ConfigParser
import io
import sys


HEADERS = {'content-type': 'application/json','accept': 'application/json'}
CB_URL = "http://localhost:8080"
URL = CB_URL + '/v1/updateContext'

ENTITY_ID = ["Chocolate Room", "Television Room", "Inventing Room", "Elevator", "Big hall", "Willy Wonka's office"]
ENTITY_TYPE = ["Room", "Transportation"]
ENTITY_ATTR = ["Temperature", "Pressure", "Occupation"]
ENTITY_ATTR_CR = ["Waterfall speed", "River level"]
ENTITY_ATTR_IR = ["Experimental Chewing Gum size", "Experiments volatility"]
ENTITY_ATTR_TR = ["TVs on", "Power consumed"]
ENTITY_ATTR_EL = "Floor"
ENTITY_ATTR_TYPE = ["integer", "float", "string"]
ENTITY_ATTR_VALUE = [0, 0.0, "xxxx"]

PAYLOAD_CR = '{ \
    "contextElements": [ \
        { \
            "type": '+ENTITY_TYPE[0]', \
            "isPattern": "false",  \
            "id": '+ENTITY_ID[0]+', \
            "attributes": [ \
            { \
                "name": '+ENTITY_ATTR[0]+',  \
                "type": '+ENTITY_ATTR_TYPE[1]+', \
                "value": '+ENTITY_ATTR_VALUE[1]+' \
            }, \
            { \
                "name": '+ENTITY_ATTR[1]+',  \
                "type": '+ENTITY_ATTR_TYPE[0]+', \
                "value": '+ENTITY_ATTR_VALUE[0]+' \
            }, \
            { \
                "name": '+ENTITY_ATTR_CR[0]+',  \
                "type": '+ENTITY_ATTR_TYPE[1]+', \
                "value": '+ENTITY_ATTR_VALUE[1]+' \
            }, \
            { \
                "name": '+ENTITY_ATTR_CR[1]+',  \
                "type": '+ENTITY_ATTR_TYPE[0]+', \
                "value": '+ENTITY_ATTR_VALUE[0]+' \
            }, \
            { \
                "name": '+ENTITY_ATTR[2]+',  \
                "type": '+ENTITY_ATTR_TYPE[0]+', \
                "value": '+ENTITY_ATTR_VALUE[0]+' \
            } \
            ] \
        } \
    ], \
    "updateAction": "APPEND" \
}'


print "* Creating "+ENTITY_ID[0] 
print "..."
r = requests.post(URL, data=PAYLOAD_CR, headers=HEADERS)
print
print "* Status Code: "+str(r.status_code)
print "* Response: "
print r.text
print

PAYLOAD_IR = '{ \
    "contextElements": [ \
        { \
            "type": '+ENTITY_TYPE[0]', \
            "isPattern": "false",  \
            "id": '+ENTITY_ID[1]+', \
            "attributes": [ \
            { \
                "name": '+ENTITY_ATTR[0]+',  \
                "type": '+ENTITY_ATTR_TYPE[1]+', \
                "value": '+ENTITY_ATTR_VALUE[1]+' \
            }, \
            { \
                "name": '+ENTITY_ATTR[1]+',  \
                "type": '+ENTITY_ATTR_TYPE[0]+', \
                "value": '+ENTITY_ATTR_VALUE[0]+' \
            }, \
            { \
                "name": '+ENTITY_ATTR_IR[0]+',  \
                "type": '+ENTITY_ATTR_TYPE[1]+', \
                "value": '+ENTITY_ATTR_VALUE[1]+' \
            }, \
            { \
                "name": '+ENTITY_ATTR_IR[1]+',  \
                "type": '+ENTITY_ATTR_TYPE[2]+', \
                "value": '+ENTITY_ATTR_VALUE[2]+' \
            }, \
            { \
                "name": '+ENTITY_ATTR[2]+',  \
                "type": '+ENTITY_ATTR_TYPE[0]+', \
                "value": '+ENTITY_ATTR_VALUE[0]+' \
            } \
            ] \
        } \
    ], \
    "updateAction": "APPEND" \
}'

print "* Creating "+ENTITY_ID[1] 
print "..."
r = requests.post(URL, data=PAYLOAD_IR, headers=HEADERS)
print
print "* Status Code: "+str(r.status_code)
print "* Response: "
print r.text
print


PAYLOAD_TR = '{ \
    "contextElements": [ \
        { \
            "type": '+ENTITY_TYPE[0]', \
            "isPattern": "false",  \
            "id": '+ENTITY_ID[2]+', \
            "attributes": [ \
            { \
                "name": '+ENTITY_ATTR[0]+',  \
                "type": '+ENTITY_ATTR_TYPE[1]+', \
                "value": '+ENTITY_ATTR_VALUE[1]+' \
            }, \
            { \
                "name": '+ENTITY_ATTR[1]+',  \
                "type": '+ENTITY_ATTR_TYPE[0]+', \
                "value": '+ENTITY_ATTR_VALUE[0]+' \
            }, \
            { \
                "name": '+ENTITY_ATTR_TR[0]+',  \
                "type": '+ENTITY_ATTR_TYPE[0]+', \
                "value": '+ENTITY_ATTR_VALUE[0]+' \
            }, \
            { \
                "name": '+ENTITY_ATTR_TR[1]+',  \
                "type": '+ENTITY_ATTR_TYPE[1]+', \
                "value": '+ENTITY_ATTR_VALUE[1]+' \
            }, \
            { \
                "name": '+ENTITY_ATTR[2]+',  \
                "type": '+ENTITY_ATTR_TYPE[0]+', \
                "value": '+ENTITY_ATTR_VALUE[0]+' \
            } \
            ] \
        } \
    ], \
    "updateAction": "APPEND" \
}'

print "* Creating "+ENTITY_ID[2] 
print "..."
r = requests.post(URL, data=PAYLOAD_TR, headers=HEADERS)
print
print "* Status Code: "+str(r.status_code)
print "* Response: "
print r.text
print

PAYLOAD_EL = '{ \
    "contextElements": [ \
        { \
            "type": '+ENTITY_TYPE[1]', \
            "isPattern": "false",  \
            "id": '+ENTITY_ID[3]+', \
            "attributes": [ \
            { \
                "name": '+ENTITY_ATTR[0]+',  \
                "type": '+ENTITY_ATTR_TYPE[1]+', \
                "value": '+ENTITY_ATTR_VALUE[1]+' \
            }, \
            { \
                "name": '+ENTITY_ATTR[1]+',  \
                "type": '+ENTITY_ATTR_TYPE[0]+', \
                "value": '+ENTITY_ATTR_VALUE[0]+' \
            }, \
            { \
                "name": '+ENTITY_ATTR_EL+',  \
                "type": '+ENTITY_ATTR_TYPE[0]+', \
                "value": '+ENTITY_ATTR_VALUE[0]+' \
            }, \
            { \
                "name": '+ENTITY_ATTR[2]+',  \
                "type": '+ENTITY_ATTR_TYPE[0]+', \
                "value": '+ENTITY_ATTR_VALUE[0]+' \
            } \
            ] \
        } \
    ], \
    "updateAction": "APPEND" \
}'

print "* Creating "+ENTITY_ID[3] 
print "..."
r = requests.post(URL, data=PAYLOAD_EL, headers=HEADERS)
print
print "* Status Code: "+str(r.status_code)
print "* Response: "
print r.text
print

PAYLOAD_BH = '{ \
    "contextElements": [ \
        { \
            "type": '+ENTITY_TYPE[0]', \
            "isPattern": "false",  \
            "id": '+ENTITY_ID[4]+', \
            "attributes": [ \
            { \
                "name": '+ENTITY_ATTR[0]+',  \
                "type": '+ENTITY_ATTR_TYPE[1]+', \
                "value": '+ENTITY_ATTR_VALUE[1]+' \
            }, \
            { \
                "name": '+ENTITY_ATTR[1]+',  \
                "type": '+ENTITY_ATTR_TYPE[0]+', \
                "value": '+ENTITY_ATTR_VALUE[0]+' \
            }, \
            { \
                "name": '+ENTITY_ATTR[2]+',  \
                "type": '+ENTITY_ATTR_TYPE[0]+', \
                "value": '+ENTITY_ATTR_VALUE[0]+' \
            } \
            ] \
        } \
    ], \
    "updateAction": "APPEND" \
}'

print "* Creating "+ENTITY_ID[4] 
print "..."
r = requests.post(URL, data=PAYLOAD_BH, headers=HEADERS)
print
print "* Status Code: "+str(r.status_code)
print "* Response: "
print r.text
print

PAYLOAD_WI = '{ \
    "contextElements": [ \
        { \
            "type": '+ENTITY_TYPE[0]', \
            "isPattern": "false",  \
            "id": '+ENTITY_ID[5]+', \
            "attributes": [ \
            { \
                "name": '+ENTITY_ATTR[0]+',  \
                "type": '+ENTITY_ATTR_TYPE[1]+', \
                "value": '+ENTITY_ATTR_VALUE[1]+' \
            }, \
            { \
                "name": '+ENTITY_ATTR[1]+',  \
                "type": '+ENTITY_ATTR_TYPE[0]+', \
                "value": '+ENTITY_ATTR_VALUE[0]+' \
            }, \
            { \
                "name": '+ENTITY_ATTR[2]+',  \
                "type": '+ENTITY_ATTR_TYPE[0]+', \
                "value": '+ENTITY_ATTR_VALUE[0]+' \
            } \
            ] \
        } \
    ], \
    "updateAction": "APPEND" \
}'

print "* Creating "+ENTITY_ID[5] 
print "..."
r = requests.post(URL, data=PAYLOAD_WI, headers=HEADERS)
print
print "* Status Code: "+str(r.status_code)
print "* Response: "
print r.text
print

