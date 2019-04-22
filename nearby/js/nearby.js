mui.plusReady(function(){
mui.init({
	swipeBack: false,
	pullRefresh: {
		container: '#pullrefresh',
		down: {				//下拉刷新
			style:'circle',
			callback: pulldownRefresh
		},
		up: {				//上拉加载
			contentrefresh: '正在加载...',
			callback: pullupRefresh
		}
	}
});
var askList = {
	type:1
}

/**
 * 上拉加载具体业务实现
 */
function pullupRefresh() {
	var askList2 = JSON.parse(JSON.stringify(askList));
	askList2.num = app.num;
	$.ajax({
		type:'POST',
		url:domain+'/api/house.nearby/nearHouse',
		data:askList2,
		timeout:10000,
		success:function(response){
			var data = JSON.parse(response);
			if(data.state == 2){
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);		//已没有数据
				mui.toast('已经是最新了');
				return;
			}
			app.num = data.num;
			for(i=0;i<data.data.length;i++){
				app.showData.push(data.data[i]);
			}
			mui.toast('刷新完成');
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);		//数据更新成功
		},
		error:function(xhr,statusText){
			if(statusText == 'timeout'){
				mui.toast('请求超时');
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
			}else{
				mui.toast('未知错误');
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
			}
		}
	})
}

/**
 * 下拉刷新具体业务实现
 */
function pulldownRefresh() {
	var askList2 = JSON.parse(JSON.stringify(askList));
	askList2.num = app.num;
	askList2.houseId = app.showData[0]==undefined? '' : app.showData[0].houseId;    //当前最新一条的id
	$.ajax({
		type:'POST',
		url:domain+'/api/house.nearby/nearHouse',
		data:askList2,
		timeout:10000,
		success:function(response){
			var data = JSON.parse(response);
			if(data.state == 2){
				mui('#pullrefresh').pullRefresh().endPulldownToRefresh();		//已没有数据
				mui.toast('已经是最新了');
				return;
			}
			app.num = data.num;
			for(i=0;i<data.data.length;i++){
				app.showData.unshift(data.data[i]);
			}
			mui.toast('更新成功');
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();		//数据更新成功
		},
		error:function(xhr,statusText){
			if(statusText == 'timeout'){
				mui.toast('请求超时');
				mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
			}else{
				mui.toast('未知错误');
				mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
			}
		}
	})
}

// 获取列表页数据
function getData(){
	getPosition(function(posi){
		if(posi.status == 'successed'){
			askList.lat = posi.latitude;		//数据库经纬度反放
			askList.lng = posi.longitude;
			$.ajax({
				type:"POST",
				url:domain+'/api/house.nearby/nearHouse',
				data:askList,
				timeout:10000,
				success:function(res){
					var data = JSON.parse(res);
					if(data.state == 2){
						app.showData = [];
						mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
					}else if(data.state == 1){
						app.num = data.num;
						app.showData = data.data;
						if(app.showData.length<=5){
							mui('#pullrefresh').pullRefresh().disablePullupToRefresh();		//小于5条禁用上拉加载
						}else if(app.showData.length>5&&app.showData.length<20){
							mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);		//5到19条显示没有数据了
						}else{
							mui('#pullrefresh').pullRefresh().refresh(true);		//大于20条重置上拉加载
						}
					}
				},
				error:function(xhr,statusText){
					if(statusText == 'timeout'){
						mui.toast('请求超时');
					}else{
						mui.toast('未知错误');
					}
				}
			})
		}else{
			console.log(posi.message);
		}
	});
}

var app = new Vue({
	el: "#app",
	data: {
		domain:domain,
		num:0,
		showData:[]
	},
	mounted:getData,
	methods: {

	},
	updated:function(){
		if(app.showData.length == 0){
			$('.searchnull').show();
		}else{
			$('.searchnull').hide();
		}
	}
	// ,
	// updated:function(){
	// 	var mySwiper = new Swiper('.swiper-container', {
	// 		direction: 'horizontal',
	// 		loop: false,
	// 		autoplay: false,//可选选项，自动滑动
	// 		slidesPerView :'auto'	//设置slider容器能够同时显示的slides数量
	// 		// spaceBetween : 20,	//在slide之间设置距离（单位px)
	// 	});
	// }
})

	$('.nearby-nav .swiper-slide').click(function(event) {
		var index = $(this).attr('data-index');
		askList.type = index;
		getData();
	});


/**
 * @Author      gaojian
 * @DateTime    2018-07-16
 * @version     1.0.0
 * @description 带值跳转到详情
 */
mui(".mui-table-view").on('tap','.li',function(){
	var id = this.getAttribute('data-id');
	var types = this.getAttribute('data-type');
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

/**
 * @Author      gaojian
 * @DateTime    2018-07-16
 * @version     1.0.0
 * @description 当前定位地点
 */

function getPos(){
	getPosition(function(posi){
		if(posi.status == 'successed'){
			var datas = {lng:posi.longitude,lat:posi.latitude};
			$.ajax({
				type:'POST',
				url:domain + "/api/house.nearby/region",
				data:datas,
				timeout:10000,
				success:function(res){
					$('.nearby-address').html(res);
					if($('#refresh').children('svg').hasClass('icon-rotate')){
						$('#refresh').children('svg').removeClass('icon-rotate');
					}
				},
				error:function(){
					$('.nearby-address').html('定位失败,点击重试');
					if($('#refresh').children('svg').hasClass('icon-rotate')){
						$('#refresh').children('svg').removeClass('icon-rotate');
					}
					$('#refresh').hide();
				}
			})
		}else{
			$('.nearby-address').html('定位失败,点击重试');
			if($('#refresh').children('svg').hasClass('icon-rotate')){
				$('#refresh').children('svg').removeClass('icon-rotate');
			}
			$('#refresh').hide();
		}
	})
}
getPos();

//刷新按钮
$('.addressk').click(function(event) {
	$(this).children('.nearby-address').html('正在定位');
	$('#refresh').show();
	//开始刷新动画
	$(this).children('#refresh').children('svg').addClass('icon-rotate');
	getPos();
});

})

