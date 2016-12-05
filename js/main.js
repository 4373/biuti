/**
 * 
 * by meihuan 
 * 
 */

var biuti = angular.module('biuti', ['ui.router'])

biuti.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.when('', '/main/home');

	$stateProvider
		.state('main', { /////主要功能页面
			url: '/main',
			templateUrl: 'page/main.html'
		})
		.state('main.home', {////主页
			url: '/home',
			templateUrl: 'page/home.html',
			controller: 'homeCtrl'
		})
		.state('main.list', {///  分类页
			url: '/list',
			templateUrl: 'page/list.html',
			controller: 'listCtrl'
		})
		.state('main.limit', {//限时特卖
			url: '/limit',
			templateUrl: 'page/limit.html',
			controller: 'limitCtrl'
		})
		.state('main.car', {//购物车
			url: '/car',
			templateUrl: 'page/car.html',
			controller: 'carCtrl'
		})
		.state('main.my', {//个人中心
			url: '/my',
			templateUrl: 'page/my.html',
			controller: 'myCtrl'
		})
	// .state('main.my', {
	// 	url: '/my',
	// 	templateUrl: '../page/my.html'
	// })



	$stateProvider.state('classinfo', { //商品类别显示
		url: '/classinfo',
		templateUrl: 'page/classinfo.html',
		controller: 'classinfoCtrl'
	});
	$stateProvider.state('details', {//详情
		url: '/details',
		templateUrl: 'page/details.html',
		controller: 'detailsCtrl'
	})


}])

biuti.controller('mainCtrl', ['$scope', '$location', 'ShopCar', '$interval','$timeout', '$http', 'collectAndScanned', function ($scope, $location, ShopCar, $interval,$timeout, $http, collectAndScanned) {


	$scope.info = {
		now: 'home',//当前页面为主页

		username: 0,//当前用户名未登录的话为零
		shopCarCount: 0,
		collect: 0,//我的收藏
		scanned: 0,//浏览记录
		point: 0,//会员积分
		showLogin: false,//显示登陆
		showRegister: false,//显示注册
		showSetting: false,//显示设置
		showMessage: false,//显示消息
		showSearch: false,//搜索
		showCollect: false,//收藏
		// showGoodattr: false,//
		// showConmmet: false,
		searchClass: 'mianmo',//搜索的种类，比如点击面膜，男士专区，孕婴专区等,用作跳转
		detailsID: ''  //商品详情id ,用作商品详情跳转
	}

	
	//获取商品id   ，为跳转详情做准备
	$scope.goDetails=function(i){
		$scope.info.detailsID=i;
		$location.path('/details')
	}

	//提示信息
	$scope.message={
		show:false,
		text:''
	}
	var timer=null;
	$scope.setMessage=function(txt){
		$timeout.cancel(timer);
		$scope.message.text=txt;
		$scope.message.show=true;
		timer=$timeout(function(){
			$scope.message.show=false;
		},1500)
	}

	//搜索页面
	$scope.hotSearch = {
		'mianmo':'热卖面膜',
		'caizhuang':'幻彩化妆品',
		'gerenhuli':'个人用品',
		'jiankangmeiji':'肌肤保养',
		'mianbuhuli':'面部护理',
		'nanshizhuanqu':'男士用品',
		'xiangshui':'奇幻香水',
		'yunyinghuli':'母子用品'
	};
	$scope.addHistory = function (str) {
		
		if (str===undefined || str.indexOf(' ') == -1) return;

		var data = JSON.parse(localStorage.getItem('searchHistory'));
		//如果有历史记录
		if (data) {
			for (var i = 0; i < data.length; i++) {
				if (data[i] === str) {//如果该搜索已被记录
					localStorage.setItem('searchHistory', JSON.stringify(data));
					return;
				}
			}
			data.push(str);
			localStorage.setItem('searchHistory', JSON.stringify(data));
		} else {//如果没有记录
			data = [];
			data.push(str);
			localStorage.setItem('searchHistory', JSON.stringify(data));
		}
		$scope.history = $scope.getHistory();
	};
	$scope.getHistory = function () {
		return JSON.parse(localStorage.getItem('searchHistory'));
	};
	$scope.clearHistory = function () {
		localStorage.clear('searchHistory');
		$scope.history = $scope.getHistory();
	}
	$scope.history = $scope.getHistory();



	//登出
	$scope.exit = function () {
		localStorage.removeItem('username');
		$scope.info.username = 0;
		$scope.info.shopCarCount = ShopCar.query($scope.info.username, true);
		$scope.info.scanned = collectAndScanned.query($scope.info.username, false, true);
		$scope.info.collect = collectAndScanned.query($scope.info.username, true, true)
		$scope.info.showSetting = false;
		$scope.setMessage('已退出登录')
	}
	//自动登陆
	if (localStorage.getItem('username')) {
		$scope.info.username = localStorage.getItem('username');
		$scope.setMessage('欢迎回来'+$scope.info.username)

	}

	$scope.info.shopCarCount = ShopCar.query($scope.info.username, true);
	$scope.info.collect = collectAndScanned.query($scope.info.username, true, true);
	$scope.info.scanned = collectAndScanned.query($scope.info.username, false, true);


	$scope.login = function (username, pwd) {
		var flag = false;
		$http.get('data/user.json').success(function (data) {
			console.log(data);
			for (var i = 0; i < data.length; i++) {
				if (username == data[i].username && pwd == data[i].password) {
					$scope.info.username = data[i].username;
					localStorage.setItem('username', data[i].username);
					$scope.info.showLogin = false;
					flag = true;
					$scope.info.shopCarCount = ShopCar.query($scope.info.username, true);
					$scope.info.collect = collectAndScanned.query($scope.info.username, true, true);
					$scope.info.scanned = collectAndScanned.query($scope.info.username, false, true);
					$scope.setMessage('登陆成功！')
					return
				}
			};
			if (!flag) $scope.setMessage('用户名或密码错误')
		})
	}
	//注册
	$scope.regisinfo = "获取验证码";
	var yzmtimer = null;
	$scope.getyzm = function (data) {
		if (!(/^1[34578]\d{9}$/.test(data))) {
			$scope.setMessage('手机号码有误，请您检查')
			return false;
		}
		$scope.isSubmitted = true;
		var time = 60;
		yzmtimer = $interval(function () {
			time--;
			if (time < 0) {
				$scope.regisinfo = "获取验证码";
				$interval.cancel(yzmtimer);
				$scope.isSubmitted = false;
			}
			else {
				$scope.regisinfo = "已发送(" + time + ")";
			}
		}, 1000)
	}

	//加入购物车
	$scope.addCar = function (d) {
		ShopCar.add($scope.info.username, d);
		$scope.setMessage('添加购物车成功')
		$scope.info.shopCarCount = ShopCar.query($scope.info.username, true);
	}


	//我的收藏和浏览记录
	$scope.cs = {
		title: '',
		tip: '',
		now: new Date().toLocaleDateString()
	}
	$scope.isEmptyObj = function (e) {
		var t;
		for (t in e)
			return !1;
		return !0
	}
	$scope.time = "剩余 00 天 00 : 00 : 00";
    $interval(function () {
        $scope.time = timeEnd('2016/10/28 23:00:00')
    }, 1000)
	$scope.showCollectScanned = function (iscollect) {
		$scope.myData = {};
		$scope.info.showCollect = true;
		var data = collectAndScanned.query($scope.info.username, iscollect, false)
		$scope.cs.title = iscollect ? '我的收藏' : '浏览记录';
		$scope.cs.tip = iscollect ? '收藏' : '浏览';
		console.log(data);
		if (data != 0) {
			var date = [];
			for (var i = 0; i < data.length; i++) {
				//以key为浏览时间，value为浏览的每条数据创建$scope.myData对象
				if (!$scope.myData[data[i].date]) {//如果某个日期中没有数据 （如果 $scope.myData."2016/10/10" 中没有数据）
					$scope.myData[data[i].date] = [];	//则把他定义为数组，以便往里面push数据 $scope.myData."2016/10/10"=[]				
				}
				//如果有数据直接push 
				$scope.myData[data[i].date].push(data[i]);//$scope.myData."2016/10/10"=[ {},{},... ]
			}
		}
	}
	$scope.clearCollectScanned = function (iscollect) {
		iscollect = iscollect == '我的收藏';
		collectAndScanned.remove($scope.info.username, iscollect);
		$scope.myData = {};
		$scope.info.collect = collectAndScanned.query($scope.info.username, true, true);
		$scope.info.scanned = collectAndScanned.query($scope.info.username, false, true);

	}





}])