mui.plusReady(function(){
	plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
function getData(){
	$.ajax({
		url: domain + '/api/house.issue/addSee',
		type: 'POST',
		data: {
			token: localStorage.token
		},
		timeout: 10000,
		success: function(response){
			var data = JSON.parse(response);
			if(data == -2){
				alert('请登录后再来');
				mui.back();
			}else{
				app.imgUrl = data.imgUrl;
				app.area = JSON.parse(localStorage.area);
				app.mobile = data.mobile;
				app.phoneNub = data.mobile;
			}
		},
		error: ajaxError
	});
}
function submitData(datas){
	function t(str){
		mui.toast(str);
	}
	if(datas.areaId==''){
		return t('请选择地段');
	}else if(datas.genre === ''){
		return t('请选择类型');
	}else if(datas.area == ''){
		return t('请填写面积');
	}else if(!(/^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/.test(datas.area)&&/^(-?\d+)(\.\d+)?$/.test(datas.area))){
		return t('请填写正确的面积');
	}else if(datas.price == ''){
		return t('请填写售价');
	}else if(!(/^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/.test(datas.price)&&/^(-?\d+)(\.\d+)?$/.test(datas.price))){
		return t('请填写正确的价格');
	}else if(datas.diff === ''){
		return t('请选择当前状态');
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
		url:domain+'/api/house.issue/officeSell',
		data:datas,
		timeout:10000,
		success:function(res){
			var data = JSON.parse(res);
			switch(data){
				case 1:mui.toast('提交成功');mui.back();break;
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
		imgUrl:'',
		housePhoto:true,		//默认图片是否展示
		houseImgSrc:[],			//页面调用图片库
		houseImgSrcData:[],		//后台提交图片
		selectArea: '请选择地段',	//地段
		areaData:[],		//要提交的地段
		selectHouseType:'请选择',
		houseTypeData: '',		//要提交的类型
		areasData: '',		//提交的面积
		priceData: '',		//提交的售价
		curState:'请选择',
		curStateData:'',     //提交的当前状态
		housedetance:'',	 //提交的房屋描述
		inputnub:0,			//输入的字数
		tname:'请填写姓名',   //提交的姓名
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
		sexsuccess:1,		//提交的性别
		mobile:'',			//提交的手机号
		phoneNub:'',
		tcode:'',
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
								uploadFile(domain + '/api/house.issue/PlantImg','plant_tmp',imgPath,{'token':localStorage.token},function(data){
									var data = JSON.parse(data);
									if(data == 'err') return;
									var objS = {url:domain+data.url+data.img_name,cover:2};
									var objSa = {url:data.img_name,cover:2};
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
								uploadFileMulty(domain + '/api/house.issue/PlantImg','plant_tmp',srcArr,{'token':localStorage.token},function(res){
									var data = JSON.parse(res);
									var objS = {url:domain+data.url+data.img_name,cover:2};
									var objSa = {url:data.img_name,cover:2};
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
								uploadFile(domain + '/api/house.issue/PlantImg','plant_tmp',imgPath,{'token':localStorage.token},function(data){
									var data = JSON.parse(data);
									if(data == 'err') return;
									var objS = {url:domain+data.url+data.img_name,cover:2};
									var objSa = {url:data.img_name,cover:2};
									_self.$set(_self.houseImgSrc,indexs,objS);
									_self.$set(_self.houseImgSrcData,indexs,objSa);
								})
							});
						}else if(index == 2){
							//相册选取
							getImageByGallery(function(imgPath){
								if(typeof imgPath == 'object' || imgPath == 'cancel') return;
								uploadFile(domain + '/api/house.issue/PlantImg','plant_tmp',imgPath,{'token':localStorage.token},function(data){
									var data = JSON.parse(data);
									if(data == 'err') return;
									var objS = {url:domain+data.url+data.img_name,cover:2};
									var objSa = {url:data.img_name,cover:2};
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
			selectMap(3,_self.area,function(selectItems){
				if(selectItems.length != 3){
					mui.toast('请选择到小区');
					_self.selectArea = '请选择小区';
				}else{
					// console.log(selectItems[2].text);
					_self.areaData = selectItems[2].value;
					_self.selectArea = selectItems[2].text;
				}
			});
		},
		selectHouseTypeFunc:function(){
			var _self = this;
			selectMap(1,factoryType,function(selectItems){
				_self.selectHouseType = selectItems[0].text;
				_self.houseTypeData = selectItems[0].value;
			});
		},
		setStateFunc:function(){
			var _self = this;
			selectMap(1,currentState,function(selectItems){
				_self.curState = selectItems[0].text;
				_self.curStateData = selectItems[0].value;
			});
		},
		descInput:function(){
			this.inputnub = this.housedetance.length;
		},
		delInput:function(){
			this.housedetance = '';
			this.inputnub = 0;
		},
		setnameFunc:function(){
			var _self = this;
			mprompt('请输入姓名','','',function(value){
				if(value == 'cancel') return;
				_self.tname = value;
			});
		},
		setxsexFunc:function(){
			this.classObjectx.checked = true;
			this.classObjectn.checked = false;
			this.classObjectx.slideInRight = true;
			this.classObjectn.slideInLeft = false;
			this.sexsuccess = 1;
		},
		setnsexFunc:function(){
			this.classObjectx.checked = false;
			this.classObjectn.checked = true;
			this.classObjectx.slideInRight = false;
			this.classObjectn.slideInLeft = true;
			this.sexsuccess = 2;
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
					token:localStorage.token,
					'houseImg':JSON.stringify(this.houseImgSrcData),
					'price':this.priceData,
					'area':this.areasData,
					'diff':this.curState,
					'genre':this.houseTypeData,
					'describe':this.housedetance,
					'areaId':this.areaData,
					'village':this.selectArea,
					'mobile':this.mobile,
					'name':this.tname,
					'sex':this.sexsuccess,
					'mobilelz':this.tcode
				};
			if(this.houseImgSrcData.length == 0){
				nconfirm('暂未上传图片,确认发布吗？',function(value){
					if(value == 1) return;
					$.ajax({
						type:'POST',
						url:domain+'/api/house.issue/plantSell',
						data:datas,
						timeout:10000,
						success:function(res){
							var data = JSON.parse(res);
							switch(data){
								case 1:mui.toast('提交成功');mui.back();break;
								case 2:mui.toast('提交失败,请重试');break;
								case 3:mui.toast('请完善信息');break;
								case 6:mui.toast('验证码已过期');break;
								case 7:mui.toast('验证码输入错误');break;
							}
						},
						error:ajaxError
					});
				},'')
			}else{
				$.ajax({
					type:'POST',
					url:domain+'/api/house.issue/plantSell',
					data:datas,
					timeout:10000,
					success:function(res){
						var data = JSON.parse(res);
						switch(data){
							case 1:mui.toast('提交成功');mui.back();break;
							case 2:mui.toast('提交失败,请重试');break;
							case 3:mui.toast('请完善信息');break;
							case 6:mui.toast('验证码已过期');break;
							case 7:mui.toast('验证码输入错误');break;
						}
					},
					error:ajaxError
				});
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
});