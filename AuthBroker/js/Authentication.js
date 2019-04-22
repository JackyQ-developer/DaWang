$(function(){
	// mui.plusReady(function(){
	// plus.webview.currentWebview().setStyle({scrollIndicator:'none'});

	/**
	 * @Author      gaojian
	 * @DateTime    2018-06-11
	 * @version     1.0.0
	 * @description 认证状态判断
	 */
	var submitData = {
		token: localStorage.token,
		work_area_id:'',	//工作区域ID
		micro_img:'',		//头像
		wechat_img:''		//微信名片二维码
	}
	function getData(){
		$.ajax({
			type:'POST',
			url:domain + '/api/user.info/broker_info',
			data:{
				token:localStorage.token
			},
			timeout:10000,
			success:function(res){
				console.log(res);
				var data = JSON.parse(res);
				if(data.state == 3){
					alert('请先完成实名认证');
					mui.back();
				}
				switch(parseInt(data.broker_type)){
					case 1:
						$('#user-name').text(data.real_name);
						$('#mobile').text(data.mobile);
						$('#micro_img').attr('src',domain+data.url+data.micro_img);
						$('#wechat_img').attr('src',domain+data.url+data.wechat_img);
						$('#areaText').text(data.area_name);

						$('#true-submits').text('提交修改资料');
						submitData.work_area_id = data.area_id;
						submitData.micro_img = data.micro_img;
						submitData.wechat_img = data.wechat_img;
						break;
					case 2:
						$('#user-name').text(data.real_name);
						$('#mobile').text(data.mobile);
						break;
					case 3:
						$('#user-name').text(data.real_name);
						$('#mobile').text(data.mobile);
						$('#micro_img').attr('src',domain+data.url+data.micro_img);
						$('#wechat_img').attr('src',domain+data.url+data.wechat_img);
						$('#areaText').text(data.area_name);

						$('.notice').text('资料审核中');
						$('#true-submits').hide();
						$('.icon-qianjinjiantou').hide();
						$('.upload-photo').unbind('click');
						$('#workArea').unbind('click');
						break;
					case 4:
						$('#user-name').text(data.real_name);
						$('.notice').text('认证失败，请重新提交资料');
						$('#mobile').text(data.mobile);
						break;
					default:
						break;
				}
			}
		});
	}
	getData();

	/**
	 * @Author      JackyQ
	 * @DateTime    2018-07-04
	 * @version     1.0.0
	 * @description 证件照上传
	 */
	$('.upload-photo').click(function(){
		var _this = $(this);
		var type = $(this).attr('data-type');
		var url = domain+'/api/user.info/headPtt';
		var name = 'broker_tmp';
		//相册选取
		getImageByGallery(function(imgPath){
			if(typeof imgPath == 'object' || imgPath == 'cancel') return;
			uploadFile(url,name,imgPath,{'token':localStorage.token},function(data){
				var data = JSON.parse(data);
				if(data == 'err') return mui.toast('网络拥堵，请稍候重试');
				_this.attr('src',domain+data.url+data.img_name);
				submitData[type] = data.img_name;
			})
		})
	});

	/**
	 * @Author      gaojian
	 * @DateTime    2018-06-08
	 * @version     1.0.0
	 * @description 页面提交
	 */
	setTimeout(function(){
		console.log(JSON.stringify(submitData));
	},10000);
	$('#true-submits').click(function(){
		if(submitData.work_area_id == ''){
			mui.toast('请选择您的工作区域');
			return;
		}else if(submitData.micro_img == ''){
			mui.toast('请上传您的真实头像');
			return;
		}else if(submitData.wechat_img == ''){
			mui.toast('请上传您的微信名片');
			return;
		}
		$.ajax({
			type:'POST',
			url:domain + '/api/user.info/broker_add',
			data:submitData,
			timeout:10000,
			success:function(response){
				var data = JSON.parse(response);
				if(data == 1){
					mui.toast('提交成功');
					mui.back();
				}else if(data == 2){
					mui.toast('提交失败');
				}else if(data == 3){
					mui.toast('请完善信息');
				}else{
					mui.toast('网络拥堵，请稍候重试');
				}
			}
		})
	});

	/**
	 * @Author      JackyQ
	 * @DateTime    2018-07-04
	 * @version     1.0.0
	 * @description 工作区域选择
	 */
	var area = JSON.parse(localStorage.area);
	$('#workArea').click(function(event) {
		selectMap(2,area,function(SelectedItems){
			var work_area_id = SelectedItems[SelectedItems.length-1].value;
			submitData.work_area_id = work_area_id;
			if(SelectedItems.length == 1){
				var text = '呼和浩特  '+SelectedItems[SelectedItems.length-1].text;
				$('#areaText').text(text);
			}else{
				var text = '呼和浩特  '+SelectedItems[SelectedItems.length-2].text + '  '+SelectedItems[SelectedItems.length-1].text;
				$('#areaText').text(text);
			}
		});
	});

	// })
})