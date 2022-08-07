/**erots
id: 62299e3c6ca8d92534b05110
build: 3
source: d162720b68d8448489eef8aef1628666
*/



function getDate() {


  const myDate = new Date();

  const Y = myDate.getFullYear().toString();
  const M = (myDate.getMonth() + 1).toString();
  const D = myDate.getDate().toString();
  const H = myDate.getHours().toString();
  const m = myDate.getMinutes().toString();
  const S = myDate.getSeconds().toString();
  const time = Y + '-' + M + '-' + D + ' ' + H + ':' + m + ':' + S
  return time
}

async function get_page_id_last(app_List, id) {
  let resp = await $http.request({
    method: "GET",
    url: `https://mergeek.com/free/apps?last_id=${id}`,
    timeout: 30,
    header: {
      "X-Requested-With": "XMLHttpRequest",
    },
  })

  if (resp.data.data && resp.data.data.apps != "") {

    for (const i in resp.data.data.apps) {

      app_List.push({


        img: resp.data.data.apps[i].icon,
        id: resp.data.data.apps[i].id,
        url: "https://apps.apple.com/cn/app/hibido-pro-todo-calendar-note/id" + resp.data.data.apps[i].appstore_id,
        link: resp.data.data.apps[i].classifications,
        present_price: resp.data.data.apps[i].present_price,
        app_name: resp.data.data.apps[i].name,

      })
    }





    return app_List

  }

}


var myhead = {
  "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1"
}
async function getApp_id(url) {
  let resp = await $http.request({
    method: "GET",
    url: url,
    timeout: 30,
    header: myhead,
  })
  if (resp.data && resp.data != "") {
    let arr = resp.data.replace(/\n|\s|\r/g, '')
    //console.log(arr)

    let name = arr.match(/<divclass="downloadMenu"><divclass="downloadMenuItem"><ahref="(.*?)"target="_top">跳转<\/a><\/div>/)[1]
    return name
  }
}
async function get_list() {
  let resp = await $http.request({
    method: "GET",
    url: "https://mergeek.com/free/apps",
    timeout: 30,
    header: myhead,
  })
  if (resp.data && resp.data != "") {
    let data = resp.data
    let html = data.replace(/\n|\s|\r/g, '')

    let all_num = data.match(/<p>(.*?)个/)[1]//获取限免数
    all_num = Number(all_num)

    let arr = html.match(/<divclass="svq-article-col"(.*?)<\/div><\/article><\/div>/g)

    var data_list = []
    for (const i in arr) {
      let jj = arr[i].match(/class="meta-category__link">(.*?)<\/a>/)

      if (jj != null) {

        data_list.push({
          img: arr[i].match(/<imgalt=''src='(.*?)'class='avataravatar-60photoavatar-img'/)[1],
          id: arr[i].match(/<divclass="svq-article-col"data-guid="(.*?)"/)[1],
          url: "https://mergeek.com" + await getApp_id('https://mergeek.com/' + arr[i].match(/<divclass="friendlyWrap"><ahref="\/(.*?)"><\/a><\/div>/)[1]),
          link: arr[i].match(/class="meta-category__link">(.*?)<\/a>/)[1],
          present_price: arr[i].match(/>([A-Z]{4})<\/div><\/div><\/div><divclass="friendlyWrap"/)[1],
          app_name: arr[i].match(/data-fancybox="gallery-23"data-caption="(.*?)">/)[1],

        })
      }
    }

    return [data_list, all_num]
  }

}

let Return_list = await get_list()
let app_List = Return_list[0]
let all_num = Return_list[1]
let app_lin_num = app_List.length

while (all_num > app_lin_num) {

  let id = app_List.slice(-1)[0].id
  app_List = await get_page_id_last(app_List, id)
  app_lin_num = app_List.length


}

let hours = new Date().getHours()
//let hours = 4
var APP_img_list = []
//var APP_text_list = []
//all_num = 1
let label = all_num / 4//四组
//console.log(label)

if (label.toString().indexOf(".") == -1) {

  if (hours < label) {

    hours

  } else {

    if (hours % label == 0) {

      hours = label

    } else {

      hours = hours % label

    }

  }
  if (hours == 1) {

    var start = hours - 1
    var end = hours + 3

  } else {

    start = (hours - 1) * 4
    end = (hours - 1) * 4 + 4

  }

} else {//小数的话


  label = Math.ceil(label)

  if (hours < label) {

    hours

  } else {

    if (hours % label == 0) {

      hours = label

    } else {

      hours = hours % label
    }
  }

  if (hours == 1) {

    start = hours - 1

    if (all_num < 4) {

      end = (all_num % 4)

    } else {

      end = hours + 3

    }

  } else {

    start = (hours - 1) * 4

    if (all_num % 4 != 0) {

      if (all_num - start > 4) {

        end = start + 4

      } else {

        end = all_num

      }

    } else {

      end = (hours - 1) * 4 + 4

    }

  }

}

if (end - start == 4) {

  var Width_img = 45
  var Height_img = 5


} else if (end - start == 3) {

  Width_img = 55
  Height_img = 5

} else if (end - start == 2) {

  Width_img = 95
  Height_img = 5

} else if (end - start == 1) {

  Width_img = 180
  Height_img = 5

}

var Width_text = 38
var Height_text = 85

//console.log(label, start, end - 1)
for (let i = start; i < end; i++) {//取四个数据

  APP_img_list.push(
    {
      type: 'zstack',
      props: {

        alignment: $widget.horizontalAlignment.leading,
        frame: {
          width: 78,
          height: 75
        },
        position: $point(Width_img, Height_img),

      },
      views: [

        {
          type: "image",
          props: {
            uri: app_List[i].img,
            resizable: true,
            scaledToFill: true,
            clipped: {
              antialiased: true
            },

            cornerRadius: {
              value: 20,
              style: 2
            },

            frame: {
              width: 78,
              height: 70

            },

            opacity: 1.0,



            link: app_List[i].url,


          },
        },


        {
          type: "text",
          props: {
            text: app_List[i].app_name,
            font: $font("bold", 15),
            color: $color("red"),
            minimumScaleFactor: 0.7,
            lineLimit: 1,
            position: $point(Width_text, Height_text),
          },
        },




      ]

    }
  )

}


await show_ui()

async function show_ui() {

  $widget.setTimeline({


    render: ctx => {

      //$widget.family = 1
      const family = ctx.family;//表示小组件的尺寸，取值从 0 ~ 2 分别表示小、中、大三种布局

      let medium_widget = {

        type: 'zstack',//实现一个层叠布局
        props: {

          alignment: $widget.horizontalAlignment.leading,
          // widgetURL: "jsbox://run?ssh"//点击界面运行
        },
        views: [

          {
            type: "color",
            props: {
              color: $color("red")//地图颜色
            }
          },

          {

            type: "vstack",//实现一个纵向布局空间
            props: {
              alignment: $widget.horizontalAlignment.leading,
              spacing: 5,
            },
            views: [
              {
                type: "hstack",//实现一个横向布局空间
                props: {
                  alignment: $widget.horizontalAlignment.leading,
                  spacing: 0,

                },
                views: [
                  {
                    type: "text",
                    props: {
                      text: `每日限免`,
                      font: $font("bold", 25),
                      color: $color("white"),
                      minimumScaleFactor: 0.5,
                      lineLimit: 1,
                      position: $point(180, 30),
                    },
                  },
                  {
                    type: "text",
                    props: {
                      text: `data:` + all_num + ' [' + (start + 1) + '-' + end + ']',
                      font: $font("semibold", 10),
                      color: $color("red"),
                      minimumScaleFactor: 0.5,
                      lineLimit: 1,
                      opacity: 0.7,
                      position: $point(115, 35),
                    },
                  },
                ]
              },
              {
                type: "hstack",
                props: {
                  alignment: $widget.horizontalAlignment.leading,
                  spacing: 0,
                },
                views: APP_img_list,
              },
            ]
          },
          {
            type: "text",
            props: {
              text: getDate(),
              font: $font("medium", 10),
              color: $color("white"),
              minimumScaleFactor: 0.5,
              lineLimit: 1,
              position: $point(290, 160),
            },
          }
        ]
      }
      return family == 1 ? medium_widget : ""
    }
  })

}

