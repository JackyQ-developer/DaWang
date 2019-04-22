mui.init({
	  preloadPages:[
	    {
	      url:'../chat/chat.html',
	      id:'chat'
	    }
	  ]
});

/**
 * @Author      JackyQ
 * @DateTime    2018-08-07
 * @version     1.0.0
 * @description 接收推送消息事件
 */
window.addEventListener('chatList', function (event) {
	var chatList = event.detail;
	app.chatList = chatList;
});


var app = new Vue({
	el: "#app",
	data:{
		domain:domain,
		chatList:[]
	},
	methods:{
		gotoChat:function (item) {
			var indexWebview = plus.webview.currentWebview().opener();
			mui.fire(indexWebview,'chatHistory',{user_id:item.user_id});
			
			setTimeout(function(){
				mui.openWindow({
					url:'../chat/chat.html',
					id:'chat',
					waiting:{
						autoShow:false
					}
				});
			},1000);
		},
		gotoNoticeList:function(){
			mui.openWindow({
				url:'../noticeList/noticeList.html',
				id:'noticeList',
				waiting:{
					autoShow:false
				}
			});
		}
	}
});