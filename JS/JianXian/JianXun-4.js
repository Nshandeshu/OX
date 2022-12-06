// 2022-12-04 10:35
# 简讯订阅 //api.tipsoon.com
# 引用 https://raw.githubusercontent.com/RuCu6/QuanX/main/Rewrites/AppUnlock.conf

hostname=api.tipsoon.com

^https?:\/\/api\.tipsoon\.com\/api\/v1\/user\/info$ url script-response-body https://Nshandeshu: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@raw.githubusercontent.com/Nshandeshu/OX/main/JS/JianXian/JianXun-4.js

var url = $request.url;
var body = $response.body;

if (!body) {
  $done({});
}

// 简讯
if (/^https?:\/\/api\.tipsoon\.com\/api\/v1\/user\/info$/.test(url)) {
  let obj = JSON.parse(body);
  obj.data.is_vip = true;
  obj.data.vip_expire_time = "2040-01-01 23:59:59";
  body = JSON.stringify(obj);
}

$done({ body });
