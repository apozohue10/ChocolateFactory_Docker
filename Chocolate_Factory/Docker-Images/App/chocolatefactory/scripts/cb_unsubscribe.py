import requests, json
import ConfigParser
import io
import sys

NUM_ARG=len(sys.argv)
print NUM_ARG
if NUM_ARG==2:
	SUB_ID=sys.argv[1] 
else:
	 print 'Usage: python cb_unsubscribe [subscription ID]'
	 print
	 sys.exit(2)

HEADERS = {'content-type': 'application/json','accept': 'application/json'}
CB_URL = "http://localhost:8080"
URL = CB_URL + '/v1/unsubscribeContext'
PAYLOAD = '{"subscriptionId": "'+SUB_ID+'"}'

print "* Unsubscrining from ID "+SUB_ID
print "..."
r = requests.post(URL, data=PAYLOAD, headers=HEADERS)
print
print "* Status Code: "+str(r.status_code)
print "* Response: "
print r.text
print


