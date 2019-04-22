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
			app.price_min = JSON.parse(app.price_min);
			app.price_max = JSON.parse(app.price_max);
			app.area = JSON.parse(app.area);
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
	}else if(datas.area == ''){
		return t('请填写面积');
	}else if(!(/^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/.test(datas.area)&&/^(-?\d+)(\.\d+)?$/.test(datas.area))){
		return t('请填写正确的面积');
	}else if(datas.decorate === ''){
		return t('请选择装修');
	}else if(datas.total == undefined){
		return t('请选择楼层');
	}else if(datas.genre === ''){
		return t('请选择房屋类型');
	}else if(datas.price_min == '' || datas.price_max == ''){
		return t('请填写期望价格');
	}else if(!(/^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/.test(datas.price_min)&&/^(-?\d+)(\.\d+)?$/.test(datas.price_min))){
		return t('请填写正确的价格');
	}else if(!(/^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/.test(datas.price_max)&&/^(-?\d+)(\.\d+)?$/.test(datas.price_max))){
		return t('请填写正确的价格');
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
			}
		},
		error:ajaxError
	});
}
var app = new Vue({
	el: "#app",
	data: {
		houseId:'',
	    price_min:'',
	    price_max:'',
	    area:'',
	    hall:'',
	    room:'',
	    guard:'',
	    floor:'',
	    total:'',
	    genre:'',
	    decorate:'',
	    describe:'',
	    area_id:'',
	    village:'',
	    mobile:'',
	    name:'',
	    sex:'',
	    imgUrl:'',
	    img:[],
	    houseType:'',
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
		tcode:''
	},
	computed: {
		decorateValue:function(){
			return getHouseDecorateByChinese(this.decorate);
		},
		genreValue:function(){
			return getHtypeDatasByChinese(this.genre);
		},
		inputnub:function(){
			return this.describe.length;
		}
	},
	methods: {
		selectAreaFunc:function(){
			var _self = this;
			var area = JSON.parse(localStorage.area);
			selectMap(3,area,function(selectItems){
				if(selectItems.length != 3){
					mui.toast('请选择到小区');
					_self.village = '请选择小区';
				}else{
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
		setDecorateFunc:function(){
			var _self = this;
			selectMap(1,houseDecorate,function(selectItems){
				_self.decorate = selectItems[0].value;
			});
		},
		selectStoreyFunc:function(){
			var _self = this;
			selectMap(2,storey,function(selectItems){
				_self.floor = selectItems[0].value;
				_self.total = selectItems[1].value;
			});
		},
		setHtypeFunc:function(){
			var _self = this;
			selectMap(1,htypeDatas,function(selectItems){
				_self.genre = selectItems[0].value;
			});
		},
		descInput:function(){
			inputnub = this.describe.length;
		},
		delInput:function(){
			this.describe = '';
			inputnub = 0;
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
					'type':this.houseType,
					'houseId':this.houseId,
					'img':JSON.stringify(this.img),
					'price_min':this.price_min,
					'price_max':this.price_max,
					'area':this.area,
					'room':this.room,
					'hall':this.hall,
					'guard':this.guard,
					'floor':this.floor,
					'total':this.total,
					'genre':this.genre,
					'decorate':this.decorate,
					'describe':this.describe,
					'area_id':this.area_id,
					'village':this.village,
					'mobile':this.mobile,
					'name':this.name,
					'sex':this.sex,
					'mobilelz':this.tcode
				};
			submitData(datas);
		}
	},
	mounted:getData
});
$('#minprice').change(function(){
	var max = $('#maxprice').val();
	var min = $(this).val();
	if(parseInt(max) != '' && parseInt(min) >= parseInt(max)){
		mui.toast('输入价格必须小于最高价');
		$(this).val('');
		app.price_min = '';
	}
})
$('#maxprice').change(function(){
	var min = $('#minprice').val();
	var max = $(this).val();
	if(parseInt(min) != '' && parseInt(max) <= parseInt(min)){
		mui.toast('输入价格必须大于最低价')
		$(this).val('');
		app.price_max = '';
	}
})
});