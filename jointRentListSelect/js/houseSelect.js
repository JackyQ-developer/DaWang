var jointRentList = null;
mui.init({
	swipeBack: true,
	beforeback: function(){
		var jointRentList = plus.webview.getWebviewById('jointRentList');
		//关闭遮罩层
		mui.fire(jointRentList,'closeMask');
		//返回true，继续页面关闭逻辑
		return true;
	}
})

var data = {
	bedroom:'',		//卧室
	direction: '',	//朝向
	ask:'',			//出租要求
	identity:''		//房源
};

$('.select-container li').click(function(e) {
	$(this).siblings('li').removeClass('btn-active');
	$(this).addClass('btn-active');

	var type = $(this).parent('ul').attr('data-type');
	switch (type) {
		case 'identity':
			var indexs = $(this).index();
			data.identity = indexs+1;
			break;
		default:
			data[type] = $(this).index();
			break;
	}
});

//scroll插件区域滚动
mui('.mui-scroll-wrapper').scroll({
	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
});

/**
 * @Author      JackyQ
 * @DateTime    2018-06-22
 * @version     1.0.0
 * @description 完成按钮
 */
// var jointRentList = null;
document.getElementById('submit').addEventListener('tap', function (e) {
	var self = plus.webview.currentWebview();
	if(!jointRentList){
		jointRentList = plus.webview.getWebviewById('jointRentList');
	}
	//关闭自己
	plus.webview.hide( self, "slide-out-right" );
	//触发详情页面的newsId事件
	mui.fire(jointRentList,'moreDetails',data);
	//关闭遮罩层
	mui.fire(jointRentList,'closeMask');
});

/**
 * @Author      JackyQ
 * @DateTime    2018-06-22
 * @version     1.0.0
 * @description 重置按钮
 */
document.getElementById('reset').addEventListener('tap', function (e) {
	$('.select-container li').removeClass('btn-active');
	data = {
		bedroom:'',		//卧室
		direction: '',	//朝向
		ask:'',			//出租要求
		identity:''		//房源
	};
});