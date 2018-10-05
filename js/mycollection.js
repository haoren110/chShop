/**
 * Created by Administrator on 2018/1/12 0012.
 */
$(document).ready(function () {


    $.ajax({
        type: 'GET',
        url: MAIN_URL + "/pc/collection/getProductCollectionNumberByMember",
        dataType: 'json',
        async: false,
        data: {},
        success: function (res) {

            if (res.success == "success") {
                onload();
                getDom('#ALL').textContent = "(" + res.map.ALL + ")";
                getDom('#DOWN_PRICE').textContent = "(" + res.map.DOWN_PRICE + ")";
                getDom('#DOWN').textContent = "(" + res.map.DOWN + ")";
                    if(res.map.ALL==0){
                            getDom('#noorder').style.display="block";
                    }
            }

        }
    });
    $('#noorder').click(function () {
        location.href='/html/home.html';
    });
    function onload() {
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
            type: 'GET',
            url: MAIN_URL + "/pc/collection/getProductCollectionListByMember",
            dataType: 'json',
            async: false,
            data: {
                page: 0,
                size: 6,
                // productCollectionStatus:""
            },
            success: function (res) {

                if (res.success == "success"&&!!res.data) {
                    // console.log(res.data);
                    res.data.forEach(function (item, index) {
                        var dom = createCollectionList(item, index);
                        getDom('#Orderlist').appendChild(dom);
                    });
                }

            }
        });
    }

    function createCollectionList(item, index) {
        var div = createDom('div');
        div.classList.add('product_style');
        var div3=createDom('div');
        div3.classList.add('box');
        div.appendChild(div3);
        var img = createDom('img');
        img.classList.add('productImg');
        img.src = MAIN_IMG + item.productImage;
        $(img).click(function () {
            location.href = "/html/mall_detial.html?productId=" + item.productId;
        });
        div3.appendChild(img);
        var p = createDom('p');
        p.classList.add('productName');
        p.textContent = item.productName;
        div.appendChild(p);
        var div1 = createDom('div');
        div.appendChild(div1);
        //console.log(item.lastProductPrice);
        if (!!item.lastProductPrice) {
            var span = createDom('span');
            span.textContent = "￥" + item.lastProductPrice;
            div1.appendChild(span);
            var span1 = createDom('span');
            span1.classList.add('productSpan');
            span1.style.textDecoration = "line-through";
            span1.textContent = "￥" + item.productPrice;
            div1.appendChild(span1);
        } else {
            var span = createDom('span');
            span.textContent = "￥" + item.productPrice;
            div1.appendChild(span);
        }

        var div2 = createDom('div');
        div2.classList.add('mask');
        div.appendChild(div2);
        var del = createDom('p');
        del.classList.add('btn');
        del.textContent = "";

        var p1 = createDom('p');
        if (item.productCollectionStatus == "DOWN_PRICE") {
            p1.textContent = "直减";
            p1.style.backgroundColor = "#5195EA";
        } else if (item.productCollectionStatus == "NEW") {
            p1.textContent = "新款";
        } else if (item.productCollectionStatus == "DOWN") {
            p1.textContent = "失效";
            p1.style.backgroundColor = "#fff";
            p1.style.color = "#7b7b7b";
            p1.style.fontWeight = "bold";
        } else {
            p1.textContent = "";
            p1.style.backgroundColor = "#fff";
        }
        div2.appendChild(p1);
        div2.appendChild(del);
        del.appendChild(removecollection(item.id,div));


        return div;
    }
    // function removecollection(collectionId) {
    //         $.ajax({
    //             type:'post',
    //             url:MAIN_URL + '/pc/collection/deleteProductCollection',
    //             dataType:'json',
    //             data:{
    //                 id:collectionId
    //             },
    //             success:function(res){
    //                 if(res.success == "success"){
    //                         location.replace(location.href);
    //                 }
    //             }
    //
    //
    //         })
    //     }


    function removecollection(collectionId,div) {
        var _cancel = createDom('p');
        _cancel.style.marginBottom = "8px";
        _cancel.style.width = "74px";
        _cancel.style.borderRadius = "5px";
        var span = createDom('span');
        span.textContent = "删除";
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
                    , content: '<div style="padding: 20px 100px;">' + "确定删除收藏的宝贝？" + '</div>'
                    , btn: '确定'
                    , btnAlign: 'c' //按钮居中
                    , shade: 0 //不显示遮罩
                    , yes: function () {
                        layer.closeAll();
                        $.ajax({
                            type:'post',
                            url:MAIN_URL + '/pc/collection/deleteProductCollection',
                            dataType:'json',
                            data:{
                                id:collectionId
                            },
                            success: function (res) {
                                if (res.success == "success") {
                                    layui.use(['layer', 'form'], function () {
                                        layer.msg(res.message);
                                        setTimeout(function(){
                                           // location.replace(location.href);
                                            removeDom(div);
                                        },300)
                                    });
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
});
/*
 *  <div class="product_style">
 <img src="/img/Home_12.png" class="productImg" >
 <p class="productName">小米圈铁耳机Pro</p>
 <div>¥149.00 <span class="productSpan">销量：21</span></div>
 <div class="mask">
 <p>新款</p>
 </div>
 </div>*/