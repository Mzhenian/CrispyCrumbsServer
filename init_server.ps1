#! powershell

# check if CrispyCrumbs server already running
$port = 1324
$serverRunning = (Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue) -ne $null

if ($serverRunning) {
    echo "CrispyCrumbs server running"
    return
}

# Clear everything from the CrispyCrumbs database
mongosh CrispyCrumbs --eval "db.dropDatabase()"

# Load data into the CrispyCrumbs database
.\FilesForMongoDB\mongoimport.exe --db CrispyCrumbs --collection users --file .\FilesForMongoDB\CrispyCrumbs.users.json --jsonArray
.\FilesForMongoDB\mongoimport.exe --db CrispyCrumbs --collection videos --file .\FilesForMongoDB\CrispyCrumbs.videos.json --jsonArray

npm install
node server.js