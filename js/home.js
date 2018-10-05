$(document).ready(function () {
    $('.forgot-password').click(function () {
        layui.use('layer', function(){
            var layer = layui.layer;

            layer.open({
                title:"输入账号",
                type: 2,
                content: '/html/accountCenter.html',
                area:['460px','550px']
            });
        });
    });
    var sid = getSessionData('sid');


    //推荐
    $.ajax({
        type: 'POST',
        url: MAIN_URL + "/pc/product/getRecommendProduct",
        dataType: 'json',
        data: {

        },
        success: function (res) {
            if (res.success == "success" && !!res.data) {
                //console.log(res.data);
                res.data.forEach(function (item, index) {
                    var dom = createSliderItem(item.product,item.productGoods,index);
                    if(index<=3){
                    getDom('.product_list').appendChild(dom);
                    }
                })
            }
        }
    });
    //获取分类
    $.ajax({
        type: 'GEt',
        url: MAIN_URL + "/pc/category/getCategory",
        dataType: 'json',
        data: {

        },
        success: function (res) {
            if (res.success == "success" && !!res.data) {
                //console.log(res.data[0]);
                res.data.forEach(function (item, index) {
                    var dom = createclassification(item,index);
                        getDom('.list_left').appendChild(dom);

                })
            }
        }
    });
    //获取广告图片
    $.ajax({
        type: 'GEt',
        url: MAIN_URL + "/pc/mall/image/systemImageList",
        dataType: 'json',
        data: {

        },
        success: function (res) {
            if (res.success == "success" && !!res.data) {
                //console.log(res.data[0]);
                var showIndex=2;
                if (!!sid) {

                    getDom('#windowlogin').style.display = 'none';
                    showIndex=4

                }
                res.data.forEach(function (item, index) {
                    if(showIndex>index){
                        var dom = createAdvertisement(item,index);
                        getDom('.advertisement').appendChild(dom);
                    }


                })
            }
        }
    });

});
/*创建推荐*/
function createSliderItem(item,index,index1) {
    var div= createDom('div');
    div.classList.add('product_style');
    //console.log(index1%5);
   div.classList.add('border'+index1%5);
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
    btn.classList.add('button'+index1%5);
    btn.textContent='立即购买';
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
    /****
     *
     *  <div class="product_style">
     <img src="/img/Home_14.png" class="productImg" style="width: 160px">
     <p class="productName">Apple MD818FE/A Lightn ing to USB iPhone/iPad</p>
     <div>¥149.00</div>
     <div class="mask">
     <button>立即购买</button>
     </div>
     </div>
     * ***/
    /*创建分类*/
    function createclassification(item,index) {
        var li = createDom('li');

        $(li).click(function () {
            location.href='/html/shop-list.html?type='+item.id+"&&noInput=1" ;
        });
        var span= createDom('span');
        li.appendChild(span);
        var img=createDom('img');
         img.src=MAIN_IMG+item.productTypeImage;
        span.appendChild(img);
        var span1=createDom('span');
         span1.textContent=item.name;
        span.appendChild(span1);
        return li;

    }

    /*
    * <li id="classification1"><span><img src=" /img/Home_02.png" /></span>移动电源</li>
    * */
    //创建广告图片
    function createAdvertisement(item,index) {
        var img= createDom('img');
        img.src=MAIN_IMG+item.imageUrl;
        if(index!=0){
            img.style.marginTop="25px";
        }
        img.style.border="1px solid #e1e1e1";

        // img.style.marginBottom="25px";
        img.style.width="250px";
        img.style.height="135px";
        img.style.cursor="pointer";
        $(img).click(function () {
            location.href='/html/mall_detial.html?productId='+item.jumpId;
        });

        return img;
    }