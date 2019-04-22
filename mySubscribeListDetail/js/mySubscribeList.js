mui.plusReady(function(){
	plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
	var self = plus.webview.currentWebview();
	var pid = self.pid;

	var getData = function(){
		$.ajax({
			url: domain + '/api/user.subscription/sbpDetails',
			type: 'POST',
			data: {
				token: localStorage.token,
				sbp_id: pid
			},
			timeout: 10000,
			success: function(response){
				var data = JSON.parse(response);
				console.log(data.length);
				if(data.length == 0){
					$('.releasenull').show();
				}else{
					$('.releasenull').hide();
				}
				app.subcribeData = data;
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
	};

	var app = new Vue({
		el: "#app",
		data:{
			domain:domain,
			subcribeData:[],
			isshow:false
		},
		mounted:getData,
		methods: {
			goto:function(item){
				mui.openWindow({
					url:'../'+typeArr[item.type].detailsRoute+'/'+typeArr[item.type].detailsRoute+'.html',
					waiting:{
						autoShow:true
					},
					extras: {
						pid: item.houseId
					}
				});
			}
		}
	})
})
