/**
 * Created by Administrator on 2017/12/27 0027.
 */
$(document).ready(function () {
//确认订单页
    var _pay = 0;
    var source = getSessionData('orderConfirm');
    console.log(source);
    if (!!source) {
        source = JSON.parse(source) || {};
        getDom('#orderValue').textContent = "¥" + source.money || 0.00;
        getDom('#orderNum').textContent ="订单编号："+ source.sn || '暂无';
        _pay=source.money;
        // getDom('#name').textContent = source.name || '暂无';
        // getDom('#phone').textContent = source.mobile || '暂无';
    }
    // var pay = getDoms('.pay');
    // pay.forEach(function (item, index) {
    //     $(item).click(function (e) {
    //         getDom('.active').classList.remove('active');
    //         item.classList.add('active');
    //         console.log(index)
    //         _pay = index;
    //     })
    // })
    $("#zhifubao").click(function () {
        if (_pay == 0) {
            totalIsZero();
        } else {
           zhifubao();
        }

    });
    // $("#delectXa").click(function(){
    //     getDom("#release").style.display="none";
    // });
    // $("#GoPay").click(function(){
    //     getDom("#release").style.display="none";
    // });
    function totalIsZero() {
        $.ajax({
            type: "post",
            url: MAIN_URL + "/pc/center/order/toWaitDeliver",
            dataType: "text",
            data: {
                ordersId: source.orderId,
                // payMode: _pay == 0 ? "WECHAT" : "ALIPAY",
                payMode:  "ALIPAY",
            },
            success: function (res) {
                //console.log(res);
                if (res.message == "支付成功" && res.success == "success") {
                    var ary = {
                        orderId: source.orderId,
                        money: source.money,
                        sn: source.sn
                    };
                    setSessionData('orderNumber', JSON.stringify(ary));

                    // setTimeout(function () {
                    //     location.href="/pc/html/success_order.html";
                    // }, 300);
                }
            }
        });
    }
    function zhifubao() {
        $.ajax({
            type: "post",
            url: "http://alipay.wj-s.com/alipay/pc",
            // url: "http://bi8xc6.natappfree.cc/alipay/pc",
            dataType: "text",
            data: {
                orderNumber: source.sn,
                price: source.money,
            },
            success: function (res) {
                console.log(res);
                setSessionData('key',res.id);
                //console.info(getSessionData('key'));
                //location.href = '';
                if (!!res) {
                    var ary = {
                        html: res
                    };
                    setSessionData('html', JSON.stringify(ary));
                }


                    //console.log(1111);
                    layui.use('layer', function(){
                        var layer = layui.layer;
                        //示范一个公告层
                        layer.confirm('支付是否完成', {
                            btn: ['支付完成', '支付未完成'] //可以无限个按钮
                        }, function(index, layero){
                            //按钮【按钮一】的回调
                            location.replace("/html/center/myorder.html");
                        }, function(index){
                            //按钮【按钮二】的回调
                            location.replace("/html/center/myorder.html");
                        });
                    });

                    // getDom("#release").style.display="block";

                window.open("/html/pay_zfb.html");
            }

        });
    }

})
;

