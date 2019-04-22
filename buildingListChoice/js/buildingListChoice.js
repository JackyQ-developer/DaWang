mui.plusReady(function(){
	//出售
	$('#saleofOfficeBuildingsList').click(function(){
		mui.openWindow({
			url:'../saleofOfficeBuildingsList/saleofOfficeBuildingsList.html',
			id:'saleofOfficeBuildingsList',
			waiting: {
				autoShow: false
			}
		})
	});
	//出租
	$('#officeRentalList').click(function(){
		mui.openWindow({
			url:'../officeRentalList/officeRentalList.html',
			id:'officeRentalList',
			waiting: {
				autoShow: false
			}
		})
	});
});
