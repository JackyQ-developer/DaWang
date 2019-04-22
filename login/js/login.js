mui.plusReady(function(){
	var uuid = plus.device.uuid;		//设备的唯一标识码
	
	//初始化读取登录帐号
	if(localStorage.account != undefined){
		$('#mobile').val(localStorage.account);
	}
	
	/**
	 * @Author      JackyQ
	 * @DateTime    2018-05-31
	 * @version     1.0.0
	 * @description 显示密码
	 */
	var showPassword = document.getElementById('showPassword');
	var password = document.getElementById('password');
	showPassword.addEventListener('hold',function(){
		password.type = 'text';
		this.style.color = '#333';
	});
	showPassword.addEventListener('release',function(){
		password.type = 'password';
		this.style.color = '#ff5a54';
	});

	/**
	 * @Author      JackyQ
	 * @DateTime    2018-06-01
	 * @version     1.0.0
	 * @description 跳转注册
	 */
	$('#gotoRegister').click(function(){
		mui.openWindow({
			url:'../register/register.html',
			createNew:false,
			id:'register',
			show:{
				aniShow:"fade-in"
			},
			waiting:{
				autoShow:false
			}
		})
	});

	/**
	 * @Author      JackyQ
	 * @DateTime    2018-06-02
	 * @version     1.0.0
	 * @description 跳转验证码登录
	 */
	$('#gotoLoginSms').click(function(){
		mui.openWindow({
			url:'../login_sms/login_sms.html',
			id:'login_sms',
			createNew:false,
			show:{
				aniShow:"fade-in"
			},
			waiting:{
				autoShow:false
			}
		});
	});
	
	/**
	 * @Author      JackyQ
	 * @DateTime    2018-08-014
	 * @version     1.0.0
	 * @description 跳转忘记密码
	 */
	$('#gotoLoginForget').click(function(){
		mui.openWindow({
			url:'../login_forget/login_forget.html',
			id:'login_forget',
			createNew:false,
			show:{
				aniShow:"fade-in"
			},
			waiting:{
				autoShow:false
			}
		});
	});

	/**
	 * @Author      JackyQ
	 * @DateTime    2018-06-01
	 * @version     1.0.0
	 * @description 登录 
	 */
	$('#login').click(function(){
		if(loginCheck() == false){
			return;
		}
		$.ajax({
			url: domain + '/api/user.Entry/Login',
			type: 'POST',
			data: {
				identifier: $('#mobile').val(),
				credential: $('#password').val(),
				uuid:uuid,
				identity_type: 1
			},
			timeout: 10000,
			error: ajaxError,
			success: function(res){
				var res = JSON.parse(res);
				if(res.state == 1){
					mui.toast('登录成功');
					localStorage.token = res.token;
					localStorage.account = $('#mobile').val();

					//通知个人中心页面刷新数据
					var target = plus.webview.getWebviewById('../personalCenter/personalCenter.html');
					mui.fire(target,"refreshData",{});
					
					//通知首页重新获取登录后的信息
					var indexWebview = plus.webview.getLaunchWebview();
					mui.fire(indexWebview,"login",{});

					setTimeout(function(){
						mui.back();
					}, 500);
				}else if(res.state == 2){
					mui.toast('用户不存在');
				}else if(res.state == 3){
					mui.toast('用户名或错误，请核实');
				}else if(res.state == 4){
					mui.toast('用户状态异常');
				}else{
					mui.toast('未知错误');
				}
			}
		});
	});

});

/**
 * @Author      JackyQ
 * @DateTime    2018-06-01
 * @version     1.0.0
 * @description 登录验证
 */
function loginCheck(){
	if($('#mobile').val() == ""){
		mui.toast('请填写手机号码');
		return false;
	}else if($('#password').val() == ""){
		mui.toast('请填写密码');
		return false;
	}else{
		return true;
	}
}
