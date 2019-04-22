mui.plusReady(function(){
var typeArrEdit = [
			{text:'商铺转让',value:0,detailsRoute:'shopBusinessTransfer'},
			{text:'二手房',value:1,detailsRoute:'ndHandHouseRelease'},
			{text:'整租',value:2,detailsRoute:'fullRentRelease'},
			{text:'合租',value:3,detailsRoute:'jointRentRelease'},
			{text:'厂房出售',value:4,detailsRoute:'factorySale'},
			{text:'厂房出租',value:5,detailsRoute:'workshopRental'},
			{text:'厂房转让',value:6,detailsRoute:'plantBusinessTransfer'},
			{text:'写字楼出售',value:7,detailsRoute:'saleofOfficeBuildings'},
			{text:'写字楼出租',value:8,detailsRoute:'officeRental'},
			{text:'商铺出售',value:9,detailsRoute:'shopSale'},
			{text:'商铺出租',value:10,detailsRoute:'shopRental'},
			{text:'求租',value:11,detailsRoute:'houseRenting'},
			{text:'厂房求购',value:12,detailsRoute:'factoryPurchase'},
			{text:'厂房求租',value:13,detailsRoute:'workshopRentSeeking'},
			{text:'写字楼求租求购',value:14,detailsRoute:'officeBuilding'},
			{text:'商铺求租求购',value:15,detailsRoute:'shopPurchase'},
			{text:'二手房求购',value:16,detailsRoute:'ndHandHousePurchase'}
		];
	/*
	 *	获取列表数据(搜索数据)
	 */
	var type = 1;
	function getData(){
		$.ajax({
			url: domain + '/api/user.info/release',
			type: 'POST',
			data:{
				token:localStorage.token,
				type:type
			},
			timeout: 10000,
			success: function(response){
				var res = JSON.parse(response);
				if(res.data.length == 0){
					app.isshow = true;
				}else{
					app.isshow = false;
				}
				if(res.data.length == 0 && type == 4){
					app.isshows = true;
					app.isshow = false;
				}else{
					app.isshows = false;
				}
				app.showData = res.data;
				app.count = res.count;
			},
			error: ajaxError
		});
	}
//返回刷新
window.addEventListener('refreshData', function (event) {
	getData();
});
	var app = new Vue({
		el: "#app",
		data: {
			domain:domain,
			showData: [],
			count:'',
			isshow:false,
			isshows:false
		},
		mounted: getData,
		methods: {
			goto: function(item){
				//如果不是审核通过的，不能跳转详情页
				if(item.status != 1) return;
				//如果type大于10,不需要跳转（求租求购没有详情页）
				if(item.type > 10) return;

				var route = typeArr[item.type].detailsRoute;
				mui.openWindow({
					url: '../'+route+'/'+route+'.html',
					id: route,
					waiting: {
						autoShow:false
					},
					extras: {
						pid: item.houseId
					}
				});
			},
			getStatus:function(index){
				if(this.showData[index].is_delete == 1){
					return '个人下架';
				}else{
					switch(this.showData[index].status)
					{
						case 1:
							return '审核通过';
							break;
						case 2:
							return '审核中';
							break;
						case 3:
							return '审核未通过';
							break;
						default:
							break;
					}
				}
			},
			getClass:function(index){
				switch(this.showData[index].status)
				{
					case 1:
						return 'green-text';
						break;
					case 2:
						return 'blue-text';
						break;
					case 3:
						return 'red-text';
						break;
					default:
						break;
				}
			},
			gotoAuth:function(){
				mui.openWindow({
					url:'../Authentication/Authentication.html',
					waiting:{
						autoShow:false
					}
				})
			},
			refresh:function(item){
				nconfirm("是否要刷新此数据",function(index){
					if(index == 0){
						$.ajax({
							url: domain + '/api/house.edit/refresh',
							type: 'POST',
							data:{
								houseId:item.houseId,
								type:item.type,
								token:localStorage.token
							},
							timeout: 10000,
							success: function(response){
								if(response == 1){
									mui.toast('刷新成功');
									getData();
								}
							},
							error: ajaxError
						});
					}
				},{
					title:'提示'
				});
			},
			edits:function(item){
				mui.openWindow({
					url:'../'+typeArrEdit[item.type].detailsRoute+'/'+typeArrEdit[item.type].detailsRoute+'Edit.html',
					id:typeArrEdit[item.type].detailsRoute+'Edit',
					extras: {
						pid:item.houseId,
						ptype:item.type
					},
					waiting: {
						autoShow:false
					}
				})
			},
			lower:function(item){
				nconfirm("是否下架此数据",function(index){
					if(index == 0){
						$.ajax({
							type:'POST',
							url:domain+'/api/house.edit/sold',
							data:{
								token:localStorage.token,
								houseId:item.houseId,
								type:item.type
							},
							success:function(res){
								if(res == 1){
									mui.toast('下架成功');
									getData();
								}
							}
						})
					}
				},{
					title:'提示'
				});
			},
			shelf:function(item){
				nconfirm("是否上架此数据",function(index){
					if(index == 0){
						$.ajax({
							type:'POST',
							url:domain+'/api/house.edit/added',
							data:{
								token:localStorage.token,
								houseId:item.houseId,
								type:item.type
							},
							success:function(res){
								if(res == 1){
									mui.toast('上架成功');
									getData();
								}
							}
						})
					}
				},{
					title:'提示'
				});
			}
		}
	});
// 列表筛选
	$('.searchList li').click(function(){
		$('.searchList li').removeClass('active');
		$(this).addClass('active');
		type = $(this).attr('data-type');
		getData();
	})

})
