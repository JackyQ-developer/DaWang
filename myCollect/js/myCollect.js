mui.plusReady(function(){
	var self = plus.webview.currentWebview();

	/*
	 *	获取列表数据(搜索数据)
	 */
	function getData(){
		$.ajax({
			url: domain + '/api/user.info/houseCollect',
			type: 'POST',
			data: {
				token: localStorage.token
			},
			timeout: 10000,
			success: function(response){
				var data = JSON.parse(response);
				app.showData = data;
			},
			error: function(xhr,textStatus){
				if(textStatus=='timeout'){
					//处理超时的逻辑
					mui.toast('请求超时');
				}
				else{
					//其他错误的逻辑
					mui.toast('未知错误');
				}
			}
		});
	}

	var app = new Vue({
		el: "#app",
		data: {
			domain:domain,
			showData:[]
		},
		mounted: getData,
		methods: {
			//历史记录跳转详情页面
			seeGoTo:function(item){
				var type = typeArr[item.type];
				var route = type.detailsRoute;
				var id = item.houseId;
				mui.openWindow({
					url: '../'+route+'/'+route+'.html',
					id: route,
					waiting:{
						autoShow:false
					},
					extras: {
						pid:id
					}
				});
			},
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
