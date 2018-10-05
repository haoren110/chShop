/**
 * Created by Administrator on 2018/1/9 0009.
 */
$(document).ready(function () {
    var classId=searchUrl('type');
    var noInput=searchUrl('noInput');
    var input = getSessionData('input');
    var count;
    var pageModel = {
        categoryId: classId,
        attributesJson: {},
        brandId: "",
        sortord: 1,
        sortStr: "createTime",
        pageSize: 8,
        pageNo: 0,
        sortType:1,
        pageIndex:0
    };
    // console.log(pageModel.categoryId);
    if (!!input&&noInput!=1) {
        // input = JSON.parse(input);

        seek(input.text);
    }

    if (input == ""||!input||noInput==1) {
        initList();
        creatCategoryId();
    }


    var strList = {
        0: "createTime",
        1: "actualSaleCount",
        2: "actualPrice",
        3: "commentTotal",
        4: "createTime"
    };
    //tab切换
    var isFirst = "";//判断切换的dom与上一次是否是同一个；
    var tabDoms = getDom('#tab').querySelectorAll('.seeklist');
    if (!!tabDoms) {

        tabDoms.forEach(function (item, index) {
            if (index == 0) {
                isFirst = item;//第一次默认赋值；
            }
            $(item).click(function () {

                var fDom = getDom('#tab').querySelector('.active');
                if (!!fDom) {
                    fDom.classList.remove('active');
                }
                item.classList.add('active');
                if (item == isFirst) {//只有和上一次是同一个dom才切换图标，预防切换tab时直接把图标也切换；
                    var span = item.children[0];
                    if (span.classList[0] == "icon-arrowdown") {
                        span.classList.remove('icon-arrowdown');
                        span.classList.add('icon-arrowup');
                        pageModel.sortType = 0;
                    } else {
                        span.classList.remove('icon-arrowup');
                        span.classList.add('icon-arrowdown');
                        pageModel.sortType = 1;
                    }
                } else {
                    var updom = getDom('#tab').querySelector('.icon-arrowup');
                    if (!!updom) {
                        updom.classList.remove('icon-arrowup');
                        updom.classList.add('icon-arrowdown');
                    }
                    pageModel.sortType = 0;//切换tab 默认图标不换，恢复默认
                }
                pageModel.sortStr = strList[item.getAttribute('attr')];
                pageModel.pageIndex=0;
                isFirst = item;
                getDom('.product_list').innerHTML='';
                if (!!input&&noInput!=1) {
                    // input = JSON.parse(input);

                    seek(input.text);
                }else {
                    initList();
                }

            })
        })
    }
    function creatCategoryId() {
        $.ajax({
            type: 'POST',
            url: MAIN_URL + "/pc/category/getBrandByCategoryId",
            dataType: 'json',
            data: {
                categoryId:classId
            },
            success: function (res) {
                if (res.success == "success" && !!res.data) {
                   // console.log(res.data);
                    res.data.forEach(function (item, index) {
                        var dom = createclass(item,index);

                        getDom('.productType').appendChild(dom);

                    })
                }
            }
        });
    }
    /*
    * 创建品牌分类*/
    function createclass(item,index) {
           var img= createDom('img');
           img.classList.add('productTypeImg');
           img.src=MAIN_IMG+item.imgUrl;
           img.title=item.name;
           $(img).click(function () {
               getDoms('.active2').forEach(function (item,index) {
                   item.classList.remove('active2');
               });
                    img.classList.add('active2');
                    pageModel.brandId=item.id;
               getDom('.product_list').innerHTML='';
                    initList();
           });
           return img;
    }
    function initList() {

        var param = cleanEmptyProperty({

            categoryId: pageModel.categoryId,
            attributesJson: pageModel.attributesJson,
            brandIds: pageModel.brandId,
            // sortord: pageModel.sortord,
            sortType:pageModel.sortType,
            sortStr: pageModel.sortStr,
            size: pageModel.pageSize,
            page: pageModel.pageIndex
        });
        $.ajax({
            type: 'POST',
            url: MAIN_URL + '/pc/product/searchProductByOther',
            data: param,
            success: function (response) {
                if (response.success == "success") {
                    // getDom('.product_list').innerHTML = '';
                    if (!!response.data.productList && response.data.totalCount > 0) {
                        getDom('#noshopCar').style.display = 'none';

                        response.data.productList.forEach(function (item, index) {
                            var dom = createProductList(item,index);
                            getDom('.product_list').appendChild(dom);
                        })
                    }else{
                        getDom('.shop').style.display = 'none';
                        getDom('#noshopCar').style.display = 'block';

                    }
                }
                // if (!!response.data.totalCount ) {
                if (!!response.data.totalCount && pageModel.pageIndex == 0) {
                    count=response.data.totalCount;
                    initLaypage();
                    //console.log(11);
                }
            }
        });
    }
    /*
    * 创建商品列表*/
    function createProductList(item,index) {
        var div= createDom('div');
        div.classList.add('product_style');

            div.classList.add('border'+index%5);
        var div3=createDom('div');
        div3.classList.add('box');
        div.appendChild(div3);
        var img= createDom('img');
        img.classList.add('productImg');
        // img.style.width='160px';
        img.src=MAIN_IMG+item.images;
        $(img).click(function () {
            //console.log(111);
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
        btn.classList.add('button'+index%5);
        btn.textContent='立即购买';
        $(btn).click(function () {
            var ary = {
                specId: item.id,
                num: 1,
                goodsId: item.productGood.id
            };
            setSessionData('nowBuy', JSON.stringify(ary));
            setSessionData('ids', "");
            location.href="/html/confirm_order.html";
        });
        div2.appendChild(btn);

        return div;
    }
    //搜索
    function seek(text) {
        $.ajax({
            type: 'post',
            url: MAIN_URL + '/pc/product/searchProductAndAttrByName',
            data: {
//TODO先写死
//              size: pageModel.pageSize,
                size:pageModel.pageSize,
                page: pageModel.pageIndex,
                searchName: text,
                sortType:pageModel.sortType,
                sortStr:pageModel.sortStr
            },
            dataType: 'json',
            success: function (res) {
                if (res.success == "success"&&!!res.data.totalCount) {
                    getDom('.productTypeText').textContent="";
                    getDom('.product_list').innerHTML = '';
                    if (!!res.data.productGood && res.data.totalCount > 0) {
                        getDom('#noshopCar').style.display = 'none';
                        res.data.productGood.forEach(function (item, index) {
                            var dom = createProductList(item);
                            getDom('.product_list').appendChild(dom);
                        })
                    }else{
                        getDom('#noshopCar').style.display = 'block';

                    }
                    if (!!res.data.totalCount && pageModel.pageIndex == 0) {
                        count=res.data.totalCount;
                        initLaypage();
                    }

                }
            }
        });
    }
    function initLaypage() {

        layui.use('laypage', function () {
            var laypage = layui.laypage;
            //执行一个laypage实例
            laypage.render({
                elem: 'pageList' //注意，这里的 test1 是 ID，不用加 # 号
                , count: count //数据总数，从服务端得到
                , limit: 8
                , curr: 1
               // , first: 1
                , jump: function (obj, first) {
                    //obj包含了当前分页的所有参数，比如：
                    //console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                   // console.log(obj.limit); //得到每页显示的条数
                    pageModel.pageIndex = obj.curr - 1;

                    //首次不执行
                    if (!first) {

                        getDom('#productList').innerHTML="";
                        if (!!input&&noInput!=1) {
                            // input = JSON.parse(input);

                            seek(input.text);
                        }else {
                            initList();
                        }
                    }
                }
            });
        });
    }
});

/*
*  <div class="product_style">
 <img src="/img/Home_12.png" class="productImg" style="width: 160px">
 <p class="productName">小米圈铁耳机Pro</p>
 <div>¥149.00</div>
 <div class="mask">
 <button>立即购买</button>
 </div>
 </div>*/