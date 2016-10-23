biuti.controller('carCtrl', ['$scope', 'ShopCar', function ($scope, ShopCar) {

    $scope.carData = [];
    $scope.info.now='car';
    var len = $scope.carData.length;
    var arr = [];
    var total = 0;
    var c = 0;

    $scope.load = function () {
        var all = ShopCar.query($scope.info.username, false);
        if(all===null){//
            return;
        }
        for (var i = 0; i < all.length; i++) {
            var d = {};
            d.id = all[i].id;
            d.storeName = all[i].storeName;
            d.name = all[i].name;
            d.price = all[i].price;
            d.img = all[i].img;
            d.count = all[i].count;
            $scope.carData.push(d);


            $scope.all.countArr[i] = all[i].count;
            $scope.all.price += all[i].price * all[i].count;
            $scope.all.count += all[i].count;

        }

    }

    $scope.all = {
        countArr: [],
        price: 0,
        count: 0
    }

    $scope.add = function (i) {
        $scope.all.countArr[i]++;
    }

    $scope.aqq = function (i) {
        if ($scope.all.countArr[i] == 1) {
            $scope.all.countArr[i]--;
            ShopCar.remove($scope.info.username, $scope.carData[i].id);
        } else {
            $scope.all.countArr[i]--;

        }
    }
    $scope.blur=function(i){
        if($scope.all.countArr[i]===null){
            $scope.all.countArr[i]=1;       
        }
    }
    $scope.$watch("all.countArr", function (ne, old) {
        for (var i = 0; i < ne.length; i++) {
            if (ne[i] < 0 || isNaN(ne[i])) {
                $scope.all.countArr[i] = old[i];
            }
        }
        getTotal();
    }, true);

    var getTotal = function () {
        $scope.all.price = 0;
        $scope.all.count = 0;
        var data = [];

        for (var i = 0; i < $scope.carData.length; i++) {
            //更新总价和数量
            $scope.all.price += $scope.carData[i].price * $scope.all.countArr[i];
            $scope.all.count += $scope.all.countArr[i];
            if ($scope.all.countArr[i] != 0) {
                var d = {};
                d.id = $scope.carData[i].id;
                d.name = $scope.carData[i].name;
                d.storeName = $scope.carData[i].storeName;
                d.img = $scope.carData[i].img;
                d.price = $scope.carData[i].price;
                d.count = $scope.all.countArr[i];
                data.push(d);
            }
        }
        ShopCar.update($scope.info.username, data);
        $scope.info.shopCarCount=$scope.all.count;
        return $scope.all.price;
    }

    $scope.load();

}])




