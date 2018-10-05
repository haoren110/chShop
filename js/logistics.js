/**
 * Created by ji on 2017/11/21.
 */
//'/html/center/logistics.html?company=' + company + '&number=' + number + '&orderNum=' + orderNum;
$(document).ready(function () {
   var expressCompany= searchUrl('company');
    var expressNum= searchUrl('number');
    var  orederId=searchUrl('orderNum');

//物流信息
      getDom('#logisticsName').textContent="物流公司："+expressCompany;
    getDom('#logisticsNum').textContent=expressNum;

    $.ajax({
        type: 'post',
        url: MAIN_URL + "/pc/center/order/selectProductLogistics",
        data: {
            // expressCompany: searchUrl('company'),
            // expressNum:searchUrl('number')
            expressCompany: expressCompany,
            expressNum:expressNum
        },
        success: function (res) {
            //console.log(res);
            if(res.success=='success'){
                res.data.expressList.forEach(function (item,index) {
                    var dom= createLogInformation(item,index);
                    getDom('.logistics_detail').appendChild(dom);
                });

            }
        }
    });
    $.ajax({
        type: 'GET',
        url: MAIN_URL + "/pc/center/order/orderDetail",
        data: {
            ordersId:orederId
           // ordersId:13
        },
        success: function (res) {
            console.log(res);
            if(res.success=='success'){
             getDom('#logisticsAdress').textContent="收货地址："+res.data.orders.addressDetail;
                getDom('#logisticsName1').textContent=res.data.orders.name;
                getDom('#logisticsPhone').textContent="联系方式："+res.data.orders.mobile;

            }
        }
    });
    /*
    * <div class="logisticsInformation">
     <p class="fontBold">收货信息</p>
     <p class="logisticsP">收货地址：陕西省西安市雁塔区丈八东路</p>
     <p class="logisticsP">姓名：花开半夏</p>
     <p class="logisticsP">联系方式：13888888888</p>
     </div>*/
    function createLogInformation(item,index) {
        var div= createDom('div');
        div.classList.add('logistics_detail01');
        var div1= createDom('div');
        div1.classList.add('logistics_line');
        div.appendChild(div1);
        var img= createDom('img');
        if(index==0){
            img.src="/img/personal_center_11.png";
        }else {
            img.src="/img/personal_center_10.png";
        }
        div1.appendChild(img);
        var div2= createDom('div');
        div2.textContent=item.time;
        div2.classList.add('logistics_day');
        div.appendChild(div2);
        var div3= createDom('div');
        div3.classList.add('logistics_time');
        div3.textContent=item.context;
        div.appendChild(div3);
        return div;
    }

});

/*
* <div class="logistics_detail01">
 <div class="logistics_line"><img src="/img/personal_center_10.png"/></div>
 <div class="logistics_day">2017-06-19</div>
 <div class="logistics_week">周一</div>
 <div class="logistics_time">12:29:04 卖家发货</div>
 </div>*/