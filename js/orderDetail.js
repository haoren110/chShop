/**
 * Created by Administrator on 2018/1/10 0010.
 */
$(document).ready(function () {
    //订单详情
    var orderState="";
    var ordersId= searchUrl('orderId');

        $.ajax({
            type: 'GET',
            url: MAIN_URL + "/pc/center/order/orderDetail",
            dataType: 'json',
            data: {
                ordersId:ordersId
            },
            success: function (res) {
                if (res.success == "success") {
                    orderState=res.data.orders.orderStatus;
                getDom('#number').textContent="订单编号："+res.data.orders.orderNumber;
                    getDom('#state').textContent=res.data.orders.orderStatusStr;
                    getDom('#adressInformation').textContent="收货地址："+res.data.orders.addressDetail;
                    getDom('#adressName').textContent="姓名："+res.data.orders.name;
                    getDom('#adressPhone').textContent="联系方式："+res.data.orders.mobile;
                    getDom('#orderRemark').textContent="备注："+(res.data.orders.remark||"无");
                    res.data.ordersProductList.forEach(function (item,index){
                        var dom= createOrderlist(item,index);
                        getDom('#OrderList').appendChild(dom);
                    });
                }
            }
        });
    function createOrderlist(item,index) {
        var div= createDom('div');
        div.classList.add('myorder_information_again_detail');
        div.classList.add('clearfix');
        var div1=createDom('div');
        div1.classList.add('goods_information');
        div.appendChild(div1);
        var span= createDom('span');
        div1.appendChild(span);
        var img= createDom('img');
        img.src=MAIN_IMG+item.mainImg;
        span.appendChild(img);
        var a= createDom('a');
        a.href="#";
        a.textContent=item.productName;
        div1.appendChild(a);
        var div2= createDom('div');
        div2.classList.add('shop_price');
        div.appendChild(div2);
        var p= createDom('p');
        p.textContent="¥"+item.totalPrice;
        div2.appendChild(p);
        var div3= createDom('div');
        div3.classList.add('buy_num1');
        div3.textContent=item.num;
        div.appendChild(div3);
        var div4=createDom('div');
        div4.classList.add('buy_option');
        div.appendChild(div4);
        if(index==0){
            if(orderState=="UN_PAY"){
                var p1= createDom('p');
                p1.classList.add('buy_option2');
                p1.textContent="取消订单";
                div4.appendChild(p1);
                $(p1).click(function () {
                    removeOrder(ordersId);
                });
            }else if(orderState=="WAIT_DELIVER"){
                var p1= createDom('p');
                p1.classList.add('buy_option2');
                p1.textContent="提醒发货";
                div4.appendChild(p1);
                $(p1).click(function () {
                    layui.use(['layer', 'form'], function () {
                        layer.msg("会尽快发货");

                    });
                });
            } else if(orderState=="REVOKE"){
            } else if(orderState=="WAIT_RECEIPT"){
                var p1= createDom('p');
                p1.classList.add('buy_option2');
                p1.textContent="确认收货";
                div4.appendChild(p1);
                $(p1).click(function () {
                    getGood(ordersId);
                });
            }
        }
        if(orderState=="END_SERVE"){
            if(item.evaluateFlag==false){
                var p1= createDom('p');
                p1.classList.add('buy_option2');
                p1.textContent="去评论";
                div4.appendChild(p1);
                $(p1).click(function () {
                    //TODO  评论

                    var ary = {
                        img: item.mainImg,
                        name: item.productName,
                        num: item.num,
                        spec: item.goodsId,
                        id: item.id
                    };
                    setSessionData('dataObj', JSON.stringify(ary));
                    layui.use('layer', function(){
                        var layer = layui.layer;

                        layer.open({
                            title:"",
                            type:2,
                            content:['/html/center/myorder_evaluate.html?productId='+item.productId,'no'],
                            area: ['800px', '700px'],
                            end: function(layero, index){
                                // console.log(index);
                                location.replace(location.href);
                            }
                        })
                    });
                });
            }
            if(item.evaluateFlag==true&&item.evaluateTwoFlag==false){
                var p1= createDom('p');
                p1.classList.add('buy_option2');
                p1.textContent="追加评论";
                div4.appendChild(p1);
                $(p1).click(function () {
                    //TODO  评论

                    var ary = {
                        img: item.mainImg,
                        name: item.productName,
                        num: item.num,
                        spec: item.goodsId,
                        id: item.id
                    };
                    setSessionData('dataObj', JSON.stringify(ary));
                    layui.use('layer', function(){
                        var layer = layui.layer;

                        layer.open({
                            title:"",
                            type:2,
                            content:['/html/center/evaluateTwo.html?productId='+item.productId,'no'],
                            area: ['800px', '400px'],
                            end: function(layero, index){
                                // console.log(index);
                                location.replace(location.href);
                            }
                        })
                    });
                });
            }
            var p2= createDom('p');
            p2.classList.add('buy_option3');
            p2.textContent="申请售后";
            div4.appendChild(p2);
            $(p2).click(function () {

                layui.use('layer', function(){
                    var layer = layui.layer;

                    layer.open({
                        title:"",
                        type:2,
                        content:['/html/center/showSale.html','no'],
                        area: ['800px', '500px'],
                        end: function(layero, index){
                            // console.log(index);
                            location.replace(location.href);
                        }
                    })
                });
            });
        }



        return div;
    }
    //取消订单
    function getGood(id) {
        e.stopPropagation();
        $.ajax({
            type: 'post',
            url: MAIN_URL + '/pc/center/order/toEndServe',
            data: {
                ordersId: id
            },
            success: function (res) {
                if (res.success == "success") {
                    layui.use(['layer', 'form'], function () {
                        layer.msg(res.message);
                    });
                    setTimeout(function () {
                        location.href="/html/center/myorder.html"
                    }, 300)
                }
            }
        })
    }

function removeOrder(ordersId) {
    $.ajax({
        type: 'POST',
        url: MAIN_URL + "/pc/center/order/revokeOrders",
        dataType: 'json',
        data: {

            ordersId:ordersId
        },
        success: function (res) {
            if (res.success == "success") {
              //TODO  提示订单取消，并跳转到订单列表的页面
                layui.use(['layer', 'form'], function () {
                    layer.msg("取消订单");

                    setTimeout(function () {
                        location.replace(location.href);
                    }, 300)
                });
            }
        }
    });
}
});


/*
* <div class="myorder_information_again_detail clearfix">

 <div class="goods_information">
 <span> <img src="/img/Home_12.png"></span>
 <a href="#">初级会计职称2017教材“梦想成真系列“</a>
 </div>
 <div class="shop_price">
 <p>¥50.00</p>
 <!--<span>¥90.00</span>-->
 </div>
 <div class="buy_num1">2</div>
 <div class="buy_option">
 <p class="buy_option2">删除订单</p>
 </div>

 </div>*/