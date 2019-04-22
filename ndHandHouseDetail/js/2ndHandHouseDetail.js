mui.init({
	preloadPages: [{
		url: '../chat/chat.html',
		id: 'chat'
	}]
});
mui.plusReady(function(){
	// var map = new plus.maps.Map("map");
	var self = plus.webview.currentWebview();

	/**
	 * @Author      JackyQ
	 * @DateTime    2018-06-26
	 * @version     1.0.0
	 * @description 获取二手房详情数据
	 */
	function getData(){
		var token = localStorage.token == undefined?'':localStorage.token;
		$.ajax({
			url: domain + '/api/house.show/secondPcs',
			type: 'POST',
			data: {
				houseId: self.pid,
				token: token
			},
			timeout: 10000,
			success: function(response){
				var data = JSON.parse(response);
				if(data.collect == 1){
					app.collectStatus = 'iconfont icon-shoucang';
				}
				for(var i in data){
					app.$data[i] = data[i];
				}
			},
			error:ajaxError
		});
	}

	/**
	 * @Author      JackyQ
	 * @DateTime    2018-06-26
	 * @version     1.0.0
	 * @description 收藏
	 * @param       {Object}      _self VUE实例
	 */
	function collect (_self) {
		$.ajax({
			url: _self.domain + '/api/house.show/collectAdd',
			type: 'POST',
			data: {
				token: localStorage.token,
				houseId: self.pid,
				type: 1		//二手房
			},
			timeout: 10000,
			success: function(response){
				if(response == -2){
					//不是登陆状态
					mui.openWindow({
						url: '../login/login.html',
						id: 'login',
						waiting: {
							autoShow:false
						}
					});
					mui.toast('登录已失效，请重新登录');
					return;
				}else if(response == 1){
					console.log('收藏成功');
					//收藏
					_self.collectStatus = 'iconfont icon-shoucang';
				}else{
					mui.toast('未知错误');
				}
			},
			error: function(xhr,textStatus){
				if(textStatus=='timeout'){
					//处理超时的逻辑
					mui.toast('请求超时');
				}
				else{
					//其他错误的逻辑
					alert(textStatus);
					mui.toast('未知错误');
				}
			}
		});
	}

	/**
	 * @Author      JackyQ
	 * @DateTime    2018-06-26
	 * @version     1.0.0
	 * @description 取消收藏
	 * @param       {Object}      _self VUE实例
	 */
	function unCollect (_self) {
		$.ajax({
			url: _self.domain + '/api/house.show/collectDel',
			type: 'POST',
			data: {
				token: localStorage.token,
				houseId: self.pid,
				type: 1		//二手房
			},
			timeout: 10000,
			success: function(response){
				if(response == -2){
					//不是登陆状态
					mui.openWindow({
						url: '../login/login.html',
						id: 'login',
						waiting: {
							autoShow:false
						}
					});
					mui.toast('登录已失效，请重新登录');
					return;
				}else if(response == 1){
					console.log('取消收藏成功');
					//收藏
					_self.collectStatus = 'iconfont icon-guanzhu';
				}else{
					mui.toast('未知错误');
				}
			},
			error: function(xhr,textStatus){
				if(textStatus=='timeout'){
					//处理超时的逻辑
					mui.toast('请求超时');
				}
				else{
					//其他错误的逻辑
					alert(textStatus);
					mui.toast('未知错误');
				}
			}
		});
	}

	var app = new Vue({
		el: "#app",
		data: {
			domain: domain,
			userInfo:{},
			area:'',
			decorate:'',
			describe:'',
			direction:'',
			elevator:0,
			floor:'',
			genre:'',
			guard:0,
			hall:0,
			img:[],
			local:[],
			name:'',
			price:'',
			longAndLat:{},
			right:'',
			room:0,
			sameType:[],
			state:0,
			title:'',
			total:'',
			unit:0,
			age:0,
			collectStatus:'iconfont icon-guanzhu',
			collect:2,
			identity:''
		},
		methods: {
			collectFunc: function (e) {
				var _self = this;
				if(checkLogin == false) return;
				//收藏
				if(_self.collectStatus == 'iconfont icon-guanzhu'){
					collect(_self);
				}else{
					unCollect(_self);
					//取消收藏
					_self.collectStatus = 'iconfont icon-guanzhu';
				}
			},
			call:function (argument) {
				var _self = this;
				if(checkLogins() == false) return;
				$.ajax({
					url: _self.domain + '/api/house.show/secondMobile',
					type: 'POST',
					data: {
						token: localStorage.token,
						houseId: self.pid
					},
					timeout: 10000,
					success: function(response){
						if(response == -2){
							//不是登陆状态
							mui.openWindow({
								url: '../login/login.html',
								id: 'login',
								waiting: {
									autoShow:false
								},
								show: {
									aniShow: 'fade-in'
								}
							});
							mui.toast('登录已失效，请重新登录');
							return;
						}else{
							plus.device.dial( response );
						}
					},
					error: ajaxError
				});
			},
			brokerDetail:function(user_id){
				mui.openWindow({
					url:'../brokerDetails/brokerDetails.html',
					id:'brokerDetails',
					extras: {
						user_id: user_id
					},
					waiting: {
						autoShow: false
					}
				})
			},
			areaDetance:function(area_id){
				mui.openWindow({
						url: '../villageDetail/villageDetail.html',
						id: 'villageDetail',
						extras: {
							pid: area_id
						},
						waiting: {
							autoShow: false
						}
					});
			},
			message: function (item) {
				//登录验证
				if(checkLogins() == false) return;
				var indexWebview = plus.webview.getLaunchWebview();
				mui.fire(indexWebview, 'chatHistory', {
					user_id: item
				});

				setTimeout(function () {
					mui.openWindow({
						url: '../chat/chat.html',
						id: 'chat',
						waiting: {
							autoShow: false
						}
					});
				}, 800);
			},
			mapDetail:function(lat,log,name){
				mui.openWindow({
					url:'../mapDetail/mapDetail.html',
					id:'mapDetail',
					extras: {
						lat: lat,
						log: log,
						name:name
					},
					waiting: {
						autoShow: false
					}
				})
			}
		},
		computed:{
			directionValue:function(){
				return getgetHouseDirectionByChinese(this.direction);
			},
			decorateValue:function(){
				return getHouseDecorateByChinese(this.decorate);
			},
			genreValue:function(){
				return getHtypeDatasByChinese(this.genre);
			},
			rightValue:function(){
				return getPropertyDatasByChinese(this.right);
			}
		},
		mounted: getData,
		updated: function () {
			//banner
			var mySwiper = new Swiper ('.ndHandHouseDetail-banner', {
				direction: 'horizontal',
				loop: true,
				autoPlay: true,
				effect : 'flip',

				// 如果需要分页器
				pagination: {
					el: '.swiper-pagination',
					type: 'fraction',
					bulletClass : 'my-bullet',
				}
			});

			//sameVillage
			var mySwiper = new Swiper ('.ndHandHouseDetail-sameVillage', {
				direction: 'horizontal',
				slidesPerView : 3,	//同时容纳的元素数目
				spaceBetween : 10,	//间隔

				// 如果需要分页器
				pagination: false
			});

			self.show();
			
			//地图初始化
			var map = new BMap.Map("map-container");
			// 创建地图实例
			
			var point = new BMap.Point(this.longAndLat.longitude,this.longAndLat.dimen);
			// 创建点坐标  
			map.centerAndZoom(point, 18);
			map.disableDragging();						//禁用地图拖拽
			map.disableDoubleClickZoom();				//禁用地图双击放大
			map.disablePinchToZoom();					//禁用双指操作放大
			var marker = new BMap.Marker(point);        // 创建标注    
			map.addOverlay(marker);                     // 将标注添加到地图中 
		}
	});

	//推荐房源跳转详情
	mui('.recommends').on('tap','.recommend',function(){
		var ids = this.getAttribute('data-id');
		mui.openWindow({
			url:'../ndHandHouseDetail/ndHandHouseDetail.html',
			extras: {
				pid: ids
			},
			waiting: {
				autoShow:false
			},
			createNew:true
		})
	})
});