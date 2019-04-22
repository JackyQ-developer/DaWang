jQuery(document).ready(function($) {
	/**
	 * @Author      JackyQ
	 * @DateTime    2018-06-05
	 * @version     1.0.0
	 * @description 获取验证码
	 */
	var timeSwitch = false;
	$('#getIdentfyCode').click(function() {
		// 验证手机号
		if($('#mobile').val() == ""){
			mui.toast('请填写手机号码');
			return false;
		}else if(validator.isMobilePhone($('#mobile').val(),'zh-CN') == false){
			mui.toast('请填写正确的手机号码');
			return false;
		}
		// 验证手机号
		var _this = $(this);
		if(timeSwitch === true){
			return false;
		}else{
			$.ajax({
				url: domain + '/api/user.info/sendsms',
				type: 'POST',
				data: {
					identifier: $('#mobile').val(),
					token: localStorage.token
				},
				timeout: 10000,
				success: function(response){
					if(response == 1){
						changeCode(_this);
					}else if(response == 2){
						mui.toast('已超过验证码短信限额，请明日重试');
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
						mui.toast('未知错误');
					}
				}
			});
		}
	});

	/**
	 * @Author      JackyQ
	 * @DateTime    2018-05-31
	 * @version     1.0.0
	 * @description 获取验证码倒计时
	 */
	function changeCode(_this){
		_this.text('180秒后可重新获取').removeClass('register-orange-text').addClass('register-gray-text');
		var time = 180;		//设置重新获取时间
		inter = setInterval(function(){
			if(time > 1){
				time -= 1;
				timeSwitch = true;
				_this.text(time+'秒后可重新获取');
			}else{
				_this.text('获取验证码').removeClass('register-gray-text').addClass('register-orange-text');
				clearInterval(inter);
				timeSwitch = false;
			}
		},1000);
	}

	/**
	 * @Author      JackyQ
	 * @DateTime    2018-06-05
	 * @version     1.0.0
	 * @description 提交解绑
	 */
	$('#register').click(function(){
		if(registerCheck() == false){
			return;
		}
		$.ajax({
			url: domain + '/api/user.info/user_newmobile',
			type: 'POST',
			data: {
				identifier: $('#mobile').val(),
				mobilelz: $('#mobilelz').val(),
				token: localStorage.token
			},
			timeout: 10000,
			error: ajaxError,
			success: function(response){
				if(response == 1){
					mui.toast('换绑成功');
					mui.back();
				}else if(response == 2){
					mui.toast('验证码已失效，请重新获取');
				}else if(response == 3){
					mui.toast('验证码错误，请核实');
				}else{
					mui.toast('未知错误');
				}
			}
		});
	});

	/**
	 * @Author      JackyQ
	 * @DateTime    2018-06-01
	 * @version     1.0.0
	 * @description 注册验证
	 */
	function registerCheck(){
		if($('#mobile').val() == ""){
			mui.toast('请填写手机号码');
			return false;
		}else if(validator.isMobilePhone($('#mobile').val(),'zh-CN') == false){
			mui.toast('请填写正确的手机号码');
			return false;
		}else if($('#mobilelz').val() == ""){
			mui.toast('请填写验证码');
			return false;
		}else{
			return true;
		}
	}
});