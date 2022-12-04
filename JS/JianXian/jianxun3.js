/*
^https?:\/\/api\.tipsoon\.com\/api\/v1\/user\/info url script-response-body https://Nshandeshu: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@raw.githubusercontent.com/Nshandeshu/OX/main/JS/JianXian/jianxun3.js

hostname=api.tipsoon.com
*/

let obj = JSON.parse($response.body);

obj["data"]["is_vip"] = true,
obj["data"]["vip_expire_time"] = "2030-10-10 00:00:00",

$done({body: JSON.stringify(obj)});
