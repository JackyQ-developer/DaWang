mui.plusReady(function(){
	plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
// 	var self = plus.webview.currentWebview();
// 	var user_id = self.user_id;
	
	var ndHouse = null;
	var rent = null;
	var bussiness = null;
	var source = [
		{text:'个人',value:0},
		{text:'经纪人',value:1},
		{text:'不限',value:2}
	];
	var submitData = null;

	// var subHallRoom = [];
	// for (var i = 0; i < subHallRooms.length; i++) {
	// 	subHallRooms[i].style = '';
	// 	subHallRoom.push(subHallRooms[i])
	// }
	// console.log(subHallRoom)
	var app = new Vue({
		el: "#app",
		data:{
			domain:domain,
			minPrice:'',
			maxPrice:'',
			submitType:0,		//提交类型
			locationData:[],	//期望地点
			subHallRooms:subHallRooms,	//厅室
			subHallRoomsData:[],		//提交的厅室数据		
			houseDirection:houseDirection,	//房屋朝向
			directionData:[],			//要提交的房屋朝向
			source:source,				//来源
			sourceData:2,				//要提交的来源
			houseType:[{text:'商铺'},{text:'写字楼'},{text:'厂房'}],		//房屋类型
			houseTypeData:0,	//要提交的房屋类型
			transactionType:[{text:'出售'},{text:'出租'},{text:'转让'}],	//交易类型
			transactionTypeData:0,		//要提交的房屋类型
			areas:[{text:'50-100㎡',value:[50,100]},{text:'100-150㎡',value:[100,150]},{text:'150-200㎡',value:[150,200]},{text:'200-250㎡',value:[200,250]},{text:'250-300㎡',value:[250,300]},{text:'300-400㎡',value:[300,400]},{text:'400-500㎡',value:[400,500]},{text:'500㎡以上',value:[500,10000]}],		//面积
			areasData:[],		//要提交的面积
			leaseType:[{text:'整租'},{text:'合租'}],		//出租类型
			leaseTypeData:0
		},
		mounted:function(){
			var _self = this;
			var mySwiper = new Swiper('.swiper-container', {
				clickable: true,
				autoHeight:true,
				houseType:houseType,
				on:{
					slideChangeTransitionStart:function(){
						app.submitType = this.activeIndex;
						_self.locationData = [];
						_self.subHallRoomsData = [];
						_self.directionData = [];
						_self.minPrice = '';
						_self.maxPrice = '';
						for (var i = 0; i < _self.subHallRooms.length; i++) {
							Vue.set(_self.subHallRooms[i],'style','');
						}
						for (var i = 0; i < _self.houseDirection.length; i++) {
							Vue.set(_self.houseDirection[i],'style','');
						}
					}
				},
				pagination: {
					el: '.swiper-pagination',
					clickable :true,
					bulletClass : 'brokerDetails-bullet',
					bulletActiveClass: 'brokerDetails-active',
					renderBullet: function (index, className) {
			          switch(index){
			            case 0:text='二手房';break;
			            case 1:text='租房';break;
			            case 2:text='商用房';break;
			          }
			          return '<span class="' + className + '">' + text + '</span>';
			        }
				},
			});
		},
		methods: {
			addLocation:function(){
				var _self = this;
				var area = JSON.parse(localStorage.area);
				selectMap(3,area,function(selectItems){
					_self.locationData.push(selectItems[selectItems.length-1]);
				});
			},
			delLocation:function(index) {
				this.locationData.splice(this.locationData.indexOf(index),1);
			},
			selectSubHallRoom:function(index){
				if(this.subHallRooms[index].style !='checked'){
					//选中
					Vue.set(app.subHallRooms[index],'style','checked');
					this.subHallRoomsData.push(index);
				}else{
					//取消选中
					Vue.set(app.subHallRooms[index],'style','');
					this.subHallRoomsData.splice(this.subHallRoomsData.indexOf(index),1);
				}
			},
			selectDirection:function(index){
				if(this.houseDirection[index].style !='checked'){
					//选中
					Vue.set(app.houseDirection[index],'style','checked');
					this.directionData.push(index);
				}else{
					//取消选中
					Vue.set(app.houseDirection[index],'style','');
					this.directionData.splice(this.directionData.indexOf(index),1);
				}
			},
			selectSource:function (index) {
				this.sourceData = index;
			},
			selectHouseType:function(index){
				if(index == 2) {
					this.transactionType=[{text:'出售'},{text:'出租'}];
				}else{
					this.transactionType=[{text:'出售'},{text:'出租'},{text:'转让'}];
				}
				this.houseTypeData = index;
			},
			selectTransactionType:function(index){
				this.transactionTypeData = index;
			},
			selectArea:function(index){
				if(this.areas[index].style !='checked'){
					//选中
					Vue.set(app.areas[index],'style','checked');
					Vue.set(app.areasData,index,app.areas[index].value);
				}else{
					//取消选中
					Vue.set(app.areas[index],'style','');
					app.areasData.splice(index,1);
				}
			},
			selectLeaseType:function (index) {
				this.leaseTypeData = index;
			},
			submit:function () {
				var submitData = null;
				var _self = this;

				switch (this.submitType) {
					case 1:
						//租房
						var locationData = _self.locationData.map(function(item) {
							return item.value;
						});
						submitData = {
							token:localStorage.token,
							type:_self.submitType,
							price_min:_self.minPrice,
							price_max:_self.maxPrice,
							genre: _self.leaseTypeData,
							area_id:locationData,
							room:_self.subHallRoomsData,
							direction:_self.directionData,
							identity:_self.sourceData
						};
						break;
					case 2:
						//商用房
						var areasData2 = removeEmptyArrayEle(_self.areasData);
						var locationData = _self.locationData.map(function(item) {
							return item.value;
						});
						submitData = {
							token:localStorage.token,
							type:_self.submitType,
							houseType:_self.houseTypeData,
							genre:_self.transactionTypeData,
							area:areasData2,
							area_id:locationData,
							identity:_self.sourceData
						};
						break;
					default:
						//二手房
						var locationData = _self.locationData.map(function(item) {
							return item.value;
						});
						submitData = {
							token:localStorage.token,
							type:_self.submitType,
							price_min:_self.minPrice,
							price_max:_self.maxPrice,
							area_id:locationData,
							room:_self.subHallRoomsData,
							direction:_self.directionData,
							identity:_self.sourceData
						};
						break;
				}
				$.ajax({
					url: domain + '/api/user.subscription/sbpAdd',
					type: 'POST',
					data: submitData,
					timeout: 10000,
					success: function(response){
						if(response == 1){
							mui.back();
							mui.toast('添加成功');
							var backs = plus.webview.getWebviewById('mySubscribeList');
								mui.fire(backs,'refreshData',{});
								setTimeout(function(){mui.back();},500);
						}
					},
					error: ajaxError
				});
			}
		}
	})
})
