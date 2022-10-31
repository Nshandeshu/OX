/***********************************

> 应用名称：趣听音乐
> 下载地址：https://apps.apple.com/cn/app/id1640507964
> 变身步骤：进入APP，输入“趣听音乐馆”
> 脚本功能：免输入激活码，自动激活APP，免弹窗
> 脚本作者：Cuttlefish
> 更新时间：2022-10-31

            
[rewrite_local]

# ～ 趣听音乐☆自动激活APP（2022-10-26）@ddgksf2013
^https?:\/\/api\.bspapp\.com\/client$ url script-response-body https://raw.githubusercontent.com/Nshandeshu/OX/main/JS/quting-2.js

[mitm]

hostname=api.bspapp.com

***********************************/




var body = $response.body.replace(/needVerify":true/g, 'needVerify":false').replace(/code":\d+/g, 'code":0');
$done({ body });
