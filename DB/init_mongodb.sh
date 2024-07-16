#!/bin/bash

# todo insure mongodb is running
# Get-Service -Name MongoDB
# net start MongoDB #as admin

# connction details
# mongosh CONNECTION_STRING
# mongosh mongodb://localhost:27017/CrispyCrumbs
# use CrispyCrumbs

mongoimport --uri=CONNECTION_STRING --collection=CrispyCrumbs --jsonArray --file=CrispyCrumbs.users.json

mongoimport --uri=CONNECTION_STRING --collection=CrispyCrumbs --jsonArray --file=CrispyCrumbs.videos.json