mui.plusReady(function(){
   	plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
   	var self = plus.webview.currentWebview();
   	var news_id = self.pid;
	
	/**
	 * @Author      JackyQ
	 * @DateTime    2018-07-27
	 * @version     1.0.0
	 * @description 获取数据
	 */
	function getData(){
		$.ajax({
			url: domain + '/api/user.nologin/newsDetails',
			type: 'POST',
			data: {
				news_id: news_id
			},
			timeout: 10000,
			success: function(response){
				var res = JSON.parse(response);
				app.showData = res;
			},
			error: ajaxError
		});
	}

	var app = new Vue({
		el: "#app",
		data:{
			domain:domain,
			showData:''
		},
		mounted:getData,
		methods: {
			
		}
	})
})
