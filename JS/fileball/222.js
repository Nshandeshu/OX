hostname = *.googleapis.com

projects = type=http-response,pattern=^https://firebaseremoteconfig.googleapis.com/v1/projects/filebox-ac299/.*,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/Alex0510/Eric/master/surge/Script/projects.js

fileball = type=http-response,pattern=^https?:\/\/api\.revenuecat\.com\/v1\/(receipts|subscribers\/\$RCAnonymousID%3A\w{32})$,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/89996462/Quantumult-X/main/ycdz/fileball.js




