/**
 * Created by Administrator on 2017/12/27 0027.
 */
$(document).ready(function () {
    mui.init();
    var goodsList = [], _checkList = [];
    var content = getDom('#content');
    var totalPriceDom = getDom('#total_money');
    var totoSize = getDom('#totoSize');

    //我的购物车
    function shoppingCar() {
        $.ajax({
            type: 'get',
            url: MAIN_URL + "/pc/mall/shopCart/shopCartList?t=" + new Date().getTime(),
            dataType: 'json',
            success: function (res) {
                if (res.success == "success" && !!res.data) {
                    res.data.forEach(function (item, index) {
                        var goodsModel = {
                            img: MAIN_IMG + item.imageUrl,
                            id: item.id,
                            title: item.productName,
                            price: item.price * 1,
                            num: item.num * 1,
                            pid: item.productId,
                            checkBox: {
                                checked: ''
                            },
                            totalPrice: item.totalPrice,
                            productId:item.productId,
                            keyword:item.keyword
                        };
                        goodsList.push(goodsModel);
                        var dom = removeDomItem(goodsModel);
                        getDom('#goodsList').appendChild(dom);
                    })
                    if(res.data==""){
                        getDom('#noshopCar').style.display = 'block';
                        getDom('#shop_nav').style.display = 'none';
                        getDom('#shop_settlement').style.display = 'none';
                    }

                }
            }
        });
    }
    shoppingCar();

    //监听页面的checkbox
    mui(content).on('change', 'input[type=checkbox]', function (e) {

        if (e.target.value == '999') {

            _checkList = [];
            goodsList.forEach(function (item) {
                item.checkBox.checked = e.target.checked;
                getDom('#chk' + item.id + '').checked = e.target.checked;
                getDom('#goodschk' + item.id + '').style.backgroundColor = "rgba(53,193,132,0.2)";
                !!e.target.checked && _checkList.push(parseInt(item.id));
            })
        } else {
            var _goodsId = parseInt(e.target.value);

            var _checkAllInput = getDom('#shopping_all');
            goodsList.forEach(function (item) {
                if (item.id == _goodsId) {
                    item.checkBox.checked = e.target.checked;
                }
            });
            if (e.target.checked) {
                getDom('#goods' + e.target.id).style.backgroundColor = "rgba(53,193,132,0.2)";

                _checkList.push(_goodsId);
            } else {
                removeList(_checkList, _goodsId);
                getDom('#goods' + e.target.id).style.backgroundColor = "";
            }

            _checkAllInput.checked = isCheckAll(_checkList, goodsList);
        }
        updateTotalPrice(totalPriceDom, goodsList);
    });
    var flag = true;

    function removeDomItem(res, index) {
        var div = createDom('div');
        div.classList.add('shop_information');
        div.setAttribute('id', "goodschk" + res.id);
        // div.setAttribute('id', "specchk" + res.id);
        var input = createDom('input');
        input.name = "checkbox1";
        input.value = res.id;
        input.type = "checkbox";
        input.id = "chk" + res.id;
        div.appendChild(input);
        var div1 = createDom('div');
        div1.classList.add('choose_all');
        div.appendChild(div1);
        var img = createDom('img');
        img.src = res.img;
        div1.appendChild(img);
        $(img).click(function(){
            location.href="/html/mall_detial.html?id="+ res.productId;
        });
        var div2 = createDom('div');
        div2.classList.add('goods_information');
        var pp=createDom('p');
        pp.textContent = res.title;
        div2.appendChild(pp);
        var pp1=createDom('p');
        pp1.textContent = "简介:"+ res.keyword ;
        div2.appendChild(pp1);
        div.appendChild(div2);
        $(div2).click(function(){
            location.href="/html/mall_detial.html?id="+ res.productId;
        });
        var div3 = createDom('div');
        div3.classList.add('shop_price');
        div3.textContent = res.price;
        div.appendChild(div3);
        var div4 = createDom('div');
        div4.classList.add('buy_num');
        div.appendChild(div4);
        var a = createDom('a');
        a.href = "#";
        a.classList.add('shop_jian');
        a.textContent = "-";
        div4.appendChild(a);
        var div5 = createDom('div');
        div5.classList.add('shop_num_show');
        div5.textContent = res.num;
        div4.appendChild(div5);
        var a1 = createDom('a');
        a1.classList.add('shop_jian');
        a1.textContent = "+";
        div4.appendChild(a1);
        $(a1).click(function (e) {
            e.stopPropagation();
            if (parseInt(div5.textContent) > 99) {
                layui.use(['layer', 'form'], function () {

                    layer.msg('已经是最大值', {icon: 2});
                });
                return;
            } else {
                div5.textContent = parseInt(div5.textContent) + 1;
                res.num = parseInt(div5.textContent);
                var priveall = parseFloat((div3.textContent) * 100) * parseInt(div5.textContent);
                div6.textContent = formatPrice(priveall / 100);

                updateTotalPrice(totalPriceDom, goodsList);

                if (flag) {
                    flag = false;
                    mui.ajax({
                        type: 'post',
                        url: MAIN_URL + '/pc/mall/shopCart/updateShopChartNum',
                        data: {
                            shopCharId: res.id,
                            num: parseInt(div5.textContent)
                        },
                        dataType: 'json',
                        success: function (res) {
                            if (res.success == "success") {

                                flag = true;
                            }
                        }
                    });
                }
            }
        });
        $(a).click(function (e) {
            e.stopPropagation();
            if (parseInt(div5.textContent) <= 1) {
                layui.use(['layer', 'form'], function () {

                    layer.msg('已经是最小值', {icon: 2});
                });

                return;
            } else {
                div5.textContent = parseInt(div5.textContent) - 1;
                var priveall = parseFloat((div3.textContent) * 100) * parseInt(div5.textContent);
                div6.textContent = formatPrice(priveall / 100);
                res.num = parseInt(div5.textContent);
                updateTotalPrice(totalPriceDom, goodsList);

                if (flag) {
                    flag = false;
                    mui.ajax({
                        type: 'post',
                        url: MAIN_URL + '/pc/mall/shopCart/updateShopChartNum',
                        data: {
                            shopCharId: res.id,
                            num: parseInt(div5.textContent)
                        },
                        dataType: 'json',
                        success: function (res) {
                            if (res.success == "success") {
                                flag = true;
                            }
                        }
                    });
                }
            }
        })
        var div6 = createDom('div');
        div6.classList.add('shop_money');
        div6.textContent = res.totalPrice;
        div.appendChild(div6);
        var div7 = createDom('div');
        div7.classList.add('shop_operation');
        div.appendChild(div7);
        // var a2 = createDom('a');
        // a2.textContent = "移入收藏夹";
        // div7.appendChild(a2);
        var a3 = createDom('a');
        a3.textContent = "删除";
        div7.appendChild(a3);
        $(a3).click(function () {
            layui.use('layer', function () { //独立版的layer无需执行这一句
                var $ = layui.jquery, layer = layui.layer; //独立版的layer无需执行这一句
                layer.open({
                    type: 1
                    , offset: "auto" //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
                    , id: 'layerDemo' + "auto" //防止重复弹出
                    , content: '<div style="padding: 20px 100px;">' + "删除需谨慎！！！" + '</div>'
                    , btn: '确定删除'
                    , btnAlign: 'c' //按钮居中
                    , shade: 0 //不显示遮罩
                    , yes: function () {
                        layer.closeAll();
                        delectCar(res.id);

                    }
                });


            });
        });
        return div;
    }

    //点击编辑删除购物车
    function delectCar(id) {
        $.ajax({
            type: 'post',
            url: MAIN_URL + '/pc/mall/shopCart/deleteShopCarts',
            data: {
                ids: id
            },
            dataType: 'json',
            success: function (res) {
                if (res.success == "success") {
                    layui.use(['layer', 'form'], function () {
                        layer.msg(res.message, {icon: 1});
                    });
                    removeDom(getDom('#goodschk' + id));
                    goodsList.forEach(function (info, i) {
                        if (id == info.id) {
                            goodsList.splice(i, i + 1);
                        }
                    });
                    getDom(".shop_settlement").classList.remove('choose');
                    totalPriceDom.textContent = "0.00";
                    totoSize.textContent = "0";
                    _checkList = [];
                }
            }
        });
    }

    //结算
    $("#shop_settlement_btn").click(function (e) {
        e.stopPropagation();
        if (_checkList.length > 0) {
            setSessionData('ids', JSON.stringify(_checkList));
            setSessionData('nowBuy', "");
            location.href = "/html/confirm_order.html";
        } else {
            layui.use(['layer', 'form'], function () {
                layer.msg('请选择要结算的商品', {icon: 2});
            });
        }
    });
    function removeList(arr, item) {
        if (arr.length) {
            var index = arr.indexOf(item);
            if (index > -1) {
                return arr.splice(index, 1)
            }
        }
    }

    //是否全选
    function isCheckAll(checkList, goodsList) {
        return checkList.length == goodsList.length;
    }

    //修改合计  金额
    function updateTotalPrice(totalPriceDom, goodsModelMap) {
        var _totalPrice = 0;
        var _totalNumber = 0;
        for (var o in goodsModelMap) {
            if (goodsModelMap[o].checkBox.checked) {
                _totalNumber += parseInt(goodsModelMap[o].num);
                _totalPrice += (goodsModelMap[o].price * 100) * goodsModelMap[o].num;
            } else {
                getDom('#goodschk' + goodsModelMap[o].id + '').style.backgroundColor = "";
            }
        }
        totalPriceDom.textContent = formatPrice(_totalPrice / 100);
        totoSize.textContent = _totalNumber;
        if (_totalNumber != 0) {
            getDom(".shop_settlement").classList.add('choose')
        } else {
            getDom(".shop_settlement").classList.remove('choose');
        }
    }

    // 删除
    $('#btn_del').click(function (e) {
        e.stopPropagation();
        if (_checkList.length > 0) {
            layui.use('layer', function () { //独立版的layer无需执行这一句
                var $ = layui.jquery, layer = layui.layer; //独立版的layer无需执行这一句
                layer.open({
                    type: 1
                    , offset: "auto" //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
                    , id: 'layerDemo' + "auto" //防止重复弹出
                    , content: '<div style="padding: 20px 100px;">' + "删除需谨慎！！！" + '</div>'
                    , btn: '确定删除'
                    , btnAlign: 'c' //按钮居中
                    , shade: 0 //不显示遮罩
                    , yes: function () {
                        layer.closeAll();
                        $.ajax({
                            type: 'post',
                            url: MAIN_URL + '/pc/mall/shopCart/deleteShopCarts',
                            data: {
                                ids: _checkList.join(',')
                            },
                            dataType: 'json',
                            success: function (res) {
                                if (res.success == "success") {
                                    layui.use(['layer', 'form'], function () {
                                        layer.msg(res.message, {icon: 1});
                                    });
                                    _checkList.forEach(function (item, index) {
                                        removeDom(getDom('#goodschk' + item));
                                        goodsList.forEach(function (info, i) {
                                            if (item == info.id) {
                                                goodsList.splice(i, i + 1);
                                            }
                                        });
                                        var asd = goodsList.length;
                                        if (asd == 0) {
                                            getDom('#noshopCar').style.display = 'block';
                                            getDom('#shop_nav').style.display = 'none';
                                            getDom('#shop_settlement').style.display = 'none';
                                        }
                                    });
                                    getDom(".shop_settlement").classList.remove('choose');
                                    totalPriceDom.textContent = "0.00";
                                    totoSize.textContent = "0";
                                    _checkList = [];
                                }
                            }
                        });
                    }
                });
            });
        } else {
            layui.use(['layer', 'form'], function () {
                layer.msg('请选择要删除的商品', {icon: 2});
            });

        }
    })

})
