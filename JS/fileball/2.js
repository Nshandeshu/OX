/******************************

脚本功能：fileball+解锁订阅
下载地址：美区——国区
软件版本：1.2.7
脚本作者：彭于晏

已适配新版1.2.8

*******************************


hostname = *.googleapis.com

projects = type=http-response,pattern=^https://firebaseremoteconfig.googleapis.com/v1/projects/filebox-ac299/.*,requires-body=1,max-size=0,script-path=https://Nshandeshu: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@raw.githubusercontent.com/Nshandeshu/OX/main/JS/fileball/1.2.8-JS-yinyong/projects.js

fileball = type=http-response,pattern=^https?:\/\/api\.revenuecat\.com\/v1\/(receipts|subscribers\/\$RCAnonymousID%3A\w{32})$,requires-body=1,max-size=0,script-path=https://Nshandeshu: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@raw.githubusercontent.com/Nshandeshu/OX/main/JS/fileball/1.2.8-JS-yinyong/fileball.js




