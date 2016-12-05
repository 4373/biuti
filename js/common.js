/**
 * 根据url搜索一类商品
 * 结果会返回给
 */
biuti.factory('searchResult', ['$http', function ($http) {
    return {
        get: function (url, scope, name) {
            $http.get(url).then(function (res) {

                var data = res.data;
                var items = [];
                for (var i = 0; i < data.length; i++) {
                    var d = {};
                    d.id = data[i].id;
                    d.name = data[i].name;
                    d.img = "http://cn01.alicdn.sasa.com/" + data[i].img
                    d.storeName = data[i].storeName;
                    d.killendtime = data[i].killendtime;
                    d.price = data[i].price;
                    d.oldPrice = data[i].oldPrice;
                    d.discount = data[i].discount;
                    d.placename = data[i].placename;
                    items.push(d)
                }
                scope[name] = items;
                return items;
            }, function () {
                console.log('search goods error')
            })
        }
    }
}])
/**
 * 计算倒计时
 * 参数：未来的某个时刻    格式：yyyy/mm/dd hh:mm:ss  
 * 返回字符串
 */
function timeEnd(e, havaDay) {
    var now = new Date();
    var end = new Date(e);
    var t = end - now;
    var d = 0;
    var h = 0;
    var m = 0;
    var s = 0;
    if (t > 0) {
        d = Math.floor(t / 1000 / 60 / 60 / 24);
        h = Math.floor(t / 1000 / 60 / 60 % 24);
        m = Math.floor(t / 1000 / 60 % 60);
        s = Math.floor(t / 1000 % 60);
    }
    if (havaDay) {
        return '剩余 ' + two(h) + " : " + two(m) + " : " + two(s)
    }
    return '剩余 ' + two(d) + ' 天 ' + two(h) + " : " + two(m) + " : " + two(s)
    function two(d) {
        return d > 9 ? d : ('0' + d);
    }
}

//购物车
biuti.factory('ShopCar', [function () {
    return {
        add: function (userid, obj) { //参数:obj 添加的商品详情.
            var data = JSON.parse(localStorage.getItem('shopCarInfo'));

            if (data === null) { //判断shopcarinfo里面是不是空的  
                data = {};
            }
            if (data[userid] === undefined) { //判断存不存在用户id   
                data[userid] = [];

            } else {//如果存在
                for (var i = 0; i < data[userid].length; i++) {
                    if (data[userid][i].id == obj.id) { //如果购物车中存在该商品,直接修改数量
                        data[userid][i].count += 1;
                        localStorage.setItem('shopCarInfo', JSON.stringify(data));
                        return;
                    }
                }
            }
            //如果不存在商品,直接添加
            var goods = {
                id: obj.id,
                name: obj.name,
                storeName: obj.storeName,
                price: obj.price,
                img: obj.img,
                count: 1
            };
            data[userid].push(goods);
            localStorage.setItem('shopCarInfo', JSON.stringify(data));
        },
        update: function (userid, d) {
            var data = JSON.parse(localStorage.getItem('shopCarInfo'));
            if (data && data[userid]) {
                data[userid] = d;
            }
            localStorage.setItem('shopCarInfo', JSON.stringify(data));
        },
        remove: function (userid, goodsid) {
            var data = JSON.parse(localStorage.getItem('shopCarInfo'));
            var newdata = [];
            for (var i = 0; i < data[userid].length; i++) {
                if (data[userid][i].id != goodsid) {
                    newdata.push(data[userid][i]);
                }
            }
            data[userid] = newdata;
            localStorage.setItem('shopCarInfo', JSON.stringify(data));
        },
        query: function (userid, iscount) { //参数:用户名和  是否只求商品总数量,还是详细信息  

            var data = JSON.parse(localStorage.getItem('shopCarInfo'));
            if (!data) {//如果存储中为空
                return 0;
            }
            if (data[userid]) { //如果存在用户id
                if (data[userid].length == 0) { //用户购物车为空
                    return 0;
                } else { //购物车不为空
                    if (iscount) { //如果只需要获取购物车商品总数量
                        count = 0;
                        for (var i = 0; i < data[userid].length; i++) { //循环获取每个商品数量
                            count += data[userid][i].count;
                        }
                        return count;
                    } else { //需要获取每个商品的详细信息
                        return data[userid]; //返回的是一个包含每个商品详细信息的数组
                    }
                }
            }
            return 0;
        }
    }
}])

// biuti.factory('Search', function () {
//     return {

//         addHistory: function (str) {
//             if(str=='') return;
//             var data = JSON.parse(localStorage.getItem('searchHistory'));
//             //如果有历史记录
//             if (data) {
//                 for (var i = 0; i < data.length; i++) {
//                     if (data[i] === str) {//如果该搜索已被记录
//                         localStorage.setItem('searchHistory', JSON.stringify(data));
//                         return;
//                     }
//                 }
//                 data.push(str);
//                 localStorage.setItem('searchHistory', JSON.stringify(data));
//             } else {//如果没有记录
//                 data = [];
//                 data.push(str);
//                 localStorage.setItem('searchHistory', JSON.stringify(data));
//             }
//         },
//         clearHistory: function () {
//             localStorage.clearItem('searchHistory');
//         }
//     }
// })

//收藏与浏览记录
biuti.factory('collectAndScanned', function () {
    return {
        query: function (userid, type, iscount) {
            type = type ? 'collect' : 'scanned';
            var data = JSON.parse(localStorage.getItem(type));
            if (!data) {//如果存储中为空
                return 0;
            }
            if (data[userid]) { //如果存在用户id
                if (iscount) {
                    return data[userid].length;
                }
                else {
                    return data[userid].length == 0 ? 0 : data[userid];
                }

            }
            return 0;
        },
        add: function (userid, type, obj) {
            type = type ? 'collect' : 'scanned';
            var data = JSON.parse(localStorage.getItem(type));
            if (data === null) { //  
                data = {};
            }
            if (data[userid] === undefined) { //判断存不存在用户id   
                data[userid] = [];

            } else {//如果存在
                for (var i = 0; i < data[userid].length; i++) {
                    if (data[userid][i].id == obj.id) { //
                        if(data[userid][i].date==new Date().toLocaleDateString()){
                            return;
                        }else{
                            data[userid][i].date=new Date().toLocaleDateString();
                            localStorage.setItem(type, JSON.stringify(data));
                            return
                        }
                        
                    }
                }
            }
            //如果不存在商品,直接添加
            var d = {};
            d.id = obj.id;
            d.name = obj.name;
            d.img = obj.img
            d.storeName = obj.storeName;
            d.killendtime = obj.killendtime;
            d.price = obj.price;
            d.oldPrice = obj.oldPrice;
            d.discount = obj.discount;
            d.placename = obj.placename;
            d.date=new Date().toLocaleDateString();
            console.log(d.date)
            data[userid].unshift(d);
            localStorage.setItem(type, JSON.stringify(data));
        },
        remove: function (id, type) {
            type = type ? 'collect' : 'scanned';
            var data = JSON.parse(localStorage.getItem(type));
            var newdata = {}
            for (var i in data) {
                if (i != id) {
                    newdata[i] = data[i];
                }
            }
            localStorage.setItem(type, JSON.stringify(newdata));
        }
    }
})


//指令



biuti.directive('search',function(){
    return {
        restrict:'E',
        templateUrl:'page/directive/search.html',
        replace:false
    }
}).directive('login',function(){
    return {
        restrict:'E',
        templateUrl:'page/directive/login.html',
        replace:false
    }
}).directive('register',function(){
    return {
        restrict:'E',
        templateUrl:'page/directive/register.html',
        replace:false
    }
}).directive('setting',function(){
    return {
        restrict:'E',
        templateUrl:'page/directive/setting.html',
        replace:false
    }
}).directive('message',function(){
    return {
        restrict:'E',
        templateUrl:'page/directive/message.html',
        replace:false
    }
}).directive('collectScan',function(){
    return {
        restrict:'E',
        templateUrl:'page/directive/collect-scan.html',
        replace:false
    }
})
