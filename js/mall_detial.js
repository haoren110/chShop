/**
 * Created by Administrator on 2018/1/9 0009.
 */
$(document).ready(function () {
    var productId= searchUrl("productId");
    var add=getDom('#btn-add');
    var jian=getDom('#btn-reduce');
    var num=getDom('#buy-num');//购买数量
    var _typeId = "";//规格Id
    var productStatus=false;
    var pageModel={
        page:0,
        size:10,
        productId:productId,
        pageIndex:0,
        evaluateLabelId:""

    };
    $(add).click(function () {
        num.value=Number(num.value) +1;
    });
    $(jian).click(function () {
        if(Number(num.value)>1){
        num.value=Number(num.value)-1;
        }
    });
    var isLogin=getSessionData('sid');
    //console.log(isLogin!="");
    if(!!isLogin&&isLogin!=""){
        //收藏

            $.ajax({
                type: 'POST',
                url: MAIN_URL + "/pc/product/checkProductCollection",
                dataType: 'json',
                data: {
                    productId:productId
                },
                success: function (res) {

                     if(res.data){
                         getDom('.collectImg').src='/img/personal_center_19.png'
                     }


                }
            });

    }
    //
    //收藏
    $('.collect').click(function () {
        $.ajax({
            type: 'POST',
            url: MAIN_URL + "/pc/collection/addProductToCollection",
            dataType: 'json',
            data: {
                productId:productId
            },
            success: function (res) {

                    layui.use(['layer', 'form'], function () {
                        layer.msg(res.message);
                    });
                    getDom('.collectImg').src='/img/personal_center_19.png'

            }
        });
    });
    //推荐
    $.ajax({
        type: 'POST',
        url: MAIN_URL + "/pc/product/getRecommendProduct",
        dataType: 'json',
        data: {

        },
        success: function (res) {
            if (res.success == "success" && !!res.data) {
               // console.log(res.data);
                res.data.forEach(function (item, index) {
                    var dom = createSliderItem(item.product,item.productGoods,index);
                    if(index<=4){
                        getDom('.recommend_list').appendChild(dom);
                    }
                })
            }
        }
    });

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
                    //console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                    //console.log(pageModel.pageIndex); //得到每页显示的条数
                    pageModel.pageIndex = obj.curr - 1;
                    //首次不执行
                    if (!first) {
                        getDom('#commentItem').innerHTML="";
                        creatEvaluate();
                    }
                }
            });
        });
    }

        //评价
        function creatEvaluate() {
            var data= cleanEmptyProperty({
                page:pageModel.pageIndex,
                size:10,
                // productId:productId
                productId:pageModel.productId,
                evaluateLabelId:pageModel.evaluateLabelId

            });
            $.ajax({
                type: 'POST',
                url: MAIN_URL + "/pc/product/getProductComment",
                dataType: 'json',
                data: data,
                success: function (res) {
                    if (res.success == "success" && res.data!=0) {
                        //console.log(res.data);
                        res.data.list.forEach(function (item, index) {
                            var dom = createevaluate(item,index);
                            getDom('#commentItem').appendChild(dom);
                        })
                        if(!!res.data.total&&pageModel.pageIndex==0){
                            initLaypage(res.data.total);
                        }
                    }else {
                        getDom('#noshopCar').style.display="block";
                    }
                }
            });
        }

    //创建规格
    function createProductGood (item,index) {
        //onsole.log(item);
        var a= createDom('a');
        // a.classList.add('now');
        if(index==0){
            a.classList.add('now');
            _typeId = item.id;
        }
        a.id=item.id;
        a.href="#";
        a.title="熊猫套装";
        var span= createDom('span');
        //console.log(item.normsNameStr);
        span.textContent=item.normsNameStr;
        $(a).click(function () {
            var now= getDom('.now');
            now.classList.remove('now');
            a.classList.add('now');
            _typeId = item.id;
           var price=getDom('#price');
           price.textContent="￥"+item.money;
           //console.log(_typeId);

        });
        a.appendChild(span);
        return a;
    }
    //商品详情
    $.ajax({
        type: 'POST',
        url: MAIN_URL + "/pc/product/getProductDetails",
        dataType: 'json',
        data: {
            page:0,
            size:10,
            productId:productId
        },
        success: function (res) {

            if (res.success == "success" && !!res.map) {
               // console.log(res.map.productGood[0].id);
                getDom('.imgname').textContent=res.map.product.productName;
                getDom('.tips').textContent=res.map.product.productDetail;
                getDom('#price').textContent="￥"+res.map.product.actualPrice;
                // getDom('.showboximg').src=MAIN_IMG+res.map.product.images;
                getDom('#mall_detial').innerHTML = res.map.product.description;
                if(res.map.product.productStatus=='UPPER'){
                    productStatus=true
                }
                res.map.images.forEach(function (item,index) {
                    var dom= createDom('div');
                    dom.classList.add('showboximg');
                    var img= createDom('img');
                    img.src= MAIN_IMG+item.imageUrl;
                    dom.appendChild(img);
                    getDom('#imgList1').appendChild(dom);
                });
                lunbo();
                //轮播图
                //评论标签

                    if (!!res.map.evaluateLabelList && res.map.evaluateLabelList.length > 0) {
                        var all= getDom('#comm_all');
                        //all.textContent='('+res.map.evaluateMap.total+')';
                        creatEvaluate();
                        res.map.evaluateLabelList.forEach(function (item, index) {
                           // console.log(item);
                            var labelList = createLabel(item, index);
                            getDom('.crist_tj').appendChild(labelList);
                        })
                    }


                //规格
                if(res.map.productGood[0].normsNameStr != ""){
                    res.map.productGood.forEach(function (item,index) {

                         var dom = createProductGood(item,index);
                         getDom('.shopimg').appendChild(dom);
                    });
                }else{
                    _typeId=res.map.productGood[0].id;
                    removeDom(getDom('.product_infor_middle'));
                }
            }
        }
    });
//加入购物车
    $("#AddshopCar").click(function () {
        //console.log(111);
        if (_typeId == "") {
            layui.use(['layer', 'form'], function () {
                layer.msg("请选择规格");
            });
            return false;
        }else if(!productStatus){
            layui.use(['layer', 'form'], function () {
                layer.msg("商品已下架！");
            });
            return false;
        }

        $.ajax({
            type: 'POST',
            url: MAIN_URL + '/pc/mall/shopCart/joinShopCart',
            data: {
                productId: productId,
                goodsId: _typeId,
                num:  num.value
            },
            dataType: 'json',
            success: function (res) {
                if (res.success == "success") {
                    layui.use(['layer', 'form'], function () {
                        layer.msg(res.message);
                    });
                }
            }
        });
    })



    //立即购买
    $("#buyNow").click(function () {
        if (_typeId == "") {
            layui.use(['layer', 'form'], function () {
                layer.msg("请选择规格");
            });
            return;
        }else if(!productStatus){
            layui.use(['layer', 'form'], function () {
                layer.msg("商品已下架！");
            });
            return false;
        }

        var ary = {
            specId: productId,
            num: num.value,
            goodsId: _typeId
        };
        setSessionData('nowBuy', JSON.stringify(ary));
        setSessionData('ids', "");
        location.href = "/html/confirm_order.html";

    });

    //商品详情切换
    var shopDatrile = getDoms('.table_change >.Itemchange');
    var MALL_DETIAL=getDom('.mall_detial');
    var  CRIST_DETIAL=getDom('.crist_detial');
    shopDatrile.forEach(function (item, index) {
        $(item).click(function (e) {
            var d = getDom('.act');
            if (!!d) {
                d.classList.remove('act')
            }
            item.classList.add('act');
            //console.log(e.currentTarget.dataset.slide);
            if (e.currentTarget.dataset.slide == 1) {
                CRIST_DETIAL.style.display = "none";
                MALL_DETIAL.style.display = "block";
            } else if (e.currentTarget.dataset.slide == 2) {
                MALL_DETIAL.style.display = "none";
                CRIST_DETIAL.style.display = "block";

            }
        })
    })
    function createLabel(item,index) {
        var span= createDom('span');
        // span.classList.add('color');
        span.id=item.id;
        var span1= createDom('span');
        span1.textContent=item.evaluateLabelContext;
        span.appendChild(span1);
        var b= createDom('b');
        b.textContent="("+item.num+")";
        span.appendChild(b);
        $(span).click(function () {
            getDom('.color').classList.remove('color');
            span.classList.add('color');
            pageModel.evaluateLabelId=item.id;
            getDom('#commentItem').innerHTML="";
            creatEvaluate();
        });
        return span;
    }
});

//轮播图
function lunbo() {
    layui.use(['carousel', 'form'], function () {
        var carousel = layui.carousel
            , form = layui.form;

        //常规轮播
        carousel.render({
            elem: '#test1'
            , arrow: 'always'
        });

        //改变下时间间隔、动画类型、高度
        carousel.render({
            elem: '#test2'
            , interval: 1800
            , anim: 'fade'
            , height: '120px'
        });

        //设定各种参数
        var ins3 = carousel.render({
            elem: '#test3'
        });
        //图片轮播
        carousel.render({
            elem: '#test1'
            , width: '464px'
            , height: '464px'
            , interval: 5000
        });

        //事件
        carousel.on('change(test4)', function (res) {
            //console.log(res)
        });

        var $ = layui.$, active = {
            set: function (othis) {
                var THIS = 'layui-bg-normal'
                    , key = othis.data('key')
                    , options = {};

                othis.css('background-color', '#5FB878').siblings().removeAttr('style');
                options[key] = othis.data('value');
                ins3.reload(options);
            }
        };

        //监听开关
        form.on('switch(autoplay)', function () {
            ins3.reload({
                autoplay: this.checked
            });
        });

        $('.demoSet').on('keyup', function () {
            var value = this.value
                , options = {};
            if (!/^\d+$/.test(value)) return;

            options[this.name] = value;
            ins3.reload(options);
        });
    });
}

/*
*  <div class="product_infor_middle clearfix">
 <div id="type">
 <span class="kuanshi pull_left">选择颜色：</span>
 <div class="shopimg pull_left" >
 <a href="#" title="熊猫套装" class="now">
 <!--<img src="../img/goods_detail_09.png">-->
 <span>爆款直降  中果 2个装</span>
 </a>
 <a href="#" title="熊猫套装">
 <!--<img src="../img/goods_detail_10.png">-->
 <span>爆款直降  中果 2个装</span>
 </a>


 </div>
 </div>
 </div>*/
function createSliderItem(item,index,index1) {
     var div= createDom('div');
     div.classList.add('recommend_list_item');
     div.classList.add('border'+index1%5);
     div.classList.add('active');
     var div1= createDom('div');
     div1.classList.add('recommend_img');
     div.appendChild(div1);
     var div2= createDom('div');
     div1.appendChild(div2);
     var img= createDom('img');
     img.style.height="160px;"
     img.src=MAIN_IMG+item.images;
     $(img).click(function () {
         location.href='/html/mall_detial.html?productId='+item.id;
     });
     div2.appendChild(img);
     var p= createDom('p');
     p.classList.add('button'+index1%5);
     p.textContent='立即购买';
     $(p).click(function () {
         var ary = {
             specId: item.id,
             num: 1,
             goodsId: index.id
         };
         setSessionData('nowBuy', JSON.stringify(ary));
         setSessionData('ids', "");
         location.href="/html/confirm_order.html";
     });
     div1.appendChild(p);
     var p1= createDom('p');
     p1.classList.add('recommend_name');
     p1.textContent=item.productName;
     div.appendChild(p1);
     var p2= createDom('p');
     p2.classList.add('recommend_price');
     p2.textContent="￥"+item.actualPrice;
     div.appendChild(p2);
     return div;
}

//商品评价渲染
function createevaluate(res,index) {
    var div = createDom('div');
    div.classList.add('crist_list');
    div.classList.add('clearfix');
    var div1 = createDom('div');
    div1.classList.add('pull_left');
    div1.classList.add('men');
    div.appendChild(div1);
    var div2 = createDom('div');
    div2.classList.add('crister_header');
    div1.appendChild(div2);
    var img = createDom('img');
    img.src = MAIN_IMG+res.memberImage;
    div2.appendChild(img);
    var p = createDom('p');
    p.textContent = res.memberName;
    div1.appendChild(p);
    var p1 = createDom('p');
    p1.classList.add('level');
    div1.appendChild(p1);
    // var span = createDom('span');
    // span.textContent = "L1";
    // p1.appendChild(span);
    var div3 = createDom('div');
    div3.classList.add('pull_left');
    div3.classList.add('men_content');
    div.appendChild(div3);
    var div4 = createDom('div');
    div4.classList.add('crist_content');
    div4.textContent = res.evaluateRemark;
    div3.appendChild(div4);

    if (!!res.evaluateImg) {
        var imgs = res.evaluateImg.split(',');
        // var div1 = createDom('div');
        // div1.classList.add('img-list');
        var div5 = createDom('div');
        div5.classList.add('crist_img');

        imgs.forEach(function (item, index) {
            var div6 = createDom('div');
            div6.classList.add('img-box');
            var img1 = createDom('img');//data-preview-src="" data-preview-group="1"
            img1.setAttribute('data-preview-src', "");
            img1.setAttribute('data-preview-group', "1");
            img1.src = MAIN_IMG + item;
            div6.appendChild(img1);
            div5.appendChild(div6);
        });
        div3.appendChild(div5);
    }
    var div7 = createDom('div');
    div7.classList.add('pull_right');
    div7.classList.add('crist_star');
    div.appendChild(div7);
    var pa = createDom('p');
    div7.appendChild(pa);

    for (var i = 0; i < res.evaluateNum; i++) {
        var spana1 = createDom('span');
        spana1.classList.add('right-star');
        var imgStar = createDom('img');
        imgStar.src = '/img/personal_center_19.png';
        spana1.appendChild(imgStar);
        pa.appendChild(spana1);
    }
    for (var j = 0; j < 5 - res.evaluateNum; j++) {
        var spana1 = createDom('span');
        spana1.classList.add('right-star');
        imgStar = createDom('img');
        imgStar.src = '/img/personal_center_20.png';
        spana1.appendChild(imgStar);
        pa.appendChild(spana1);
    }

    var p2 = createDom('p');
    var dateTest = new Date(res.evaluateTime);
    p2.textContent = formatDate(dateTest, "yyyy-MM-dd hh:mm:ss");
    pa.appendChild(p2);
    return div;
}





//selectPrice
  function selectPrice(a) {
      $.ajax({
          type: 'post',
          url: MAIN_URL + '/pc/product/getProductGoodsDetails',
          data: a,
          dataType: 'json',
          success: function (res) {
              if (res.success == "success") {
                  layui.use(['layer', 'form'], function () {
                      layer.msg(res.message);
                  });
              }
          }
      });
  }