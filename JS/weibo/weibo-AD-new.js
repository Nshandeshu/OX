// https://github.com/zmqcherish/proxy-script/blob/main/weibo_main.js
// 2022-12-30 16:05

// 主要的选项配置
const mainConfig = {
  modifyMenus: true, // 编辑上下文菜单
  removeExtendInfo: true, // 删除拓展卡片
  removeFollow: true, // 关注博主
  removeHomeVip: true, // 个人中心的 vip 栏
  removeGood: true, // 微博主好物种草
  removeInterestFriendInTopic: true, // 超话 超话里的好友
  removeInterestTopic: true, // 超话 可能感兴趣的超话 + 好友关注
  removeInterestUser: true, // 用户页 可能感兴趣的人
  removeLvZhou: true, // 绿洲模块
  removeNextVideo: true, // 关闭自动播放下一个视频
  removePinedTrending: true, // 删除热搜列表置顶条目
  removeRelate: true, // 相关推荐
  removeRelateItem: true, // 评论区相关内容
  removeRecommendItem: true, // 评论区推荐内容
  removeRewardItem: true, // 微博详情页打赏模块
  removeSearchWindow: true, // 搜索页滑动窗口 有的不是广告
  removeUnfollowTopic: true, // 超话 未关注的
  removeUnusedPart: true // 超话 乱七八糟没用的部分
};

// 菜单配置
const itemMenusConfig = {
  creator_task: false, // 转发任务
  mblog_menus_custom: false, // 寄微博
  mblog_menus_video_later: false, // 可能是稍后再看 没出现过
  mblog_menus_comment_manager: false, // 评论管理
  mblog_menus_avatar_widget: false, // 头像挂件
  mblog_menus_card_bg: false, // 卡片背景
  mblog_menus_long_picture: true, // 生成长图
  mblog_menus_delete: true, // 删除
  mblog_menus_edit: true, // 编辑
  mblog_menus_edit_history: true, // 编辑记录
  mblog_menus_edit_video: true, // 编辑视频
  mblog_menus_sticking: false, // 置顶
  mblog_menus_open_reward: false, // 赞赏
  mblog_menus_novelty: false, // 新鲜事投稿
  mblog_menus_favorite: false, // 收藏
  mblog_menus_promote: false, // 推广
  mblog_menus_modify_visible: false, // 设置分享范围
  mblog_menus_copy_url: true, // 复制链接
  mblog_menus_follow: false, // 关注
  mblog_menus_video_feedback: false, // 播放反馈
  mblog_menus_shield: true, // 屏蔽
  mblog_menus_report: true, // 投诉
  mblog_menus_apeal: false, // 申诉
  mblog_menus_home: false // 返回首页
};
const modifyCardsUrls = ["/2/cardlist", "/2/video/community_tab", "/2/searchall"];
const modifyStatusesUrls = [
  "/2/groups/timeline",
  "/2/statuses/friends/timeline",
  "/2/statuses/unread_friends_timeline",
  "/2/statuses/unread_hot_timeline"
];
const otherUrls = {
  "/2/checkin/show": "removeCheckin", // 签到任务
  "/2/comments/build_comments": "removeComments", // 微博详情页评论区相关内容
  "/2/container/get_item": "containerHandler", // 列表相关
  "/2/messageflow": "removeMsgAd",
  "/2/page?": "removePage", // 超话签到的按钮 /2/page/button 加?区别
  "/2/profile/container_timeline": "userHandler", // 用户主页
  "/2/profile/me": "removeHome", // 个人页模块
  "/2/search/container_discover": "removeSearch",
  "/2/search/container_timeline": "removeSearch",
  "/2/search/finder": "removeSearchMain",
  "/2/statuses/container_timeline": "removeMainTab", // 新版主页广告
  "/2/statuses/container_timeline_topic": "removeMain", // 新版主页广告
  "/2/statuses/unread_topic_timeline": "topicHandler", // 超话 tab
  "/2/statuses/video_mixtimeline": "nextVideoHandler", // 取消自动播放下一个视频
  "/2/statuses/extend": "itemExtendHandler", // 微博详情页
  "/2/video/tiny_stream_video_list": "nextVideoHandler", // 取消自动播放下一个视频
  "/2/video/remind_info": "removeVideoRemind" // tab2 菜单上的假通知
};

function getModifyMethod(url) {
  for (const s of modifyCardsUrls) {
    if (url.indexOf(s) !== -1) return "removeCards";
  }
  for (const s of modifyStatusesUrls) {
    if (url.indexOf(s) !== -1) return "removeTimeLine";
  }
  for (const [path, method] of Object.entries(otherUrls)) {
    if (url.indexOf(path) !== -1) return method;
  }
  return null;
}

function isAd(data) {
  if (!data) return false;
  if (data.mblogtypename === "广告" || data.mblogtypename === "热推") {
    return true;
  }
  if (data.promotion && data.promotion.type === "ad") return true;
  return false;
}

function removeMain(data) {
  if (!data.items) return data;
  if (data.loadedInfo && data.loadedInfo.headers) delete data.loadedInfo.headers;
  let newItems = [];
  for (let item of data.items) {
    if (item.category === "feed") {
      if (!isAd(item.data)) newItems.push(item);
    } else if (item.category === "group") {
      if (item.items.length > 0 && item.items[0].data?.itemid?.includes("search_input")) {
        item.items = item.items.filter((e) =>
          e?.data?.itemid?.includes("mine_topics") ||
          e?.data?.itemid?.includes("search_input")
        );
        item.items[0].data.hotwords = [{word: "搜索超话", tip: ""}];
        newItems.push(item);
      } else {
        if (item.items.length > 0 && item.items[0].data?.itemid?.includes("top_title")) continue;
        newItems.push(item);
      }
    } else if ([200, 202].indexOf(item.data.card_type) === -1) {
      newItems.push(item);
    }
  }
  data.items = newItems;
  return data;
}

// 新版主页广告
function removeMainTab(data) {
  if (!data.items) return data;
  if (data.loadedInfo && data.loadedInfo.headers) delete data.loadedInfo.headers;
  let newItems = [];
  for (let item of data.items) {
    if (!isAd(item.data)) {
      if (item.category === "feed") {
        newItems.push(item);
      }
    }
  }
  data.items = newItems;
  return data;
}

function topicHandler(data) {
  const cards = data.cards;
  if (!cards) return data;
  if (!mainConfig.removeUnfollowTopic && !mainConfig.removeUnusedPart) {
    return data;
  }
  let newCards = [];
  for (let c of cards) {
    let addFlag = true;
    if (c.mblog) {
      let btns = c.mblog.buttons;
      if (mainConfig.removeUnfollowTopic && btns) {
        if (btns[0].type === "follow") addFlag = false;
      }
    } else {
      if (!mainConfig.removeUnusedPart) continue;
      if (c.itemid === "bottom_mix_activity") {
        addFlag = false;
      } else if (c?.top?.title === "正在活跃") {
        addFlag = false;
      } else if (c.card_type === 200 && c.group) {
        addFlag = false;
      } else {
        let cGroup = c.card_group;
        if (!cGroup) continue;
        let cGroup0 = cGroup[0];
        if (["guess_like_title", "cats_top_title", "chaohua_home_readpost_samecity_title"].indexOf(cGroup0.itemid) !== -1) {
          addFlag = false;
        } else if (cGroup.length > 1) {
          let newCardGroup = [];
          for (let cg of cGroup) {
            if (["chaohua_discovery_banner_1", "bottom_mix_activity"].indexOf(cg.itemid) === -1) {
              newCardGroup.push(cg);
            }
          }
          c.card_group = newCardGroup;
        }
      }
    }
    if (addFlag) newCards.push(c);
  }
  data.cards = newCards;
  return data;
}

function removeSearchMain(data) {
  let channels = data.channelInfo.channels;
  if (!channels) return data;
  for (let channel of channels) {
    let payload = channel.payload;
    if (!payload) continue;
    removeSearch(payload);
  }
  return data;
}

function checkSearchWindow(item) {
  if (!mainConfig.removeSearchWindow) return false;
  if (item.category !== "card") return false;
  return (
    item.data?.itemid === "finder_window" ||
    item.data?.itemid === "more_frame" ||
    item.data?.card_type === 19 ||
    item.data?.card_type === 208 ||
    item.data?.card_type === 217 ||
    item.data?.mblog?.page_info?.actionlog?.source?.includes("ad")
  );
}

// 发现页
function removeSearch(data) {
  if (!data.items) return data;
  let newItems = [];
  for (let item of data.items) {
    if (item.category === "feed") {
      if (!isAd(item.data)) newItems.push(item);
    } else {
      if (!checkSearchWindow(item)) newItems.push(item);
    }
  }
  data.items = newItems;
  // 去除搜索框填充词
  if (data.loadedInfo) {
    data.loadedInfo.searchBarContent = {};
    if (data.loadedInfo.headerBack) {
      data.loadedInfo.headerBack.channelStyleMap = {};
    }
  }
  return data;
}

function removeMsgAd(data) {
  if (!data.messages) return;
  let newMsgs = [];
  for (let msg of data.messages) {
    if (msg.msg_card?.ad_tag) continue;
    newMsgs.push(msg);
  }
  data.messages = newMsgs;
  return data;
}

// 删除热搜列表置顶项目,删除推广项目
function removePage(data) {
  removeCards(data);
  if (mainConfig.removePinedTrending && data.cards && data.cards.length > 0) {
    if (data.cards[0].card_group) {
      data.cards[0].card_group = data.cards[0].card_group.filter((c) =>
        !(
          c?.actionlog?.ext?.includes("ads_word") ||
          c?.itemid?.includes("t:51") ||
          c?.itemid?.includes("ads_word")
        )
      );
    }
  }
  return data;
}

function removeCards(data) {
  if (!data.cards) return;
  let newCards = [];
  for (const card of data.cards) {
    let cardGroup = card.card_group;
    if (cardGroup && cardGroup.length > 0) {
      let newGroup = [];
      for (const group of cardGroup) {
        let cardType = group.card_type;
        if (cardType !== 118) newGroup.push(group);
      }
      card.card_group = newGroup;
      newCards.push(card);
    } else {
      let cardType = card.card_type;
      if ([9, 165].indexOf(cardType) !== -1) {
        if (!isAd(card.mblog)) newCards.push(card);
      } else {
        newCards.push(card);
      }
    }
  }
  data.cards = newCards;
}

function lvZhouHandler(data) {
  if (!mainConfig.removeLvZhou) return;
  if (!data) return;
  let struct = data.common_struct;
  if (!struct) return;
  let newStruct = [];
  for (const s of struct) {
    if (s.name !== "绿洲") newStruct.push(s);
  }
  data.common_struct = newStruct;
}

function removeTimeLine(data) {
  for (const s of ["ad", "advertises", "trends", "headers"]) {
    if (data[s]) delete data[s];
  }
  if (!data.statuses) return;
  let newStatuses = [];
  for (const s of data.statuses) {
    if (!isAd(s)) {
      lvZhouHandler(s);
      if (s.category === "feed") {
        if (s.common_struct) delete s.common_struct;
        newStatuses.push(s);
      }
    }
  }
  data.statuses = newStatuses;
}

function removeHomeVip(data) {
  if (!data.header) return data;
  if (data.header.vipView) {
    data.header.vipView = null;
  }
  return data;
}

// 移除tab2的假通知
function removeVideoRemind(data) {
  data.bubble_dismiss_time = 0;
  data.exist_remind = false;
  data.image_dismiss_time = 0;
  data.image = "";
  data.tag_image_english = "";
  data.tag_image_english_dark = "";
  data.tag_image_normal = "";
  data.tag_image_normal_dark = "";
}

// 微博详情页
function itemExtendHandler(data) {
  if (mainConfig.removeRelate || mainConfig.removeGood) {
    if (data.trend && data.trend.titles) {
      let title = data.trend.titles.title;
      if (mainConfig.removeRelate && title === "相关推荐") {
        delete data.trend;
      } else if (mainConfig.removeGood && title === "博主好物种草") {
        delete data.trend;
      }
    }
  }
  if (mainConfig.removeFollow) {
    if (data.follow_data) data.follow_data = null;
  }
  if (mainConfig.removeRewardItem) {
    if (data.reward_info) data.reward_info = null;
  }
  // 删除拓展卡片
  if (mainConfig.removeExtendInfo) {
    if (data.extend_info) delete data.extend_info;
  }
  // 删除超话新帖和新用户通知
  if (data.page_alerts) data.page_alerts = null;
  // 广告 暂时判断逻辑根据图片  https://h5.sinaimg.cn/upload/1007/25/2018/05/03/timeline_icon_ad_delete.png
  try {
    let picUrl = data.trend.extra_struct.extBtnInfo.btn_picurl;
    if (picUrl.indexOf("timeline_icon_ad_delete") !== -1) delete data.trend;
  } catch (error) {}
  if (mainConfig.modifyMenus && data.custom_action_list) {
    let newActions = [];
    for (const item of data.custom_action_list) {
      let _t = item.type;
      let add = itemMenusConfig[_t];
      if (add === undefined) {
        newActions.push(item);
      } else if (_t === "mblog_menus_copy_url") {
        newActions.unshift(item);
      } else if (add) {
        newActions.push(item);
      }
    }
    data.custom_action_list = newActions;
  }
}

function updateFollowOrder(item) {
  try {
    for (let d of item.items) {
      if (d.itemId === "mainnums_friends") {
        let s = d.click.modules[0].scheme;
        d.click.modules[0].scheme = s.replace("231093_-_selfrecomm", "231093_-_selffollowed");
        return;
      }
    }
  } catch (error) {}
}

function removeHome(data) {
  if (!data.items) return data;
  let newItems = [];
  for (let item of data.items) {
    let itemId = item.itemId;
    if (itemId === "profileme_mine") {
      if (mainConfig.removeHomeVip) item = removeHomeVip(item);
      updateFollowOrder(item);
      newItems.push(item);
    } else if (
      [
        "mine_attent_title",
        "100505_-_meattent_pic",
        "100505_-_newusertask",
        "100505_-_vipkaitong",
        "100505_-_hongbao2022",
        "100505_-_adphoto",
        "100505_-_advideo",
        "2022pk_game_tonglan"
      ].indexOf(itemId) !== -1
    ) {
      continue;
    } else if (itemId.match(/100505_-_meattent_-_\d+/)) {
      continue;
    } else {
      newItems.push(item);
    }
  }
  data.items = newItems;
  return data;
}

// 移除tab1签到
function removeCheckin(data) {
  data.show = 0;
}

// 评论区相关和推荐内容
function removeComments(data) {
  let delType = ["广告"];
  if (mainConfig.removeRelateItem) delType.push("相关内容");
  if (mainConfig.removeRecommendItem) delType.push(...["推荐", "热推"]);
  let items = data.datas || [];
  if (items.length === 0) return;
  let newItems = [];
  for (const item of items) {
    let adType = item.adType || "";
    if (delType.indexOf(adType) === -1) {
      newItems.push(item);
    }
  }
  data.datas = newItems;
}

// 处理感兴趣的超话和超话里的好友
function containerHandler(data) {
  if (mainConfig.removeInterestFriendInTopic) {
    if (data.card_type_name === "超话里的好友") {
      data.card_group = [];
    }
  }
  if (mainConfig.removeInterestTopic && data.itemid) {
    if (data.itemid.indexOf("infeed_may_interest_in") !== -1) {
      data.card_group = [];
    } else if (data.itemid.indexOf("infeed_friends_recommend") !== -1) {
      data.card_group = [];
    }
  }
}

// 可能感兴趣的人
function userHandler(data) {
  data = removeMainTab(data);
  if (!mainConfig.removeInterestUser) return data;
  if (!data.items) return data;
  let newItems = [];
  for (let item of data.items) {
    let isAdd = true;
    if (item.category === "group") {
      try {
        if (item.items[0]["data"]["desc"] === "可能感兴趣的人") isAdd = false;
      } catch (error) {}
    }
    if (isAdd) {
      if (item.data?.common_struct) {
        delete item.data.common_struct;
      }
      newItems.push(item);
    }
  }
  data.items = newItems;
  return data;
}

function nextVideoHandler(data) {
  if (mainConfig.removeNextVideo) {
    data.statuses = [];
    data.tab_list = [];
  }
}

var url = $request.url;
var body = $response.body;
let method = getModifyMethod(url);

if (method) {
  var func = eval(method);
  let data = JSON.parse(body);
  new func(data);
  body = JSON.stringify(data);
}

$done({ body });
