mui.init({
	preloadPages: [{
		url: '../chat/chat.html',
		id: 'chat'
	}]
});
/**
 * @Author      JackyQ
 * @DateTime    2018-07-02
 * @version     1.0.0
 * @description 搜索按钮事件
 */
// document.getElementById('search').addEventListener('search', function(e){
// 	var title = this.value;		//搜索条件
// 	searchCondition.title = title;
// 	getData();
// })
mui.plusReady(function () {
	/*
	 *	获取列表数据(搜索数据)
	 */
	function getData() {
		$.ajax({
			url: domain + '/api/user.nologin/brokerList',
			type: 'POST',
			timeout: 10000,
			success: function (response) {
				var res = JSON.parse(response);
				app.showData = res.data;
			},
			error: function (xhr, textStatus) {
				if (textStatus == 'timeout') {
					//处理超时的逻辑
					mui.toast('请求超时');
				} else {
					//其他错误的逻辑
					mui.toast('未知错误');
				}
			}
		});
	}

	var app = new Vue({
		el: "#app",
		data: {
			domain: domain,
			showData: []
		},
		mounted: getData,
		methods: {
			goto: function (index) {
				mui.openWindow({
					url: '../brokerDetails/brokerDetails.html',
					id: 'brokerDetails',
					extras: {
						user_id: this.showData[index].user_id
					}
				});
			},
			call: function (index) {
				var mobile = this.showData[index].mobile;
				//登录验证
				if(checkLogins()!=false){
					plus.device.dial(mobile);
				}
			},
			message: function (item) {
				//登录验证
				if(checkLogins()!=false){
					var indexWebview = plus.webview.currentWebview().opener();
					mui.fire(indexWebview, 'chatHistory', {
						user_id: item.user_id
					});

					setTimeout(function () {
						mui.openWindow({
							url: '../chat/chat.html',
							id: 'chat',
							waiting: {
								autoShow: false
							}
						});
					}, 800);
				}
			}
		},
		updated:function(){
			if(app.showData.length == 0){
				$('.searchnull').show();
			}else{
				$('.searchnull').hide();
			}
		}
	});

})
