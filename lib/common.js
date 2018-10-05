
/**
 * Created by ji on 2017/10/18.
 */
//全局变量配置  比如 ajax url的 'http://localhost:8080';

// var MAIN_URL = "http://192.168.100.231:8100";
var MAIN_URL = "http://117.34.80.112:8080";

// var MAIN_IMG = "http://117.34.105.198:8888";
var MAIN_IMG = "http://117.34.80.112:8888";
$(document).ready(function () {

    $('#headPortrait').click(function () {
        location.href = "/html/home.html";
    });
    //我的购物车
    $("#shopCar").click(function (e) {
        e.stopPropagation();
        location.href = "/html/shopping_car.html";
    });
    //我的优品
    $("#myCenter").click(function (e) {
        e.stopPropagation();
        location.href = "/html/center/center.html";
    });
    //我的收藏
    $("#gotocollection").click(function (e) {
        e.stopPropagation();
        location.href = "/html/center/mycollection.html";
    });
    //我的地址
    $("#gotoadress").click(function (e) {
        e.stopPropagation();
        location.href = "/html/center/account-setting-address.html";
    });
    //我的地址
    $("#gotoasetacount").click(function (e) {
        e.stopPropagation();
        location.href = "/html/center/accountSetting.html";
    });
    //我的订单
    $("#order").click(function (e) {
        e.stopPropagation();
        location.href = "/html/center/myorder.html";
    });

    //欢迎首页
    $("#homePage").click(function (e) {
        e.stopPropagation();
        location.href = "/html/home.html";
    });
    //欢迎首页
    $("#homePage1").click(function (e) {
        e.stopPropagation();
        location.href = "/html/home.html";
    });
    //个人中心首页
    $("#centerhomePage").click(function (e) {
        e.stopPropagation();
        location.href = "/html/center/center.html";
    });
    $(".phone_yp").click(function (e) {
        e.stopPropagation();
        window.alert("暂未开通");
    });
    //个人中心账户设置
    $("#accountSetting").click(function (e) {
        e.stopPropagation();
        location.href = "/html/center/account-setting-basic.html";
    });
    //购物车继续购物
    $("#goPage").click(function (e) {
        e.stopPropagation();
        location.href = "/html/home.html";
    });
    //消息
    $("#information").click(function (e) {
        e.stopPropagation();
        // location.href="/pc/html/center/account-setting-basic.html";
    });
    $("#signName").click(function (e) {
        e.stopPropagation();
        location.href = "/html/center/center.html";
    });
    var sid = getSessionData('sid');
    if (!!sid) {
        getDom('#signName').style.display = 'inline-block';
        getDom('#signName').textContent = getSessionData('loginName');
        getDom('#signOut').style.display = 'initial';
        getDom('#login').style.display = 'none';
        getDom('#register').style.display = 'none';
        // getDom('#windowlogin').style.display = 'none';

    }
    $("#signOut").click(function (e) {
        // console.log(111);
        e.stopPropagation();
        $.ajax({
            type: 'post',
            url: MAIN_URL + "/pc/login/loginOut",
            dataType: 'json',
            success: function (res) {
                if (res.success == "success") {
                    layui.use(['layer', 'form'], function () {
                        layer.msg(res.message);
                    });
                    setSessionData('sid', "");
                    setSessionData('loginName', "");
                    getDom('#login').style.display = 'initial';
                    getDom('#register').style.display = 'initial';
                    getDom('#signOut').style.display = 'none';
                    getDom('#signName').style.display = 'none';
                    // getDom('#windowlogin').style.display = 'block';
                    setTimeout(function () {
                        location.replace(location.href);
                    }, 300)
                }
            }
        });
    })

    $("#login").click(function (e) {
        e.stopPropagation();
        location.href="/html/login.html";
        // layui.use('layer', function(){
        //     var layer = layui.layer;
        //
        //     layer.open({
        //         title:"",
        //         type:2,
        //         content:['/html/login.html','no'],
        //         area: ['650px', '700px'],
        //
        //         end: function(layero, index){
        //             console.log(1);
        //               location.replace(location.href);
        //         }
        //     })
        // });
    })
    $("#register").click(function (e) {
        e.stopPropagation();
        // layui.use('layer', function(){
        //     var layer = layui.layer;
        //
        //     layer.open({
        //         title:"",
        //         type:2,
        //         content:['/html/zhuce.html','no'],
        //         area: ['650px', '700px'],
        //         end: function(layero, index){
        //             // console.log(index);
        //             location.replace(location.href);
        //         }
        //     })
        // });
        location.href="/html/zhuce.html";
    })
    //head 全局搜索
    $('#btn_search').click(function (e) {
       var input=$("#searchInput").val();
       if(input!=""){
           var ary = {
               text: input
           };
           setSessionData('input', JSON.stringify(ary));
           location.href = "/html/shop-list.html";

       }else{
           layui.use(['layer', 'form'], function () {
               layer.msg("请正确搜索");
           });
       }

    });
});


