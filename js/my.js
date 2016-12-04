biuti.controller('myCtrl',['$scope','collectAndScanned',function($scope,collectAndScanned){
    	$scope.info.now='my';
		$scope.info.scanned=collectAndScanned.query($scope.info.username,false,true);
		$scope.info.collect=collectAndScanned.query($scope.info.username,true,true)		
}])