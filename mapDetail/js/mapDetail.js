mui.plusReady(function(){
	var self = plus.webview.currentWebview();
		//地图初始化
		var map = new BMap.Map("map-container");
		// 创建地图实例
		
		var point = new BMap.Point(self.log,self.lat);
		// 创建点坐标  
		map.centerAndZoom(point, 18);

		//单独设定图标的样式
		var icon = new BMap.Icon('../public/images/dingwei.png', new BMap.Size(200,200), {
		   anchor: new BMap.Size(70, 30)
		});

		var marker = new BMap.Marker(new BMap.Point(self.log,self.lat), {
			icon: icon
		});
		// var marker = new BMap.Marker(point);        // 创建标注    
		map.addOverlay(marker);                     // 将标注添加到地图中

		map.panTo(self.log,self.lat);

		//比例尺控件
		map.addControl(new BMap.ScaleControl());
		$('#phonemap').click(function(){
			// 获取当前定位
			getPosition(function(e){
				if(e.status == 'successed'){
					var zlog = e.longitude;
					var zlat = e.latitude;
					var point2 = new plus.maps.Point(zlog,zlat);
					var point1 = new plus.maps.Point(self.log,self.lat);
					// 调用系统地图显示
					plus.maps.openSysMap(point1,self.name,point2);
				}else{
					console.log(e.message);
					mui.toast('获取当前定位失败,请重试');
				}
			})
		})

		$('.resets').click(function(){
			map.reset();
		})

})