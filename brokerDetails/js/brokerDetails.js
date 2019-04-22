mui.plusReady(function(){
	var self = plus.webview.currentWebview();
	var user_id = self.user_id;

	/*
	 *	获取列表数据(搜索数据)
	 */
	function getData(){
		$.ajax({
			url: domain + '/api/user.nologin/brokerInfo',
			type: 'POST',
			data: {
				user_id: user_id
			},
			timeout: 10000,
			success: function(response){
				var data = JSON.parse(response);
				for (var i in data) {
					app[i] = data[i]
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
			num: 0,			//最后一条的ID
			RentNum:0,		//租房数
			SecondNum:0,	//二手房数
			fixtureNum:0,	//历史成交数
			aRent:[],		//租房数组
			aSecond:[],		//二手房数组
			micro_img:'',	//经纪人头像
			wechat_img:'',	//二维码
			real_name:'',	//真实姓名
			url:'',			//图片路径
			work_area:'',	//工作区域
			mobile:''
		},
		mounted: getData,
		methods: {
			direction: function(index){
				var directionVal = this.aSecond[index].direction;
				return getgetHouseDirectionByChinese(directionVal);
			},
			//跳转到二手房详情页面
			gotoNdDetails:function(index){
				var id = this.aSecond[index].houseId;
				mui.openWindow({
					url: '../ndHandHouseDetail/ndHandHouseDetail.html',
					id: 'ndHandHouseDetail',
					waiting:{
						autoShow:false
					},
					extras: {
						pid:id
					}
				});
			},
			//跳转到整租详情页面
			gotoWholeRentDetails:function(index){
				var id = this.aRent[index].houseId;
				mui.openWindow({
					url: '../wholeRentDetail/wholeRentDetail.html',
					id: 'wholeRentDetail',
					waiting:{
						autoShow:false
					},
					extras: {
						pid:id
					}
				});
			}
		},
		updated:function(){
			var mySwiper = new Swiper('.swiper-container', {
				autoplay: false,//可选选项，自动滑动
				clickable: true,
				autoHeight:true,
				pagination: {
					el: '.swiper-pagination',
					clickable :true,
					bulletClass : 'brokerDetails-bullet',
					bulletActiveClass: 'brokerDetails-active',
					renderBullet: function (index, className) {
			          switch(index){
			            case 0:text='二手房';break;
			            case 1:text='租房';break;
			          }
			          return '<span class="' + className + '">' + text + '</span>';
			        }
				},
			})
		}
	});

	//给经纪人打电话
	document.getElementById('call').addEventListener('tap', function(){
		plus.device.dial( app.mobile );
	})
})
