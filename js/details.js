
biuti.controller('detailsCtrl', ["$scope", "$http", "$location", "$sce", '$interval', '$timeout', 'collectAndScanned', 'ShopCar', function ($scope, $http, $location, $sce, $interval, $timeout, collectAndScanned, ShopCar) {
    $scope.urlKind = {
        details: 'data/details/' + $scope.info.detailsID + '/getProductDetailInfo.json',
        commonts: 'data/details/' + $scope.info.detailsID + '/getProducECCommentList.json',
        promotion: 'data/details/' + $scope.info.detailsID + '/getPorductDetailTag.json',
    }
    $scope.urlData = { //全部详情
        details: null,
        commonts: null,
        promotion: null,
    }
    $scope.dataForAddCar = {};//简约的详情，   为了添加购物车  或者收藏  或者浏览记录

	$scope.details = {
		commonts: false,
		goodsattr: false
	}

	$scope.isCollect = false;//是否收藏

	$scope.isnull = true;//判断有没有收录该商品的详情


	$interval(function(){
        $scope.time=timeEnd('2016/11/6 18:00:00')
    },1000)
	//退出详情页
    $scope.back = function () {
        window.history.back();
    }


	//详细信息*****************************************************  获取详细信息第一页
	$http.get($scope.urlKind.details).success(function (data) {
		$scope.isnull = false;

		$scope.dataForAddCar.id = data.id;
		$scope.dataForAddCar.name = data.name;
		$scope.dataForAddCar.img = 'http://cn01.alicdn.sasa.com/' + data.img;
		$scope.dataForAddCar.storeName = data.storeName;
		$scope.dataForAddCar.price = data.price;
		$scope.dataForAddCar.killendtime = !!data.endtime;
		$scope.dataForAddCar.oldPrice = data.oldPrice;
		$scope.dataForAddCar.discount = data.discount;
		for (var i = 0; i < data.attribute.length; i++) {
			if (data.attribute[i].alias == 'countryOfOriginC') {
				$scope.dataForAddCar.placename = data.attribute[i].value;
			}
		}
		//加入浏览记录
		collectAndScanned.add($scope.info.username, false, $scope.dataForAddCar)
		$scope.info.scanned = collectAndScanned.query($scope.info.username, false, true)

		//用来渲染页面的数据
        $scope.urlData.details = data;

		$timeout(function () {
			var mySwiper = new Swiper('.swiper-container', {
				pagination: '.swiper-pagination',
				autoplay: 1000,
				loop: true,
			})

			// $('.level').each(function  () {
			// 	var level=$(this).attr('data-level');
			// 	$(this).addClass('le'+level);
			// })
			// $('.time').each(function  () {
			// 	var time=new Date(parseInt($(this).text()) * 1000).toLocaleString().substring(0,9);
			// 	var timeArr=time.split('/');
			// 	time=timeArr[0]+'年'+timeArr[1]+'月'+timeArr[2]+'日';
			// 	$(this).text(time);
			// })	

		}, 50)


		//获取评论信息
		$http.get($scope.urlKind.commonts).success(function (data2) {
			$scope.urlData.commonts = data2;
		})

		//获取促销信息
		$http.get($scope.urlKind.promotion).success(function (data3) {
			$scope.promotion = data3;
		})


		//评论******************************************************
		$http.get($scope.urlKind.commonts).success(function (data) {
			$scope.commentss = data;

		})


		//商品属性 ************************************************************
		$http.get($scope.urlKind.details).success(function (data) {
			$scope.goodsPara = data;
			$scope.goodsPara.desc = $sce.trustAsHtml($scope.goodsPara.desc);
		})
		$scope.cNow = true;


	});


	//加入收藏
	$scope.collectIt = function () {
		if ($scope.isCollect) return
		$scope.setMessage('成功添加收藏');
		$scope.isCollect = true;
		collectAndScanned.add($scope.info.username, true, $scope.dataForAddCar);
		$scope.info.collect = collectAndScanned.query($scope.info.username, true, true)
		console.log(collectAndScanned.query($scope.info.username, true, true))

	}
	//加入购物车
	$scope.addCar = function () {
		$scope.setMessage('添加购物车成功')
		ShopCar.add($scope.info.username, $scope.dataForAddCar);
		$scope.info.shopCarCount = ShopCar.query($scope.info.username, true);
	}


}])

