mui.plusReady(function(){
	plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
	var webview = plus.webview.currentWebview();
function getData(){
	$.ajax({
		url: domain + '/api/house.edit/entrance',
		type: 'POST',
		data: {
			token: localStorage.token,
			type:webview.ptype,
			houseId:webview.pid
		},
		timeout: 10000,
		success: function(response){
			var data = JSON.parse(response);
			for(var i in data){
				app.$data[i] = data[i];
			}
			app.price = JSON.parse(app.price);
			app.area = JSON.parse(app.area);
			app.ask = JSON.parse(app.ask);
			if(data.img.length == 0){
				app.housePhoto = true;
			}
			if(data.sex == 1){
				app.classObjectx.checked = true;
				app.classObjectn.checked = false;
				app.classObjectx.slideInRight = true;
				app.classObjectn.slideInLeft = false;
			}else if(data.sex == 2){
				app.classObjectx.checked = false;
				app.classObjectn.checked = true;
				app.classObjectx.slideInRight = false;
				app.classObjectn.slideInLeft = true;
			}
			for(var i=0;i<data.img.length;i++){
				var arrb = {img:domain+data.img[i].url+data.img[i].img,cover:data.img[i].cover};
				var arrc = {img:data.img[i].img,cover:data.img[i].cover};
				app.houseImgSrc[i] = arrb;
				app.houseImgSrcData[i] = arrc;
			}
			for(var i = 0;i < data.ask.length;i++){
				for(var k = 0;k < app.rentalrequirements.length;k++){
					if(data.ask[i] == app.rentalrequirements[k].value){
						app.rentalrequirements[k].show = true;
					}
				}
			}
			app.phoneNub = data.mobile;
		},
		error: ajaxError
	});
}
function submitData(datas){
	function t(str){
		mui.toast(str);
	}
	if(datas.area_id==''){
		return t('请选择小区');
	}else if(datas.room == undefined){
		return t('请选择户型');
	}else if(datas.bedroom === ''){
		return t('请选择卧室');
	}else if(datas.direction === ''){
		return t('请选择朝向');
	}else if(datas.total == undefined){
		return t('请选择楼层');
	}else if(datas.decorate === ''){
		return t('请选择装修');
	}else if(datas.area == ''){
		return t('请填写面积');
	}else if(!(/^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/.test(datas.area)&&/^(-?\d+)(\.\d+)?$/.test(datas.area))){
		return t('请填写正确的面积');
	}else if(datas.price == ''){
		return t('请填写租金');
	}else if(!(/^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/.test(datas.price)&&/^(-?\d+)(\.\d+)?$/.test(datas.price))){
		return t('请填写正确的价格');
	}else if(datas.way === ''){
		return t('请选择付款方式');
	}else if(datas.describe == ''){
		return t('请填写描述');
	}else if(datas.name == '请填写姓名'|| datas.name == ''){
		return t('请填写姓名');
	}else if(datas.name.length > 6){
		return t('姓名超出长度')
	}else if(datas.mobile == ''){
		return t('请填写手机号');
	}else if(!(/^[1][3,4,5,7,8,9][0-9]{9}$/.test(datas.mobile))){
		return t('请填写正确的手机号');
	}
	$.ajax({
		type:'POST',
		url:domain+'/api/house.edit/alterHouse',
		data:datas,
		timeout:10000,
		success:function(res){
			var data = JSON.parse(res);
			switch(data){
				case 1:mui.toast('提交成功');
					var backs = plus.webview.getWebviewById('myRelease');
					mui.fire(backs,'refreshData',{});
					setTimeout(function(){mui.back();},500);
					break;
				case 2:mui.toast('提交失败,请重试');break;
				case 3:mui.toast('请完善信息');break;
				case 6:mui.toast('验证码已过期');break;
				case 7:mui.toast('验证码输入错误');break;
				default:mui.toast('网络拥堵');break;
			}
		},
		error:ajaxError
	});
}
var app = new Vue({
	el: "#app",
	data: {
		domain:domain,
		houseId:'',
	    price:'',
	    way:'',
	    hall:'',
	    room:'',
	    guard:'',
	    bedroom:'',
	    area:'',
	    direction:'',
	    floor:'',
	    total:'',
	    decorate:'',
	    ask:[],
	    describe:'',
	    area_id:'',
	    village:'',
	    mobile:'',
	    name:'',
	    sex:'',
	    imgUrl:'',
	    img:[],
	    houseType:'',
	    housePhoto:false,		//默认图片是否展示
	    houseImgSrc:[],			//页面调用图片库
		houseImgSrcData:[],		//后台提交图片
		rentalrequirements:houseyq,
		imgUrl:'',
		//选择男女数据
		//先生
		classObjectx:{
			animated:true,
			checked:true,
			slideInRight:true
		},
		// 女士
		classObjectn:{
			animated:true,
			checked:false,
			slideInLeft:false
		},
		phoneNub:'',
		tcode:'',
	},
	computed: {
		directionValue:function(){
			return getgetHouseDirectionByChinese(this.direction);
		},
		decorateValue:function(){
			return getHouseDecorateByChinese(this.decorate);
		},
		bedroomValue:function(){
			return getBedroomsByChinese(this.bedroom);
		},
		paymethodValue:function(){
			return getwayValueByChinese(this.way);
		},
		inputnub:function(){
			return this.describe.length;
		}
	},
	methods: {
		sethouseImgFunc:function(indexs){
			var _self = this;
			var obj = {
				title: '操作',
				cancel: '取消',
				buttons: [{title:'新增'},{title:'更换'},{title:'设为封面'},{title:'删除'}]
			};
			if(indexs == -1){
				obj = {
					title: '操作',
					cancel: '取消',
					buttons: [{title:'上传'}]
				};
			}
			var objC = {
				title: '操作',
				cancel: '取消',
				buttons: [{title:'拍照'},{title:'相册选取'}]
			};
			actionSheet(obj,function(index){
				if(index == 1){
					//新增||上传
					actionSheet(objC,function(index){
						if(index == 1){
							//拍照
							getImageByCamera(function(imgPath){
								if(typeof imgPath == 'object' || imgPath == 'cancel') return;
								uploadFile(domain + '/api/house.issue/RentImg','rent_tmp',imgPath,{'token':localStorage.token},function(data){
									var data = JSON.parse(data);
									if(data == 'err') return;
									var objS = {img:domain+data.url+data.img_name,cover:2};
									var objSa = {img:data.img_name,cover:2};
									_self.houseImgSrc.push(objS);
									_self.houseImgSrcData.push(objSa);
									if(indexs == -1){
										_self.housePhoto = false;
									}
								})
							});
						}else if(index == 2){
							//相册选取
							getImageByGalleryMulty(function(srcArr){
								uploadFileMulty(domain + '/api/house.issue/RentImg','rent_tmp',srcArr,{'token':localStorage.token},function(res){
									var data = JSON.parse(res);
									var objS = {img:domain+data.url+data.img_name,cover:2};
									var objSa = {img:data.img_name,cover:2};
									_self.houseImgSrc.push(objS);
									_self.houseImgSrcData.push(objSa);
									if(indexs == -1){
										_self.housePhoto = false;
									}
								});
							});
						}else if(index == 'cancel'){
							return;
						}
					});
				}else if(index == 2){
					//更换
					actionSheet(objC,function(index){
						if(index == 1){
							//拍照
							getImageByCamera(function(imgPath){
								if(typeof imgPath == 'object' || imgPath == 'cancel') return;
								uploadFile(domain + '/api/house.issue/RentImg','rent_tmp',imgPath,{'token':localStorage.token},function(data){
									var data = JSON.parse(data);
									if(data == 'err') return;
									var objS = {img:domain+data.url+data.img_name,cover:2};
									var objSa = {img:data.img_name,cover:2};
									_self.$set(_self.houseImgSrc,indexs,objS);
									_self.$set(_self.houseImgSrcData,indexs,objSa);
								})
							});
						}else if(index == 2){
							//相册选取
							getImageByGallery(function(imgPath){
								if(typeof imgPath == 'object' || imgPath == 'cancel') return;
								uploadFile(domain + '/api/house.issue/RentImg','rent_tmp',imgPath,{'token':localStorage.token},function(data){
									var data = JSON.parse(data);
									if(data == 'err') return;
									var objS = {img:domain+data.url+data.img_name,cover:2};
									var objSa = {img:data.img_name,cover:2};
									_self.$set(_self.houseImgSrc,indexs,objS);
									_self.$set(_self.houseImgSrcData,indexs,objSa);
								})
							});
						}else if(index == 'cancel'){
							return;
						}
					});
				}else if(index == 3){
					//设为封面
					var arrs = _self.houseImgSrc.splice(indexs,1);
					_self.houseImgSrc = arrs.concat(_self.houseImgSrc);
					var arrst = _self.houseImgSrcData.splice(indexs,1);
					_self.houseImgSrcData = arrst.concat(_self.houseImgSrcData);
					for(var i = 0;i<_self.houseImgSrc.length;i++){
						_self.houseImgSrc[i].cover = 2;
						_self.houseImgSrcData[i].cover = 2;
					}
					_self.houseImgSrc[0].cover = 1;
					_self.houseImgSrcData[0].cover = 1;
					mui.toast('设置成功');
				}else if(index == 4){
					//删除
					_self.houseImgSrc.splice(indexs,1);
					_self.houseImgSrcData.splice(indexs,1);
					mui.toast('删除成功');
					if(_self.houseImgSrc.length < 1){
						_self.housePhoto = true;
					}
				}else if(index == 'cancel'){
					return;
				}
			});
		},
		selectAreaFunc:function(){
			var _self = this;
			var area = JSON.parse(localStorage.area);
			selectMap(3,area,function(selectItems){
				if(selectItems.length != 3){
					mui.toast('请选择到小区');
					_self.village = '请选择小区';
				}else{
					// console.log(selectItems[2].text);
					_self.area_id = selectItems[2].value;
					_self.village = selectItems[2].text;
				}
			});
		},
		selectHouseTypeFunc:function(){
			var _self = this;
			selectMap(3,houseType,function(selectItems){
				_self.room = selectItems[0].value;
				_self.hall = selectItems[1].value;
				_self.guard = selectItems[2].value;
			});
		},
		setBedroomFunc:function(){
			var _self = this;
			selectMap(1,bedrooms,function(selectItems){
				_self.bedroom = selectItems[0].value;
			});
		},
		selectHouseDirectionFunc:function(){
			var _self = this;
			selectMap(1,houseDirection,function(selectItems){
				_self.direction = selectItems[0].value;
			});
		},
		selectStoreyFunc:function(){
			var _self = this;
			selectMap(2,storey,function(selectItems){
				_self.floor = selectItems[0].value;
				_self.total = selectItems[1].value;
			});
		},
		setDecorateFunc:function(){
			var _self = this;
			selectMap(1,houseDecorate,function(selectItems){
				_self.decorate = selectItems[0].value;
			});
		},
		setPayMethodFunc:function(){
			var _self =this;
			selectMap(1,paymethods,function(selectItems){
				_self.way = selectItems[0].value;
			});
		},
		setyqcheckedsFunc:function(items,indexs){
			var _self = this;
			if(items.show == false){
				_self.ask.push(indexs);
			}else if(items.show == true){
				for(i = 0;i < _self.ask.length ; i++){
					if(_self.ask[i] == indexs){
						_self.ask.splice(i,1);
					}
				}
			}
			_self.ask = _self.ask.sort(function(a,b){
				return a-b;
			});
			items.show = !items.show;
		},
		delInput:function(){
			this.describe = '';
		},
		setnameFunc:function(){
			var _self = this;
			mprompt('请输入姓名','','',function(value){
				if(value == 'cancel') return;
				_self.name = value;
			});
		},
		setxsexFunc:function(){
			this.classObjectx.checked = true;
			this.classObjectn.checked = false;
			this.classObjectx.slideInRight = true;
			this.classObjectn.slideInLeft = false;
			this.sex = 1;
		},
		setnsexFunc:function(){
			this.classObjectx.checked = false;
			this.classObjectn.checked = true;
			this.classObjectx.slideInRight = false;
			this.classObjectn.slideInLeft = true;
			this.sex = 2;
		},
		setphoneFunc:function(){
			if(this.mobile.length == 11){
				if(this.mobile != this.phoneNub){
					$('#iscode').text('未验证');
					$('#iscode').removeClass('yescode');
					$('#t-code').show();
					$.ajax({
						type:'POST',
						url:domain + '/api/house.issue/sendsms',
						data:{
							token:localStorage.token,
							'identifier':app.mobile
						},
						timeout:10000,
						success:function(res){
							console.log(res);
							if(res == 1){
								mui.toast('发送验证码成功');
							}else if(res == 2){
								mui.toast('已超过验证码短信限额，请明日重试');
							}else{
								mui.toast('发送失败,请重新发送');
							}
						}
					});
				}else{
					$('#iscode').text('已验证');
					$('#idcode').addClass('yescode');
					$('#t-code').hide();
				}
			}
		},
		settsubmitFunc:function(){
			var datas = {
					'type':this.houseType,
					'houseId':this.houseId,
					'img':JSON.stringify(this.img),
					token:localStorage.token,
					'houseImg':JSON.stringify(this.houseImgSrcData),
					'price':this.price,
					'way':this.way,
					'area':this.area,
					'room':this.room,
					'hall':this.hall,
					'guard':this.guard,
					'bedroom':this.bedroom,
					'direction':this.direction,
					'floor':this.floor,
					'total':this.total,
					'decorate':this.decorate,
					'ask':JSON.stringify(this.ask),
					'describe':this.describe,
					'area_id':this.area_id,
					'village':this.village,
					'mobile':this.mobile,
					'name':this.name,
					'sex':this.sex,
					'mobilelz':this.tcode
				};
			if(this.houseImgSrcData.length == 0){
				nconfirm('暂未上传图片,确认发布吗？',function(value){
					if(value == 1) return;
					submitData(datas);
				},'')
			}else{
				submitData(datas);
			}
		}
	},
	mounted:getData,
	updated:function(){
		//banner
		var mySwiper = new Swiper ('.swiper-container', {
			direction: 'horizontal',
			observer:true,//修改swiper自己或子元素时，自动初始化swiper
       		observeParents:true,//修改swiper的父元素时，自动初始化swiper

			// 如果需要分页器
			pagination: {
				el: '.swiper-pagination',
				type: 'fraction',
				bulletClass : 'my-bullet',
			}
		});
	}
});
})