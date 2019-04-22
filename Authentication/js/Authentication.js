mui.plusReady(function(){
	plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
$(function(){
	mui.plusReady(function(){

	/**
	 * @Author      gaojian
	 * @DateTime    2018-06-11
	 * @version     1.0.0
	 * @description 认证状态判断
	 */
	var type = '';
	function getData(){
		$.ajax({
			type:'POST',
			url:domain + '/api/user.info/real_user',
			data:{token:localStorage.token},
			timeout:10000,
			success:function(res){
				var data = JSON.parse(res);
				switch(parseInt(data.iden_type)){
					case 1:
						$('.head-left img').attr('src',domain+data.avatar);
						$('#basics-type').text('已认证');
						$('#cates-type').text('已认证');
						$('#cates-photos').hide();
						$('#user-name').text(data.nickname);
						$('#true-name em').text(data.real_name);
						var id_nums = data.id_number.replace(data.id_number.slice(3,15),'************');
						$('#true-num em').text(id_nums);
						$('#id-number').text(id_nums);
						if(data.real_sex == 1){
									$('#true-sex em').text('男')
								}else if(data.real_sex == 2){
									$('#true-sex em').text('女');
								}else{
									$('#true-sex em').text('保密');
								}
						type = 1;
						break;
					case 2:
						$('.head-left img').attr('src',domain+data.avatar);
						$('#basics-type').text('未认证');
						$('#cates-type').text('未认证');
						type = 2;
						break;
					case 3:
						$('.head-left img').attr('src',domain+data.avatar);
						$('#basics-type').text('审核中');
						$('#cates-type').text('审核中');
						$('#cates-photos').hide();
						$('#true-name em').text(data.real_name);
						var id_nums = data.id_number.replace(data.id_number.slice(3,15),'************');
						$('#true-num em').text(id_nums);
						if(data.real_sex == 1){
							$('#true-sex em').text('男')
						}else if(data.real_sex == 2){
							$('#true-sex em').text('女');
						}else{
							$('#true-sex em').text('保密');
						}
						type = 3;
						break;
					case 4:
						$('.head-left img').attr('src',domain+data.avatar);
						$('#basics-type').text('认证失败');
						$('#cates-type').text('认证失败,重新上传');
						type = 4;
						break;
				}
			}
		});
	}
	getData();

	/**
	 * @Author      gaojian
	 * @DateTime    2018-06-08
	 * @version     1.0.0
	 * @description 真实姓名、身份证输入
	 */
	
	$('.inputs').click(function(){
		if(type == 1 || type == 3) return;
		var name = $(this).children('span').text();
		var _this = $(this);
		mprompt('请输入'+name,'',name,function(value){
				if(value == 'cancel') return;
				_this.children('em').text(value);
			});
		})

	/**
	 * @Author      gaojian
	 * @DateTime    2018-06-08
	 * @version     1.0.0
	 * @description 性别选择
	 */
	
	$('#true-sex').click(function(){
		if(type == 1 || type == 3) return;
		var obj = {
				title: "修改性别",
				cancel: "取消",
				buttons: [{title: "男"},{title:"女"},{title:"保密"}]
			}
		actionSheet(obj,function(index){
				if(index == 1){
					$('#true-sex em').text('男');
				}else if(index == 2){
					$('#true-sex em').text('女');
				}else if(index == 3){
					$('#true-sex em').text('保密');
				}else if(index == 'cancel'){
					return;
				}
			})
		})

	/**
	 * @Author      gaojian
	 * @DateTime    2018-06-08
	 * @version     1.0.0
	 * @description 性别选择
	 */
	
	$('.upload-photo').click(function(){
			var obj = {
				title: '上传证件',
				cancel: '取消',
				buttons: [{title:'拍照'},{title:'从手机相册选取'}]
			}
			var url = domain + '/api/user.info/idphone';
			var _this = $(this);
			var name = $(this).attr('data-name');
			var name = name.substr(0,11);
			actionSheet(obj,function(index){
				if(index == 1){
					//拍照
					getImageByCamera(function(imgPath){
						if(typeof imgPath == 'object' || imgPath == 'cancel') return;
						uploadFile(url,name,imgPath,{'token':localStorage.token},function(data){
							var data = JSON.parse(data);
							if(data == 'err') return;
							_this.attr('src',domain+data.url+data.img_name);
							_this.attr('data-img',data.img_name);
						})
					})
				}else if(index == 2){
					//相册选取
					getImageByGallery(function(imgPath){
						console.log(JSON.stringify(imgPath));
						if(typeof imgPath == 'object' || imgPath == 'cancel') return;
						uploadFile(url,name,imgPath,{'token':localStorage.token},function(data){
							console.log(data);
							var data = JSON.parse(data);
							if(data == 'err') return;
							_this.attr('src',domain+data.url+data.img_name);
							_this.attr('data-img',data.img_name);
						})
					})
				}else if(index == 'cancel'){
					return;
				}
			})
		})

	/**
	 * @Author      gaojian
	 * @DateTime    2018-06-08
	 * @version     1.0.0
	 * @description 页面提交
	 */
	
	$('#true-submits').click(function(){
			var name = $('#true-name em').text();
			var sex = $('#true-sex em').text();
			if(sex == '男'){
				sex = 1;
			}else if(sex == '女'){
				sex = 2;
			}else{
				sex = 3;
			}
			var num = $('#true-num em').text();
			var data = $('.upload-photo');
			var arr = [];
			for(i = 0 ; i < data.length ; i ++){
				arr[i] = data[i].getAttribute('data-img');
			}
			// 非空判断
			if(name == null || name == ""){
				mui.toast('姓名不可为空');return;
			}
			if(sex == null || sex == ""){
				mui.toast('性别不可为空');return;
			}
			if(num == null || num == ""){
				mui.toast('身份证号不可为空');return;
			}
			if(!/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(num)){
				mui.toast('身份证输入不正确');return;
			}
			$.ajax({
				type:'POST',
				url:domain + '/api/user.info/real_name',
				data:{
					token:localStorage.token,
					'real_name':name,
					'real_sex':sex,
					'id_number':num,
					'idphone':JSON.stringify(arr)
				},
				timeout:10000,
				success:function(responds){
					var data = JSON.parse(responds);
					if(data == 1){
						mui.toast('提交成功');
						mui.back();
					}else if(data == 2){
						mui.toast('提交失败,请重试');
					}else if(data == 3){
						mui.toast('请完善信息');
					}
				}
			})
		})

	})
})
});