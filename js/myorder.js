 /**
 * Created by ji on 2017/11/21.
 */
$(document).ready(function () {
    var pageModel = {
        orderStatus: '',
        pageSize: 10,
        pageIndex: 0,
        isNoMore: false,
        totosize:0
    };
    var pageType = searchUrl('type');
//订单个数
    function OrderNumber() {
        $.ajax({
            type: 'get',
            url: MAIN_URL + "/pc/center/member/memberDetail ",
            dataType: 'json',
            async:false,
            success: function (res) {
                if (res.success == "success" && !!res.data) {
                    if(!!res.data.headImg){
                        getDom('#headImg').src= MAIN_IMG+res.data.headImg;
                    }
                    getDom('#headName').textContent=res.data.nickName;
                }
            }
        });
        $.ajax({
            type: 'get',
            url: MAIN_URL + "/pc/center/order/getOrdersNumber",
            dataType: 'json',
            async:false,
            success: function (res) {
                if (res.success == "success" && !!res.data) {
                    pageModel.totosize = res.data.ALL;
                    getDom('#UN_PAY').textContent =  res.data.UN_PAY ;
                    getDom('#WAIT_DELIVER').textContent =  res.data.WAIT_DELIVER ;
                    getDom('#WAIT_EVALUATE').textContent =  res.data.WAIT_EVALUATE  ;
                    getDom('#WAIT_RECEIPT').textContent =   res.data.WAIT_RECEIPT  ;
                }
            }
        });
        // if (!pageType) {
        //     _include();
        //
        // }
        if (!!pageType) {
            getDom('#' + pageType).parentNode.classList.add('active');
            var text = getDom('#' + pageType).parentNode.attributes[2].textContent;
            if (text == "WAIT_EVALUATE") {
                pageModel.pageIndex=0;
                pageModel.pageSize=10;
                getDom('#Orderlist').innerHTML = "";
                evaluate();

            } else {
                pageModel.pageIndex=0;
                pageModel.pageSize=10;
                pageModel.orderStatus = text;
                getDom('#Orderlist').innerHTML = "";
                _include();
            }
        }else {
            getDom('#ALL').parentNode.classList.add('active');
            _include();
        }
    }
    OrderNumber();






    //tab项切换
    var doms = getDoms('.itenicon');
    doms.forEach(function (item, index) {
        $(item).click(function (e) {
            pageModel.pageIndex=0;
            pageModel.pageSize=10;
            if (e.target.dataset.slide != undefined) {
                if (!!getDom('.active')) {
                    getDom('.active').classList.remove('active');
                }
                item.classList.add('active');
                if (e.target.dataset.slide == "WAIT_EVALUATE") {
                    getDom('#Orderlist').innerHTML = "";
                    evaluate();
                    return;
                } else if (e.target.dataset.slide == "item") {
                    pageModel.orderStatus = "";
                    getDom('#Orderlist').innerHTML = "";
                    _include();
                } else if (e.target.dataset.slide != "item") {
                    pageModel.orderStatus = e.target.dataset.slide;
                    getDom('#Orderlist').innerHTML = "";
                    _include();
                }
            }
            // pageModel.orderStatus = item.getAttribute('status');
        })
    });



    //查看全部订单
    $('#goOrder').click(function(){
        doms.forEach(function (item, index) {
            if (!!getDom('.active')) {
                getDom('.active').classList.remove('active');
            }
        })
        getDom('#item').classList.add('active');
        pageModel.orderStatus = " ";
        pageModel.pageIndex=0;
        pageModel.pageSize=10;
        _include();
    });


//订单列表
    function _include() {
        $.ajax({
            type: 'get',
            url: MAIN_URL + "/pc/center/order/orderList",
            dataType: 'json',
            async:false,
            data: {
                orderStatus: pageModel.orderStatus,
                pageIndex: pageModel.pageIndex,
                pageSize: pageModel.pageSize
            },
            success: function (res) {
                if (res.success == "success" && !!res.data) {
                    res.data.forEach(function (item, index) {
                        var dom = createDomOrder(item, index);
                        getDom('#Orderlist').appendChild(dom);
                    });
                    getDom('#noorder').style.display = "none";
                } else {
                    getDom('#noorder').style.display = "block";
                }
                if(!!res.map&& pageModel.pageIndex == 0){
                    initLaypage(res.map.number);
                    // console.log(res.map.number);
                }else if(res.map==undefined){

                    initLaypage(0);
                }
            }
        });
    }


    function evaluate() {
        $.ajax({
            type: 'get',
            url: MAIN_URL + "/pc/center/order/waitEvaluateList",
            dataType: 'json',
            async:false,
            data: {
                pageIndex: pageModel.pageIndex,
                pageSize: pageModel.pageSize
            },
            success: function (res) {
                if (res.success == "success" && !!res.data) {
                    res.data.forEach(function (item, index) {
                        var dom = createDomOrder(item, index);
                        getDom('#Orderlist').appendChild(dom);
                    });
                    getDom('#noorder').style.display = "none";
                } else {
                    getDom('#noorder').style.display = "block";
                }
                if (res.data == "") {
                    getDom('#noorder').style.display = "block";

                }
                if(!!res.map&& pageModel.pageIndex == 0){
                    initLaypage(res.map.number);

                }else if(res.map==undefined){
                    initLaypage(0);
                }
            }
        });
    }
    function createDomOrder(res, index) {
        var div = createDom('div');
        div.classList.add('myorder_information');
        var div1 = createDom('div');
        div1.classList.add('myorder_information_top');
        div.appendChild(div1);
        var p = createDom('p');
        p.classList.add('myorder_time');
        p.textContent = formatDate(new Date(res.orders.createTime), 'yyyy-MM-dd');
        div1.appendChild(p);
        var p1 = createDom('p');
        p1.textContent = "订单编号:" + res.orders.orderNumber;
        div1.appendChild(p1);
        // var a = createDom('a');
        // a.classList.add('myorder_delete');
        // div1.appendChild(a);
        // // var img = createDom('img');
        // // img.src = "../../img/delete.png";
        // // a.appendChild(img);
        // var p4 = createDom('p');
        // if (!!res.orders.orderStatusStr) {
        //     p4.textContent = res.orders.orderStatusStr;
        // } else {
        //     p4.textContent = res.orders.orderStatus_text;
        // }
        // a.appendChild(p4);
        var div2 = createDom('div');
        div2.classList.add('myorder_information_down');
        div.appendChild(div2);
        var div3 = createDom('div');
        div3.classList.add('order_infor');
        div3.classList.add('pull_left');
        div2.appendChild(div3);
        res.ordersProductList.forEach(function (item, i) {
            var div4 = createDom('div');
            div4.classList.add('order_infor_item');
            div4.classList.add('pull_left');
            div3.appendChild(div4);
            var div5 = createDom('div');
            div5.classList.add('goods_information');
            div4.appendChild(div5);
            var span = createDom('span');
            div5.appendChild(span);
            var img1 = createDom('img');
            img1.src = MAIN_IMG + item.mainImg;
            span.appendChild(img1);
            var a1 = createDom('a');
            a1.textContent = item.productName;
            div5.appendChild(a1);
            var div6 = createDom('div');
            div6.classList.add('shop_price');
            div4.appendChild(div6);
            var p2 = createDom('p');
            p2.textContent = "¥" + item.unitPrice;
            div6.appendChild(p2);
            var span1 = createDom('span');
            // span1.textContent ="¥" + item.unitPrice;
            div6.appendChild(span1);
            var div7 = createDom('div');
            div7.classList.add('buy_num');
            div7.textContent = item.num;
            div4.appendChild(div7);
            $(span).click(function () {
                location.href="/html/mall_detial.html?productId="+ item.productId;
            });
            $(a1).click(function () {
                location.href="/html/mall_detial.html?productId="+ item.productId;
            });
        });
        var div8 = createDom('div');
        div8.classList.add('shop_money');
        div2.appendChild(div8);
        var p3 = createDom('p');
        p3.textContent = "¥" + res.orders.moneyPayOrders;
        div8.appendChild(p3);
        var span2 = createDom('span');
        span2.textContent = "（含运费：¥0.00）";
        div8.appendChild(span2);
        var div9 = createDom('div');
        div9.classList.add('shop_operation');
        div2.appendChild(div9);
        var a = createDom('a');
        a.classList.add('myorder_delete');
        div1.appendChild(a);
        var p4 = createDom('p');
        if (!!res.orders.orderStatusStr) {
            p4.textContent = res.orders.orderStatusStr;
        }else{
            p4.textContent = res.orders.orderStatus_text;
        }


        a.appendChild(p4);
        div9.appendChild(a);
        div9.appendChild(_orderDeatia(res.orders.id));
        if (res.orders.orderStatus == 'WAIT_RECEIPT') {
            div9.appendChild(_logistics(res.orders.expressCompany, res.orders.expressNumber, res.orders.id));

        } else if (res.orders.orderStatus == 'END_SERVE') {
            div9.appendChild(_logistics(res.orders.expressCompany, res.orders.expressNumber, res.orders.id));

        }
        var div10 = createDom('div');
        div10.classList.add('shop_operation');
        div10.classList.add('shop_crist');
        div2.appendChild(div10);
        if (res.orders.orderStatus == 'UN_PAY') {
            div10.appendChild(_cancel(res.orders.id));
            div10.appendChild(_pay(res));
        } else if (res.orders.orderStatus == 'WAIT_DELIVER') {
            div10.appendChild(_remind());
        } else if (res.orders.orderStatus == 'WAIT_RECEIPT') {
            //div10.appendChild(_logistics(res.orders.expressCompany, res.orders.expressNumber, res.orders.orderNumber));
            div10.appendChild(_receive(res.orders.id));
        } else if (res.orders.orderStatus == 'END_SERVE') {
            //   div10.appendChild(_logistics(res.orders.expressCompany, res.orders.expressNumber, res.orders.orderNumber));
            var evaluateFlag=false;
            var changeFlag=false;
            res.ordersProductList.forEach(function (item2, i) {
                //console.log((item2.evaluateFlag||item2.evaluateTwoFlag));
                if (item2.evaluateFlag==true||item2.evaluateTwoFlag==false) {
                    evaluateFlag=true;
                }
                if ((item2.changeFlag || item2.returnFlag) && (!item2.retreatStatus && !item2.changeStatus)) {
                    changeFlag=true;
                }
            })
            if(evaluateFlag==true){
                div10.appendChild(gocomment(res.orders.id));
            }
            if(changeFlag==true){
                div10.appendChild(afterSale(res.orders.id));
            }
        }
        return div;
    }
//取消订单
    function _cancel(ordersId) {
        var _cancel = createDom('p');
        _cancel.style.marginBottom = "8px";
        var span = createDom('span');
        span.textContent = "取消订单";
        span.classList.add('btn-cancel');
        _cancel.appendChild(span);
        $(_cancel).click(function (e) {
            e.stopPropagation();
            layui.use('layer', function () { //独立版的layer无需执行这一句
                var $ = layui.jquery, layer = layui.layer; //独立版的layer无需执行这一句
                layer.open({
                    type: 1
                    , offset: "auto" //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
                    , id: 'layerDemo' + "auto" //防止重复弹出
                    , content: '<div style="padding: 20px 100px;">' + "订单取消后不可恢复，确定取消？" + '</div>'
                    , btn: '确定取消'
                    , btnAlign: 'c' //按钮居中
                    , shade: 0 //不显示遮罩
                    , yes: function () {
                        layer.closeAll();
                        $.ajax({
                            type: 'post',
                            url: MAIN_URL + '/pc/center/order/revokeOrders',
                            data: {
                                ordersId: ordersId
                            },
                            success: function (res) {
                                if (res.success == "success") {
                                    layui.use(['layer', 'form'], function () {
                                        layer.msg(res.message);
                                    });
                                    setTimeout(function () {
                                        getDom('#Orderlist').innerHTML = "";
                                        _include();
                                        OrderNumber();
                                    }, 300)
                                } else {
                                    layui.use(['layer', 'form'], function () {
                                        layer.msg(res.message);
                                    });
                                }
                            }
                        })
                    }
                });
            });
        });
        return _cancel;
    }

//去支付
    function _pay(obj) {
        var _pay = createDom('p');
        var span = createDom('span');
        span.classList.add('btn-pay');
        span.textContent = "去支付";
        _pay.appendChild(span);
        $(_pay).click(function (e) {
            e.stopPropagation();
            if (!!obj.jsonString) {
                var ary = {
                    orderId: obj.orders.id,
                    money: obj.orders.moneyOrders,
                    sn: obj.orders.orderNumber,
                    jsonString: obj.jsonString,
                    name: obj.orders.name,
                    mobile: obj.orders.mobile,
                    addressDetail: obj.orders.addressDetail,
                };
                setSessionData('orderConfirm', JSON.stringify(ary));
                setTimeout(function () {
                    location.href = "/html/pay_order.html";
                }, 300);
            }
        });
        return _pay;
    }
    function _remind() {
        var btn_remind = createDom('p');
        var span = createDom('span');
        span.classList.add('btn-cancel');
        span.textContent = "提醒发货";
        btn_remind.appendChild(span);
        $(btn_remind).click(function () {
            layui.use(['layer', 'form'], function () {
                layer.msg("已提醒商家发货");
            });
        });
        return btn_remind;
    }
    function _logistics(company, number, orderNum) {
        var btn_logistics = createDom('p');
        btn_logistics.style.marginBottom = "8px";
        var span = createDom('span');
        span.classList.add('btn-pay');
        span.textContent = "查看物流";
        btn_logistics.appendChild(span);
        $(btn_logistics).click(function () {
            location.href = '/html/center/logistics.html?company=' + company + '&number=' + number + '&orderNum=' + orderNum;
        });
        return btn_logistics;
    }
    function _receive(id) {
        var btn_receive = createDom('p');
        var span = createDom('span');
        span.classList.add('btn-cancel');
        span.textContent = "确认收货";
        btn_receive.appendChild(span);
        $(btn_receive).click(function (e) {
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
                            getDom('#Orderlist').innerHTML = "";
                            _include();
                            OrderNumber();
                        }, 300)
                    }
                }
            })
        });
        return btn_receive;
    }
    function gocomment(order) {
        var gocomment = createDom('p');
        var span = createDom('span');
        span.classList.add('btn-cancel');
        span.textContent = "去评论";
        gocomment.appendChild(span);
        $(gocomment).click(function () {
            location.href = "/html/center/myorder-success.html?orderId=" + order;
        });
        return gocomment;
    }
    function afterSale(order) {
        var afterSale = createDom('p');
        var span = createDom('span');
        span.classList.add('btn-cancelto');
        span.textContent = "售后";
        afterSale.appendChild(span);
        $(afterSale).click(function () {
            layui.use('layer', function(){
                var layer = layui.layer;

                layer.open({
                    title:"",
                    type:2,
                    content:['/html/center/showSale.html','no'],
                    area: ['800px', '500px']
                })
            });
        });
        return afterSale;
    }
    //订单详情
    function _orderDeatia(ordersId) {
        var order = createDom('p');
        var span = createDom('span');
        // span.classList.add('btn-cancel');
        span.textContent = "订单详情";
        order.appendChild(span);
        $(order).click(function () {
            location.href = "/html/center/myorder-success.html?orderId=" + ordersId;
        });
        return order;
    }

    function initLaypage(totosize) {

        layui.use('laypage', function () {
            var laypage = layui.laypage;
            //执行一个laypage实例
            laypage.render({
                elem: 'pageList' //注意，这里的 test1 是 ID，不用加 # 号
                , count: totosize //数据总数，从服务端得到
                , limit: 10
                , curr: 0
                // , first: 0
                , jump: function (obj, first) {
                    //obj包含了当前分页的所有参数，比如：
                    // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                    // console.log(obj.limit); //得到每页显示的条数
                    pageModel.pageIndex = obj.curr - 1;
                    //首次不执行
                    if (!first) {
                        getDom('#Orderlist').innerHTML="";
                        _include();
                    }
                }
            });
        });
    }
    //我的优惠卷
    $("#discountsto").click(function(){
        location.href="/html/center/discount.html";
    });
    $("#shopCars").click(function(){
        window.open("/html/shopping_car.html");
    });

})
;
/**
 * Created by Administrator on 2018/1/10 0010.
 */
