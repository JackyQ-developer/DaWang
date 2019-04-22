// mui.plusReady(function(){
// 	plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
// 	var self = plus.webview.currentWebview();
// 	var user_id = self.user_id;

	// var subHallRoom = [];
	// for (var i = 0; i < subHallRooms.length; i++) {
	// 	subHallRooms[i].style = '';
	// 	subHallRoom.push(subHallRooms[i])
	// }
	// console.log(subHallRoom)
	// 
	
	/**
	 * @Author      JackyQ
	 * @DateTime    2018-07-27
	 * @version     1.0.0
	 * @description 获取数据
	 */
	function getData(){
		$.ajax({
			url: domain + '/api/user.nologin/newsList',
			type: 'POST',
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
			showData:[]
		},
		mounted:getData,
		methods: {
			goto:function(item){
				mui.openWindow({
					url:'../encyDetail/encyDetail.html',
					waiting:{
						autoShow:true
					},
					extras: {
						pid: item.news_id
					}
				});
			}
		}
	})
// })
