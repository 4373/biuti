biuti.controller("limitCtrl", ['$rootScope',"$scope", "$http", '$interval','ShopCar', function ($rootScope,$scope, $http, $interval,ShopCar) {
    $scope.info.now='special'

    //http://cn01.alicdn.biuti.com/
    $http.get('data/limitSale.json').success(function (data) {
        $scope.special = [];
        $scope.special2 = [];
        for (var i = 0; i < 10; i++) {
            $scope.special.push(data.salelist[i]);
        };
        for (var i = 10; i < 20; i++) {
            $scope.special2.push(data.salelist[i]);
        };

    });
    var num=1;

    
	function loaddata (begin,$scope,data) {
		for (var i=10*begin;i<10*(begin+1);i++) {
			$scope.special2.push(data.salelist[i]);
		};
	}
    $scope.time = "剩余 00 : 00 : 00";
    $interval(function () {
        $scope.time = timeEnd('2018/11/10 18:00:00', true)
    }, 1000);

    $scope.addCar=function(d){
        $scope.setMessage('添加购物车成功')
        var data={};
        data.id=d.productid;
        data.img="http://cn01.alicdn.sasa.com/"+d.iconimg;
        data.price=d.price;
        data.name=d.dataname;
        ShopCar.add($scope.info.username,data);
        $scope.info.shopCarCount=ShopCar.query($scope.info.username,true)
    }
}]);