/**
 * Created by Administrator on 2017/12/27 0027.
 */
/**
 * Created by ji on 2017/11/21.
 */
layui.use(['form', 'jquery', 'layer'], function () {
    var form = layui.form;
    var $ = layui.jquery;
    var layer = layui.layer; //独立版的layer无需执行这一句
    var $distpicker = $('#distpicker');
    var _addressId = "";//地址ID
    var _memberCouponId = "";//优惠卷id
    // var _ids = "";//购物车ID
    // var _productId = 21;//商品ID
    // var _goodsId = 46;//商品规格ID
    // var _num = "";
    var addressId = "";
    var _totalPrice = 0;
    var qaq="";
    // $distpicker.distpicker({
    //     province: '北京市',
    //     city: '北京市市辖区',
    //     district: '东城区'
    // });
    // var ids = getSessionData('ids');
    // var nowBuy = getSessionData('nowBuy');
    // var queryData = {
    //     ids: "",
    //     productId: "",
    //     num: "",
    //     goodsId: ""
    // };
    // if (!!ids) {
    //     ids = JSON.parse(ids);
    //     queryData.ids = ids.join(',');
    // }
    // if (!!nowBuy) {
    //     nowBuy = JSON.parse(nowBuy);
    //     queryData.productId = nowBuy.goodsId;
    //     queryData.num = nowBuy.num;
    //     queryData.goodsId = nowBuy.specId;
    // }
//我怕的地址
    function address() {
        getDom('#address').innerHTML = '';
        $.ajax({
            type: 'get',
            url: MAIN_URL + "/pc/center/member/memberAddressList",
            dataType: 'json',
              asunc:false,
            success: function (res) {
                if (res.success == "success" && !!res.data) {

                    qaq=res.data.id;
                    //console.log(res.data);
                    res.data.forEach(function (item, index) {
                        var dom = createDomAddress(item, index);
                        getDom('#address').appendChild(dom);
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
                   // console.log(res.data);
                    if(!!res.data.headImg){
                        getDom('#headImg').src= MAIN_IMG+res.data.headImg;
                    }
                    getDom('#headName').textContent=res.data.nickName;
                }
            }
        });

    }

    address();




    function createDomAddress(res, index) {
        var div = createDom('div');
        div.classList.add('address');
        if (res.defult == true) {
            div.classList.add('no');
        }
        var div1 = createDom('div');
        div1.classList.add('address01');
        div.appendChild(div1);
        var p = createDom('p');
        div1.appendChild(p);
        var span = createDom('span');
        span.textContent = res.provinceName + res.cityName;
        p.appendChild(span);
        var span1 = createDom('span');
        span1.textContent = " (" + res.name + "收)";
        p.appendChild(span1);
        // var a = createDom('a');
        // // a.classList.add('default');
        // a.textContent = "设为默认";
        // div1.appendChild(a);
        // if (res.defult == true) {
        //     // var a = createDom('a');
        //     a.classList.add('default');
        //     a.textContent = "默认地址";
        //     // div1.appendChild(a);
        //     // getDom('#addressDeralw').textContent = res.provinceName+res.cityName+res.areaName + res.addressDetail;
        //     // getDom("#addressName").textContent = res.name +"          "+ res.mobile;
        //     // _addressId = res.id;
        // }
        var div3 = createDom('div');
        div3.classList.add('address02');
        div3.textContent = res.areaName + res.addressDetail;
        div.appendChild(div3);
        var div4 = createDom('div');
        div4.classList.add('address03');
        div.appendChild(div4);
        var a1 = createDom('a');
        a1.classList.add('modify');
        a1.textContent = "修改";
        div4.appendChild(a1);
        var a2 = createDom('a');
        a2.classList.add('delete');
        a2.textContent = "删除";
        div4.appendChild(a2);
        $(div).click(function (e) {
            setDefault(res.id);
            var doms = getDoms('.address');
            // getDom('#addressDeralw').textContent = res.provinceName+res.cityName+res.areaName + res.addressDetail;
            // getDom("#addressName").textContent = res.name + "          " + res.mobile;
            _addressId = res.id;
            doms.forEach(function (item, index) {
                if (!!getDom('.no')) {
                    getDom('.no').classList.remove('no');
                }
                div.classList.add('no');
            });
        });
        //修改地址
        $(a1).click(function (e) {
            e.stopPropagation();
            saveAddress(res);

        });
        //删除地址
        $(a2).click(function (e) {
            e.stopPropagation();
            delectAddress(res.id);

        });
        return div;

    }

    $("#settlement_submit").click(function () {
        submitOrder();

    })
    //关闭收获地址
    $("#title").click(function () {
        addressId = "";
        getDom('#bomb').style.display = "none";
        $distpicker.distpicker('reset', true);
        $('#myform')[0].reset();
    })
    //添加收获地址
    $('#address_new').click(function () {
        $distpicker.distpicker('destroy');
        $distpicker.distpicker({
            province: '北京市',
            city: '北京市市辖区',
            district: '东城区'
        });

        getDom('#bomb').style.display = "block";
    });
    //
//添加地址


    //自定义验证规则
    form.verify({
        name: function (value) {
            if (value.length > 25) {
                return '收货人名称最多25个字符啊';
            }
        },
        address: function (value) {
            if (value.length > 100) {
                return '收货人地址最多200个字符啊';
            }
        }
        , content: function (value) {
            layedit.sync(editIndex);
        }
        ,mobile:function(value){
            var myreg = /^1[34578][0-9]{9}/;
            if(!myreg.test(value))
            {
                return '请输入有效的手机号码';

            }
        }
    });

    //监听提交
    form.on('submit(demo1)', function (data) {
        //console.log(data.field);
        var data = data.field;
        var option = $("#province option:selected");
        var city = $("#city option:selected");
        var district = $("#district option:selected");
        data.provinceName = option.val();

        data.memberId = qaq;
        data.provinceCode = option.attr("data-code");
        data.cityName = city.val();
        data.cityCode = city.attr("data-code");
        data.areaName = district.val();
        data.areaCode = district.attr("data-code");
        if (!!data.defult) {
            data.defult = true;
        } else {
            data.defult = false;
        }
        if (addressId != "") {
            data.id = addressId;
            savaddressItem(data);
        } else {
            addAddressItem(data)
        }

        return false;
    });
//修改地址
    function saveAddress(item) {
        $distpicker.distpicker('destroy');
        $distpicker.distpicker({
            province: item.provinceName,
            city: item.cityName,
            district: item.areaName
        });
        addressId = item.id;
        $("#name").val(item.name)
        $('#addressinfor').val(item.addressDetail)
        $('#number').val(item.zipCode)
        $('#phone').val(item.mobile);
        if (item.defult == true) {
            getDom('#checked').checked = 'checked';
        } else {
            getDom('#checked').checked = false;
        }
        form.render(); //更新全部
        getDom('#bomb').style.display = "block";
    }

    //删除地址
    function delectAddress(Id) {
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
                    type: 'POST',
                    url: MAIN_URL + "/pc/center/member/deleteAddress",
                    dataType: 'json',
                    data: {
                        addressId: Id
                    },
                    success: function (res) {
                        if (res.success == "success") {
                            layer.msg(res.message, {icon: 1});
                            address();
                        }
                    }
                });
            }
        });
    }

    //修改地址ajax
    function savaddressItem(res) {
        console.log(res.memberId);
        $.ajax({
            type: 'POST',
            url: MAIN_URL + "/pc/center/member/updateAddress",
            dataType: 'json',
            data: res,
            success: function (res) {
                if (res.success == "success") {
                    getDom('#bomb').style.display = "none";
                    layer.msg(res.message, {icon: 1});
                    getDom('#address').innerHTML = "";
                    address();
                    addressId = "";

                }
            }
        });
    }

    //添加地址
    function addAddressItem(res) {
        $.ajax({
            type: 'POST',
            url: MAIN_URL + "/pc/center/member/createAddress",
            dataType: 'json',
            data: res,
            success: function (res) {
                if (res.success == "success") {

                    getDom('#bomb').style.display = "none";
                    layer.msg(res.message, {icon: 1});
                    getDom('#address').innerHTML = "";
                    address();
                }

            }
        });
    }
//设置默认地址
    function setDefault(addressId) {
        $.ajax({
            type: 'POST',
            url: MAIN_URL + "/pc/center/member/setDefaultAddress",
            dataType: 'json',
            data:{
                addressId:addressId
            },
            success: function (res) {
                if (res.success == "success") {
                   //  var doms = getDoms('.address');
                   //  // getDom('#addressDeralw').textContent = res.provinceName+res.cityName+res.areaName + res.addressDetail;
                   //  // getDom("#addressName").textContent = res.name + "          " + res.mobile;
                   //  _addressId = res.id;
                   //  doms.forEach(function (item, index) {
                   //      if (!!getDom('.no')) {
                   //          getDom('.no').classList.remove('no');
                   //      }
                   //      div.classList.add('no');
                   //  });
                   //
                   // location.href="#";
                        layui.use(['layer', 'form'], function () {
                            layer.msg(res.message);
                        });
                }

            }
        });
        
    }

});/**
 * Created by Administrator on 2018/1/10 0010.
 */
