biuti.controller("homeCtrl", ["$scope", '$http', '$location', 'searchResult','$timeout', '$interval',  'ShopCar', '$document', function ($scope, $http, $location, searchResult,$timeout, $interval, ShopCar, $document) {
	$scope.info.now='home'
	
	//限时特卖
	$scope.timesSale = [];
	//获取限时特卖
	$http.get('data/index/limitSale.json').success(function (data) {
		for (var i = 0; i < data.length; i++) {
			var d = {};
			d.bgimg = 'http://cn01.alicdn.sasa.com/' + data[i].bgimg;
			d.dataname = data[i].dataname;
			d.discount = data[i].discount;
			d.price = data[i].price;
			d.oldprice = data[i].oldprice;
			d.productid = data[i].productid;
			d.id = data[i].productid;
			d.img = 'http://cn01.alicdn.sasa.com/' + data[i].iconimg;
			d.name = data[i].dataname;
			d.storeName = '';
			$scope.timesSale.push(d);
		}
	});
	//限时特卖时间
	$scope.time = "剩余 00 : 00 : 00";
	$interval(function () {
		$scope.time = timeEnd('2016/10/30 09:00', true)
	}, 1000)
	//点击查看更多特卖
	$scope.toLimitSale = function () {
		$location.path('/main/limit')
	}
	//点击加入购物车
	$scope.addCar = function (d) {
		ShopCar.add($scope.info.username, d);
		$scope.setMessage('添加购物车成功')
		$scope.info.shopCarCount = ShopCar.query($scope.info.username, true);
	}

	//轮播图
	//主页banner图
	$scope.banner = {
		"99bf0c44-e6bf-4e59-8644-c45b4c2310ae":'data/banner/1/0.jpg',
		"a21fbb07-1b03-4e90-80e3-613a67138a23":'data/banner/2/0.jpg',
		"038d3183-c96f-4a7c-9f19-9ad398e40451":'data/banner/3/0.jpg',
		"82534bf9-1802-4ade-9db8-71e7819c52a2":'data/banner/4/0.jpg',
		"07d3a288-4283-43c5-9a69-2f249579778f":'data/banner/5/0.jpg',
		"a51d5068-83a2-4bfd-b5c7-59f61beb1730":'data/banner/6/0.jpg',
		"804e902c-fe52-479b-a65c-7e196d8687a9":'data/banner/7/0.jpg',
		"548de378-65c2-4eef-9aed-b7786443200c":'data/banner/8/0.jpg',

	};
	$timeout(function(){
		$scope.swiper = new Swiper('.swiper-container', {
			direction: 'horizontal',
			loop: true,
			autoplay: 3000,
			autoplayDisableOnInteraction: false,
			// 如果需要分页器
			pagination: '.swiper-pagination'
		})
	},100)

	
	//热卖单品
	$scope.hotSale = [];
	$scope.orderBy = ['销售', '人气', '评分', '价格', '最新'];
	$scope.active = $scope.orderBy[0];
	searchResult.get('data/index/xs-hotSale1.json', $scope, 'hotSale')

	$scope.sort = function (d) {
		$scope.active = d;
		switch (d) {
			case '销售':
				searchResult.get('data/index/xs-hotSale1.json', $scope, 'hotSale');
				break;
			case '人气':
				searchResult.get('data/index/rq-hotSale1.json', $scope, 'hotSale');
				break;
			case '评分':
				searchResult.get('data/index/pf-hotSale1.json', $scope, 'hotSale');
				break;
			case '价格':
				searchResult.get('data/index/jg-hotSale1.json', $scope, 'hotSale');
				break;
			case '最新':
				searchResult.get('data/index/zx-hotSale1.json', $scope, 'hotSale');;
				break;
		}
	}







}]);

