

biuti.controller("listCtrl", ["$scope", "$http", "$anchorScroll", "$location", function ($scope, $http, $anchorScroll, $location) {
	$scope.info.now = 'list'

	$scope.listnow = 'goodslist';

	$scope.bannerlistData = {};
	
	var searchclass=['mianbuhuli','caizhuang','xiangshui','jiankangmeiji','mianmo','gerenhuli','nanshizhuanqu','yunyinghuli']

	

	$http.get('data/list1.json').success(function (data) {

		$scope.nav = data;
		$scope.now = data[0].id;
		console.log(data)
	})
	$scope.navs = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "#"];


	function getBannerlistData() {
		$http.get('data/list2.json').success(function (data) {
			for (var i = 0; i < $scope.navs.length; i++) {
				$scope.bannerlistData[$scope.navs[i]] = [];
				for (var j = 0; j < data.length; j++) {
					if ($scope.navs[i] == data[j].firstword) {
						$scope.bannerlistData[$scope.navs[i]].push(data[j]);
					}
				}
			}
		})
	}

	$scope.getlist = function (data,i) {
		$scope.info.searchClass=searchclass[i]
		$scope.now = data.id;
		
	}

	$scope.goClass=function(){
		console.log($scope.info.searchClass)
		$location.path('classinfo')
	}

	$scope.goodslist = function () {
		$scope.listnow = 'goodslist';
	}
	$scope.bannerlist = function () {
		$scope.listnow = "bannerlist";
		getBannerlistData();
	}
	$scope.change = function (id) {
		$location.hash(id);
		$anchorScroll();
	};
}]);