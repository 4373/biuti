

//http://cn01.alicdn.biuti.com/

biuti.controller("classinfoCtrl", ["$scope", '$http','$location','searchResult','$interval','$rootScope','ShopCar', function ($scope, $http,$location,searchResult,$interval,$rootScope,ShopCar) {
    $scope.searchData =[];

    
    $scope.orderBy=['销售','人气','评分','价格','最新'];
    $scope.active=$scope.orderBy[0];
    searchResult.get('data/class/'+$scope.info.searchClass+'/xs.json',$scope,'searchData');
    $scope.time="剩余 00 天 00 : 00 : 00";
    $interval(function(){
        $scope.time=timeEnd('2016/11/10 23:00:00')
    },1000)

    $scope.sort=function(d){
        $scope.active=d;
        switch(d){
            case '销售':searchResult.get('data/class/'+$scope.info.searchClass+'/xs.json',$scope,'searchData');break;
            case '人气':searchResult.get('data/class/'+$scope.info.searchClass+'/rq.json',$scope,'searchData');break;
            case '评分':searchResult.get('data/class/'+$scope.info.searchClass+'/pf.json',$scope,'searchData');break;
            case '价格':searchResult.get('data/class/'+$scope.info.searchClass+'/jg.json',$scope,'searchData');break;
            case '最新':searchResult.get('data/class/'+$scope.info.searchClass+'/zx.json',$scope,'searchData');;break;
        }
    }

    $scope.addCar=function(data){
        ShopCar.add($scope.info.username,data);
        $scope.info.shopCarCount=ShopCar.query($scope.info.username,true)
         $scope.setMessage('添加购物车成功')
    }
    $scope.back=function(){
        window.history.back();
    }
}]);









