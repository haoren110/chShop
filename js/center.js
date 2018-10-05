/**
 * Created by Administrator on 2018/1/10 0010.
 */
/**
 * Created by ji on 2017/11/21.
 */
$(document).ready(function () {


//我的购物车
    $("#shopCars").click(function () {

        window.open("/html/shopping_car.html");
    });
    //我的订单
    $("#order").click(function () {
        location.href="/html/center/myorder.html";
    });
    //我的收获地址
    $("#harvest").click(function(){
        location.href="/html/center/account-setting-address.html";
    });
    //我的优惠卷
    $("#discounts").click(function(){
        location.href="/html/center/discount.html";
    });
    //我的优惠卷
    $("#discountsto").click(function(){
        location.href="/html/center/discount.html";
    });
    $.ajax({
        type: 'get',
        url: MAIN_URL + "/pc/center/order/getOrdersNumber",
        dataType: 'json',
        success: function (res) {
            if (res.success == "success" && !!res.data) {
                onload();
                getDom('#UN_PAY').textContent = " (" + res.data.UN_PAY + ")";
                getDom('#WAIT_DELIVER').textContent = " (" + res.data.WAIT_DELIVER + ")";
                getDom('#WAIT_EVALUATE').textContent = " (" + res.data.WAIT_EVALUATE + ")";
                getDom('#WAIT_RECEIPT').textContent = " (" + res.data.WAIT_RECEIPT + ")";
            }
        }
    });



});
function onload() {
    //推荐
    $.ajax({
        type: 'POST',
        url: MAIN_URL + "/pc/product/getRecommendProduct",
        dataType: 'json',
        async:false,
        data: {

        },
        success: function (res) {
            if (res.success == "success" && !!res.data) {
                console.log(res.data);
                res.data.forEach(function (item, index) {
                    var dom = createSliderItem(item.product,item.productGoods,index);
                    if(index<=3){
                        getDom('.product_list').appendChild(dom);
                    }
                })
            }
        }
    });
    $.ajax({
        type: 'get',
        url: MAIN_URL + "/pc/center/member/memberDetail ",
        dataType: 'json',
        async:false,
        success: function (res) {
            if (res.success == "success" && !!res.data) {
                //console.log(res.data);
                if(!!res.data.headImg){
                    getDom('#headImg').src= MAIN_IMG+res.data.headImg;
                }

                getDom('#headName').textContent=res.data.nickName;
            }
        }
    });
    // $.ajax({
    //     type: 'get',
    //     url: MAIN_URL + "/pc/center/member/memberDetail",
    //     dataType: 'json',
    //     async:false,
    //     success: function (res) {
    //         if (res.success == "success" && !!res.data) {
    //             getDom('#personal_name').textContent = res.data.nickName;
    //             getDom('#headImg').src = res.data.headImg;
    //         }
    //     }
    // });
}
/*创建推荐*/
function createSliderItem(item,index,index1) {
    var div= createDom('div');
    div.classList.add('product_style');

    if(index1%5==0){
        div.classList.add('border0');
    } else if(index1%5==1){
        div.classList.add('border1');
    }else if(index1%5==2){
        div.classList.add('border2');
    }else if(index1%5==3){
        div.classList.add('border3');
    }else if(index1%5==4){
        div.classList.add('border4');
    }
    var div3=createDom('div');
    div3.classList.add('box');
    div.appendChild(div3);
    var img= createDom('img');
    img.classList.add('productImg');
    // img.style.width='160px';
    img.src=MAIN_IMG+item.images;
    $(img).click(function (e) {
        location.href='/html/mall_detial.html?productId='+item.id;
    });
    div3.appendChild(img);
    var p = createDom('p');
    p.classList.add('productName');
    p.textContent=item.productName;
    div.appendChild(p);
    var div1= createDom('div');
    div1.textContent='¥'+item.actualPrice;
    div.appendChild(div1);
    var div2= createDom('div');
    div2.classList.add('mask');
    div.appendChild(div2);
    var btn= createDom('button');
    btn.textContent='立即购买';
    btn.classList.add('button'+index1%5);
    $(btn).click(function () {
        var ary = {
            specId: item.id,
            num: 1,
            goodsId: index.id
        };
        setSessionData('nowBuy', JSON.stringify(ary));
        setSessionData('ids', "");
        location.href="/html/confirm_order.html";
    });
    div2.appendChild(btn);

    return div;
};
