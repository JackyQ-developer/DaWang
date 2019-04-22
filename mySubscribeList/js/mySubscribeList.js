mui.init({
	gestureConfig:{
	   tap: true, //默认为true
	   doubletap: true, //默认为false
	   longtap: true, //默认为false
	   swipe: true, //默认为true
	   drag: true, //默认为true
	   hold:false,//默认为false，不监听
	   release:false//默认为false，不监听
	}
})
mui.plusReady(function(){
	plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
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
			url: domain + '/api/user.subscription/sbpLists',
			type: 'POST',
			data: {
				token: localStorage.token
			},
			timeout: 10000,
			success: function(response){
				var res = JSON.parse(response);
				if(res.length == 0){
					mui.openWindow({
						url:'../mySubscribe/mySubscribe.html',
						id:'mySubscribe',
						waiting: {
							autoShow:false
						}
					})
				}
				app.showData = res;
			},
			error: ajaxError
		});
	}
// 返回刷新
window.addEventListener('refreshData', function (event) {
	getData();
});

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
					url:'../mySubscribeListDetail/mySubscribeListDetail.html',
					waiting:{
						autoShow:false
					},
					extras: {
						pid: item.sbp_id
					}
				});
			}
		}
	})
// 长按弹出删除
mui('#app ul').on('longtap','li',function(){
	var sbp_id = this.getAttribute('data-id');
	nconfirm('确认删除此条订阅吗？',function(index){
		if(index == 0){
			$.ajax({
				type:'POST',
				url:domain+'/api/user.subscription/delete',
				data:{
					token:localStorage.token,
					sbp_id:sbp_id
				},
				success:function(res){
					if(res == 1){
						mui.toast('删除成功');
						getData();
					}
				},
				error:ajaxError
			})
		}
	},{})
})
// 添加订阅
$('#addSubscribe').click(function(){
	mui.openWindow({
		url:'../mySubscribe/mySubscribe.html',
		id:'mySubscribe',
		waiting: {
			autoShow:false
		}
	})
})
})
