mui.plusReady(function(){
	//去除滚动条
	plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
	/**
	 * @Author      gaojian
	 * @DateTime    2018-07-16
	 * @version     1.0.0
	 * @description 推荐房源带值跳转到详情
	 */
	mui(".mui-table-view").on('tap','.li',function(){
		var id = this.getAttribute('data-id');
		var types = this.getAttribute('data-type');
		// console.log(id+'------'+types);
		mui.openWindow({
			url:'../'+typeArr[types].detailsRoute+'/'+typeArr[types].detailsRoute+'.html',
			extras: {
				pid: id
			},
			waiting:{
				autoShow:false
			}
		})
	})

})

/**
 * @Author      JackyQ
 * @DateTime    2018-06-28
 * @version     1.0.0
 * @description 获取数据
 */
var getData = function(){
	$.ajax({
		url: domain + '/api/house.show/home',
		type: 'POST',
		data: {
			token: localStorage.token
		},
		timeout: 10000,
		success: function(response){
			var data = JSON.parse(response);
			vm.recommendData = data.data;

			if($('#refresh').children('svg').hasClass('icon-rotate')){
				$('#refresh').children('svg').removeClass('icon-rotate');
			}
			
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

var vm = new Vue({
	el: "#app",
	data: {
		recommendData:[]
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
});

//刷新按钮
$('#refresh').click(function(event) {
	var _self = this;
	
	//开始刷新动画
	$(this).children('svg').addClass('icon-rotate');
	getData();
});

//跳转
//mySwiper.slideTo(2, 1000, false);
//

/**
 * @Author      JackyQ
 * @DateTime    2018-06-28
 * @version     1.0.0
 * @description 图标导航跳转
 */
$('.navigator li').click(function(e) {
	var name = $(this).attr('data-href');
	mui.openWindow({
		url: '../'+name+'/'+name+'.html',
		id: name,
		waiting: {
			autoShow: false
		}
	});
});