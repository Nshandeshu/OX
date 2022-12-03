/******************************

脚本功能：简讯——解锁VIP
下载地址：https://is.gd/bs4iRX
软件版本：5.0.1 无暗黑模式，去广告需另加 >>>>>> 墨鱼版本VIP+去广告+暗黑模式：https://github.com/Nshandeshu/OX/blob/main/JS/JianXun2-moyu.js
脚本作者：彭于晏💞
使用声明：此脚本仅供学习与交流，请勿转载与贩卖！⚠️⚠️⚠️

*******************************

[rewrite_local]

^https:\/\/api\.tipsoon\.com\/api\/v1\/user\/info url script-response-body https://raw.githubusercontent.com/Nshandeshu/OX/main/JS/jianxun.js

[mitm] 

hostname = api.tipsoon.com

*******************************/

body = $response.body.replace(/\"is_vip":\w+/g, '\"is_vip":true')

$done({body});
