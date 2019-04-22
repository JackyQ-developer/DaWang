var token = localStorage.token;
var ws = new WebSocket(socketDomain);
var to_user_id = '';
var wsInterval = null;
var i = 0;

var mySwiper;
var weather = new Vue({
	el: '#weather',
	data:{
		weather: [
			{src:'img/fine.png',alt:'晴'},
			{src:'img/haze.jpg',alt:'阴'},
			{src:'img/spit.png',alt:'雨天'},
		],
		temperature: '',
		weatherNotice:''
	},
	mounted:function(){
		//天气组件
		mySwiper = new Swiper ('.swiper-container', {
			effect : 'fade',
			autoHeight: true,
			noSwiping : true,
		});
	}
});

function initWebsocket(){
	ws.onopen = function(){
		if(wsInterval != null){
			clearTimeout(wsInterval);
//			mui.toast('重连成功');
		}
		var login = JSON.stringify({type:'login',token:localStorage.token});
		console.log('连接成功');
		ws.send(login);
	};
	ws.onmessage = function (e){
		var data = JSON.parse(e.data);
		switch(data.type){
			case 'userinfo':
				setDefaultUserInfo(data);
				break;
			case 'login':
				login(data.status);
				break;
			case 'addArea':
				setArea(data);
				break;
			case 'seekArea':
				setseekArea(data);
				break;
			case 'schoolArea':
				setschoolArea(data);
				break;
			case 'weather':
				setWeather(data.weather);
				break;
			case 'ping':
				ws.send(JSON.stringify({type:'pong'}));
				break;
			case 'msg':
				var webview = plus.webview.getWebviewById('chat');
				mui.fire(webview,'msg',data.data);
				break;
			case 'chatList':
				var webview = plus.webview.getWebviewById('../chatList/chatList.html');
				changeSuperIcon(data.data);
				mui.fire(webview,'chatList',data.data);
				break;
			case 'chatHistory':
				var webview = plus.webview.getWebviewById('chat');
				mui.fire(webview,'initChat',data.data);
				break;
			default:
				console.log('你返的什么玩意');
				console.log(JSON.stringify(data,null,4));
				console.log('就是上面这玩意');
				break;
		}
	};
	ws.onclose = function(e){ 
		// 关闭 websocket
//		mui.toast("实时通信异常，正在重连...");
		wsInterval = setTimeout(function(){
			ws = new WebSocket(socketDomain);
			initWebsocket();
		},5000);
	};
	ws.onerror = function(e){ 
// 		mui.toast("实时通信异常，正在重连...");
// 		wsInterval = setInterval(function(){
// 			ws = new WebSocket(socketDomain);
// 			initWebsocket();
// 			console.log('正在重连第'+i+'次');
// 			i++;
// 		},5000);
	};
}
initWebsocket();

/**
 * @Author      JackyQ
 * @DateTime    2018-08-10
 * @version     1.0.0
 * @description 退出登录事件
 */
window.addEventListener('logOut', function (event) {
	localStorage.removeItem('token');
	localStorage.removeItem('avatar');
	localStorage.removeItem('nickname');
	ws.close();
});

/**
 * @Author      JackyQ
 * @DateTime    2018-06-13
 * @version     1.0.0
 * @description 登录回调
 * @param       {status}      status 登录状态
 * @return      {void}             失败删除本地存储
 */
function login(status){
	if(status == false){
		//登录失败，没有此token
		localStorage.clear();
	}else{
		//默认登录成功
		
	}
}

/**
 * @Author      JackyQ
 * @DateTime    2018-06-13
 * @version     1.0.0
 * @description 首次打开APP获取登录用户的信息
 */
function setDefaultUserInfo(userinfo){
	localStorage.avatar = userinfo.avatar;		//头像地址
	localStorage.iden_type = userinfo.iden_type;	//
	localStorage.nickname = userinfo.nickname;
}

/**
 * @Author      JackyQ
 * @DateTime    2018-06-25
 * @version     1.0.0
 * @description 设置地区选择器值
 */
function setArea(data){
	localStorage.area = JSON.stringify(data.area);			//地址选择器值
}

/**
 * @Author      JackyQ
 * @DateTime    2018-08-14
 * @version     1.0.0
 * @description 设置检索地区选择器值
 */
function setseekArea(data){
	localStorage.seekarea = JSON.stringify(data.area);			//检索地址选择器值
}


function setschoolArea(data){
	localStorage.schoolarea = JSON.stringify(data.area);		//检索学区选择器值
}


/**
 * @Author      JackyQ
 * @DateTime    2018-08-15
 * @version     1.0.0
 * @description 设置天气
 */
function setWeather(data){
	localStorage.weather = JSON.stringify(data);
	switch(data.weather)
	{
		case '阴':
			mySwiper.slideTo(1);
			break;
		case '小雨':
			mySwiper.slideTo(2);
			break;
		default:
			mySwiper.slideTo(0);
			break;
	}
	weather.temperature = data.temprature;
	weather.weatherNotice = data.now_icomfort;
}

/**
 * @Author      JackyQ
 * @DateTime    2018-08-09
 * @version     1.0.0
 * @description 接收登录事件
 */
window.addEventListener('login', function (event) {
	var login = JSON.stringify({type:'login',token:localStorage.token});
	ws.send(login);
});

/**
 * @Author      JackyQ
 * @DateTime    2018-08-03
 * @version     1.0.0
 * @description 接收推送消息事件
 */
window.addEventListener('chat', function (event) {
	switch (event.detail.type) {
		case 'text':
			sendText(event.detail);
			break;
		case 'sound':
			sendSound(event.detail);
			break;
		case 'image':
			sendImage(event.detail);
			break;
		default:
			// statements_def
			mui.toast('网络拥堵，请稍候重试');
			break;
	}
});

/**
 * @Author      JackyQ
 * @DateTime    2018-08-03
 * @version     1.0.0
 * @description 发送普通文本消息
 */
function sendText (content) {
	var data = {
		type:'chat',
		token:localStorage.token,
		user_id: to_user_id,
		data:content
	};
	ws.send(JSON.stringify(data));
}

/**
 * @Author      JackyQ
 * @DateTime    2018-08-03
 * @version     1.0.0
 * @description 发送声音消息
 */
function sendSound (content) {
	uploadFile(domain+'/api/chat.upload/sound','sound_tmp',content.content,{token:localStorage.token},function (res) {
		if(res == 'err') return mui.toast('网络拥堵，请稍候重试');
		content.content = JSON.parse(res).name;
		var data = {
			type:'chat',
			token:localStorage.token,
			user_id: to_user_id,
			data:content
		};
		ws.send(JSON.stringify(data));
	});
}

/**
 * @Author      JackyQ
 * @DateTime    2018-08-03
 * @version     1.0.0
 * @description 发送图片消息
 */
function sendImage (content) {
	uploadFile(domain+'/api/chat.upload/image','image_tmp',content.content,{token:localStorage.token},function (res) {
		if(res == 'err') return mui.toast('网络拥堵，请稍候重试');
		content.content = JSON.parse(res).name;
		var data = {
			type:'chat',
			token:localStorage.token,
			user_id: to_user_id,
			data:content
		};
		ws.send(JSON.stringify(data));
	});
}

/**
 * @Author      JackyQ
 * @DateTime    2018-08-07
 * @version     1.0.0
 * @description 接收聊天记录
 */
window.addEventListener('chatHistory', function (event) {
	to_user_id = event.detail.user_id;
	var data = {
		type:'chatHistory',
		token:localStorage.token,
		user_id: event.detail.user_id
	};
	ws.send(JSON.stringify(data));
});

/**
 * @Author      JackyQ
 * @DateTime    2018-08-15
 * @version     1.0.0
 * @description 退出聊天页面事件
 */
window.addEventListener('quitChat', function (event) {
	var data = JSON.stringify({
		type:'quitChat',
		token:localStorage.token,
		user_id: to_user_id
	});
	ws.send(data);
});

function changeSuperIcon(arr){
	var bool = false;		//是否有未读消息状态
	for (var i = 0;i < arr.length;i++) {
		if(arr[i].count != 0) bool = true;
	}
	if(bool == true){
		//存在未读消息
		util.drawSuperIcon();
	}else{
		//不存在未读消息
		util.closeSuperIcon();
	}
}
