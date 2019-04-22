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
	}else if(datas.area == ''){
		return t('请填写面积');
	}else if(!(/^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/.test(datas.area)&&/^(-?\d+)(\.\d+)?$/.test(datas.area))){
		return t('请填写正确的面积');
	}else if(datas.genre === ''){
		return t('请选择类型');
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
		url:domain+'/api/house.issue/plantBegsell',
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
		error: ajaxError
	});
}
var app = new Vue({
	el: "#app",
	data: {
		selectArea:'请选择小区',
		areaData:[],		//要提交的地段
		selectHouseType:'请选择',
		houseTypeData: '',		//要提交的类型
		areasData: '',		//提交的面积
		minpriceData:'',		//提交的期望价格低
		maxpriceData:'',		//提交的期望价格高
		housedetance:'',	 //提交的房屋描述
		inputnub:0,			 //输入的字数
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
					'price_min':this.minpriceData,
					'price_max':this.maxpriceData,
					'area':this.areasData,
					'genre':this.houseTypeData,
					'describe':this.housedetance,
					'areaId':this.areaData,
					'village':this.selectArea,
					'mobile':this.mobile,
					'name':this.tname,
					'sex':this.sexsuccess,
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
		app.minpriceData = '';
	}
})
$('#maxprice').change(function(){
	var min = $('#minprice').val();
	var max = $(this).val();
	if(parseInt(min) != '' && parseInt(max) <= parseInt(min)){
		mui.toast('输入价格必须大于最低价')
		$(this).val('');
		app.maxpriceData = '';
	}
})
});
