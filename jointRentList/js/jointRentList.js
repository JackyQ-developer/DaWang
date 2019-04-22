var mask = mui.createMask(maskCb);
var searchCondition = {
	num:0
};		//搜索条件
var searchShow = {};
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
			contentnomore:'没有更多数据了',
			callback: pullupRefresh
		}
	},
	preloadPages: [				//预加载
		{
	      url:"../jointRentListSelect/jointRentListSelect.html",
	      id: "jointRentListSelect",
	      styles:{
	      	left: '20%',
	      	right: '0',
	      	width: '80%'
	      },//窗口参数
	      extras:{},//自定义扩展参数
	    }
	]
});

// 开启下拉刷新
function openpullrefresh(){
	plus.webview.currentWebview().setPullToRefresh({
	    support: true,
	    style:'circle'
	}, pulldownRefresh);
}

// 搜索输入关闭所有检索
$('#search').focus(function(){
	apps.showChose = false;
	openpullrefresh();
	$('html,body').removeClass('noscroll');
	mui('#popover2').popover('hide');
	mui('#popover').popover('hide');
	moreSwitch = false;
	plus.webview.hide( 'jointRentListSelect', 'slide-out-right' );
	mask.close();
})

/**
 * @Author      JackyQ
 * @DateTime    2018-07-02
 * @version     1.0.0
 * @description 搜索按钮事件
 */
document.getElementById('search').addEventListener('search', function(e){
	var title = this.value;		//搜索条件
	searchCondition.title = title;
	getData();
})

/**
 * @Author      JackyQ
 * @DateTime    2018-06-22
 * @version     1.0.0
 * @description 监听更多页面返回的参数
 */
window.addEventListener('moreDetails',function(event){
	var data = event.detail;
	for (var i in data) {
		searchCondition[i] = data[i];
	}
	getData();
});

/**
 * @Author      JackyQ
 * @DateTime    2018-06-22
 * @version     1.0.0
 * @description 监听关闭遮罩层
 */
window.addEventListener('closeMask',function(event){
	mask.close();
});

/**
 * @Author      JackyQ
 * @DateTime    2018-06-21
 * @version     1.0.0
 * @description 点击遮罩回调函数
 */
function maskCb() {
	if(moreSwitch == true){
		moreSwitch = false;
		plus.webview.hide( 'jointRentListSelect', 'slide-out-right' );
	}
	$('.iconfont').removeClass('blue-text');
}


//点击返回关闭更多页面
$('#back').click(function(){
	plus.webview.hide( 'jointRentListSelect', 'slide-out-right' );
})


/**
 * webview模式侧滑导航
 */
var moreSwitch = false;
mui.plusReady(function () {
	plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
	document.getElementById('more').addEventListener('tap', function (e) {
		mask.show();
		mui('#popover2').popover('hide');
		mui('#popover').popover('hide');
		apps.showChose = false;
		$('.nearby-nav').children('nav').children('i').removeClass('blue-text');
		plus.webview.show( "jointRentListSelect", "slide-in-right" );
		moreSwitch = true;
	});
});

/**
 * 下拉刷新具体业务实现
 */
function pulldownRefresh() {
	var searchCondition2 = searchCondition;
	searchCondition2.num = app.num;
	searchCondition2.houseId = app.showData[0]==undefined? '' : app.showData[0].houseId;	//下拉刷新可选参数，最新一条的ID
	$.ajax({
		url: domain + '/api/house.show/rentJointRefresh',
		type: 'POST',
		data: searchCondition2,
		timeout: 10000,
		success: function(response){
			var res = JSON.parse(response);
			if(res.state == 2){
				//数据已经是最新时
				mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
				mui.toast('已经是最新了');
				return;
			}
			//更新最新数据
			app.num = res.num;
			for (var i = 0; i < res.data.length; i++) {
				app.showData.unshift(res.data[i]);
			}
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
			mui.toast('刷新完成');
		},
		error: function(xhr,textStatus){
			if(textStatus=='timeout'){
				//处理超时的逻辑
				mui.toast('请求超时');
				mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
			}
			else{
				//其他错误的逻辑
				mui.toast('未知错误');
				mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
			}
		}
	});
}

/**
 * 上拉加载具体业务实现
 */
function pullupRefresh() {
	var searchCondition2 = searchCondition;
	searchCondition2.num = app.num;
	$.ajax({
		url: domain + '/api/house.show/rentJoint',
		type: 'POST',
		data: searchCondition2,
		timeout: 10000,
		success: function(response){
			var res = JSON.parse(response);
			if(res.state == 2){
				//数据已经是最新时
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
				mui.toast('已经是最新了');
				return;
			}
			//更新最新数据
			app.num = res.num;
			for (var i = 0; i < res.data.length; i++) {
				app.showData.push(res.data[i]);
			}
			mui.toast('刷新完成');
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
		},
		error: function(xhr,textStatus){
			if(textStatus=='timeout'){
				//处理超时的逻辑
				mui.toast('请求超时');
				mui('#pullrefresh').pullRefresh().endPulldownToRefresh(false);
			}
			else{
				//其他错误的逻辑
				mui.toast('未知错误');
				mui('#pullrefresh').pullRefresh().endPulldownToRefresh(false);
			}
		}
	});
}

/*
 *	获取列表数据
 */

function getData(){
	searchCondition.num = 0;     //清空num值
	$.ajax({
		url: domain + '/api/house.show/rentJoint',
		type: 'POST',
		data: searchCondition,
		timeout: 10000,
		success: function(response){
			var data = JSON.parse(response);
			app.showData = data.data;
			app.num = data.num;
			if(app.showData.length<=5){
				mui('#pullrefresh').pullRefresh().disablePullupToRefresh();		//小于5条禁用上拉加载
			}else if(app.showData.length>5&&app.showData.length<20){
				mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);		//5到19条显示没有数据了
			}else{
				mui('#pullrefresh').pullRefresh().refresh(true);		//大于20条重置上拉加载
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
}

var app = new Vue({
	el: "#app",
	data: {
		domain:domain,
		num: 0,		//最后一条的ID
		showData: []
	},
	mounted: getData,
	methods: {
		direction: function(index){
			var directionVal = this.showData[index].direction;
			return getgetHouseDirectionByChinese(directionVal);
		}
	},
	updated:function(){
		if(app.showData.length == 0){
			$('.searchnull').show();
		}else{
			$('.searchnull').hide();
		}
	}
})

/**
 * @Author      JackyQ
 * @DateTime    2018-06-15
 * @version     1.0.0
 * @description 带值跳转到详情
 */
mui(".mui-table-view").on('tap','.li',function(){
	var id = this.getAttribute('data-id');
	mui.openWindow({
		url:'../jointRentDetail/jointRentDetail.html',
		waiting:{
			autoShow:false
		},
		extras: {
			pid: id
		}
	})
});

/**
 *  价格选择器下拉
 */
document.getElementById('price').addEventListener('tap', function () {
	var _self = this;
	apps.showChose = false;

	//关闭选择器上拉
	if(areaSwitch == true){
		picker.hide();
		areaSwitch = false;
	}

	mui('#popover2').popover('toggle',this);
	$(this).siblings('nav').children('.iconfont').removeClass('blue-text');
	$(this).children('.iconfont').toggleClass('blue-text');

	//点击遮罩移除选中样式
	$('.mui-backdrop').click(function() {
		$(_self).children('.iconfont').removeClass('blue-text');
	});
});

/**
 *  户型选择器下拉
 */
document.getElementById('room').addEventListener('tap', function () {
	var _self = this;
	apps.showChose = false;

	//关闭选择器上拉
	if(areaSwitch == true){
		picker.hide();
		areaSwitch = false;
	}

	mui('#popover').popover('toggle',this);
	$(this).siblings('nav').children('.iconfont').removeClass('blue-text');
	$(this).children('.iconfont').toggleClass('blue-text');

	//点击遮罩移除选中样式
	$('.mui-backdrop').click(function() {
		$(_self).children('.iconfont').removeClass('blue-text');
	});
});

/**
 *  地区选择器下拉
 */
document.getElementById('area').addEventListener('tap', function () {
	plus.webview.currentWebview().setPullToRefresh({
            support: false
        }, function() {});
	if(!$('#region').hasClass('active') && !$('#studentArea').hasClass('active')){
		$('#region').addClass('active');
		apps.arealist = JSON.parse(localStorage.seekarea);
	}
	$('html,body').addClass('noscroll');
	mui('#popover2').popover('hide');
	mui('#popover').popover('hide');
	moreSwitch = false;
	plus.webview.hide( 'jointRentListSelect', 'slide-out-right' );
	mask.close();
	$(this).siblings('nav').children('.iconfont').removeClass('blue-text');
	$(this).children('.iconfont').toggleClass('blue-text');
});

/**
 *  选择器下拉菜单点击
 */
$('.select-container li').click(function(e) {
	$(this).siblings('li').removeClass('btn-active');
	$(this).addClass('btn-active');

	//清除输入框内值
	$('.input-container input').val('');

	var type = $(this).parent('ul').attr('data-type');

	switch (type) {
		case 'price':
			var price = $(this).attr('data-price').split(',');
			searchCondition.price = price;
			searchShow.price = $(this).html();
			break;
		default:
			searchCondition[type] = $(this).index();
			searchShow[type] = $(this).html();
			break;
	}
});

/**
 *  价格选择器确认按钮
 */
$('#priceConfirm').click(function() {
	getData();
	$('#price').children('span').html(searchShow.price);
	mui('#popover2').popover('hide');
	$('#price').children('.iconfont').removeClass('blue-text');
});

/**
 *  价格选择器清除条件
 */
$('#clearPrice').click(function() {
	delete searchCondition.price;
	delete searchShow.price;
	$('#price').children('span').html('价格');
	$(this).parent().siblings('.select-container').children('ul').children('li').removeClass('btn-active');
	//清除输入框内值
	$('.input-container input').val('');
	getData();
	mui('#popover2').popover('hide');
	$('#price').children('.iconfont').removeClass('blue-text');
});

/**
 *  价格选择器输入框输入
 */
$('.input-container input').bind('input',function (e) {
	if(searchCondition.price){
		delete searchCondition.price;
		$(this).parent().siblings('ul').children('li').removeClass('btn-active');
	}
	if($(this).siblings('input').val() != ''){
		var arr = [];
		var firstChild = $('.input-container input:eq(0)').val();
		var lastChild = $('.input-container input:eq(1)').val();
		arr[0] = firstChild;
		arr[1] = lastChild;
		searchCondition.price = arr;
		searchShow.price = firstChild+'-'+lastChild+'元';
	}
});

/**
 *  户型选择器清除条件
 */
$('#clearRoom').click(function() {
	delete searchCondition.room;
	delete searchShow.room;
	$('#room').children('span').html('户型');
	$(this).parent().siblings('.select-container').children('ul').children('li').removeClass('btn-active');
	getData();
	mui('#popover').popover('hide');
	$('#room').children('.iconfont').removeClass('blue-text');
});

/**
 *  户型选择器确认按钮
 */
$('#roomConfirm').click(function(){
	getData();
	$('#room').children('span').html(searchShow.room);
	mui('#popover').popover('hide');
	$('#room').children('.iconfont').removeClass('blue-text');
});

/**
 *  地区选择器清除条件
 */
$('#clearAreas').click(function() {
	apps.showChose = false;
	apps.showCity = false;
	apps.Province = false;
	apps.City = false;
	delete searchCondition.area_id;
	delete searchCondition.schoolarea_id;
	apps.searchValue = -1;
	apps.searchValueSch = '';
	apps.searchName = '';
	$('#area').children('span').html('区域');
	$('html,body').removeClass('noscroll');
	openpullrefresh();
	$(this).parent().siblings('.area-uls').children('ul').children('li').removeClass('active');
	getData();
	$('#area').children('.iconfont').removeClass('blue-text');
});

/**
 *  地区选择器确认按钮
 */
$('#areasConfirm').click(function(){
	apps.showChose = false;
	searchCondition.area_id = apps.searchValue==-1? '':apps.searchValue;
	searchCondition.schoolarea_id = apps.searchValueSch==-1? '':apps.searchValueSch;
	apps.searchName = apps.searchName==''?'区域':apps.searchName;
	$('#area').children('span').html(apps.searchName);
	$('html,body').removeClass('noscroll');
	openpullrefresh();
	getData();
	$('#area').children('.iconfont').removeClass('blue-text');
});

// 点击任意关闭遮罩
$('.showChose').click(function(){
	apps.showChose = false;
	// delete searchCondition.area_id;
	$('html,body').removeClass('noscroll');
	openpullrefresh();
	$('nav#area').children('i').removeClass('blue-text');
});
