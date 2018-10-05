/**
 * Created by Administrator on 2018/1/11 0011.
 */
var validId="";
$(document).ready(function () {
    var src="";
     var email="";
    var phone="";
    $.ajax({
        type: 'get',
        url: MAIN_URL + "/pc/center/member/memberDetail",
        dataType: 'json',

        success: function (res) {
            if (res.success == "success" && !!res.data) {
                if(!!res.data.headImg){
                   // console.log(res.data.headImg.indexOf('http'));
                    if(res.data.headImg.indexOf('http')<0){

                        getDom('#headImg').src = MAIN_IMG+res.data.headImg;
                        getDom('#headImg2').src = MAIN_IMG+res.data.headImg;
                    }else {
                        getDom('#headImg').src = res.data.headImg;
                        getDom('#headImg2').src = res.data.headImg;
                    }
                }



                getDom('#headName').textContent=res.data.memberName;
                getDom('#setName').value=res.data.memberName;

                getDom('#setEmail').value=res.data.mail||'';
                getDom('#phoneNumber').value=res.data.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
                getDom('#phoneNumber1').value=res.data.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
                phone=res.data.mobile;
                email=res.data.mail;
                if(res.data.sex==2){
                    getDom('#nan').checked=false;
                    getDom('#nv').checked=true;
                }else {
                    getDom('#nan').checked=true;
                    getDom('#nv').checked=false;
                }
            }
        }
    });

$('.account_save').click(function () {

    var sex=1;
      if(getDom('#nan').checked==true){
          sex=1
      }else{
          sex=2
    }

    $.ajax({
        type: 'POST',
        url: MAIN_URL + "/pc/center/member/updateMember",
        dataType: 'json',
        data:{
            headImg:src,
            memberName:getDom('#setName').value,
            mail:getDom('#setEmail').value,
            sex:sex
        },
        success: function (res) {
            if (res.success == "success" ) {
                   console.log(res.message);
                layui.use(['layer', 'form'], function () {
                    layer.msg("保存成功");
                });

            }
        }
    });

});
//修改密码
    $('#sendPasserword').click(function () {
        //console.log(email);
        getDom('#sendPasserword').style.color="#919191";
        if(email!=""&&!!email){
            $.ajax({
                type: 'POST',
                url: MAIN_URL + "/pc/center/member/sendMail",
                dataType: 'json',
                data:{

                },
                success: function (res) {
                    if (res.success == "success" ) {
                        //console.log(res.message);
                        layui.use(['layer', 'form'], function () {
                            layer.msg("邮件发送成功，请去邮箱完成修改！");
                            getDom('#sendPasserword').style.color="#5195EA";
                        });
                    }else{
                        layui.use(['layer', 'form'], function () {
                            layer.msg("邮件发送失败！");
                            getDom('#sendPasserword').style.color="#5195EA";
                        });
                    }
                },

            });
        }else {
            layui.use(['layer', 'form'], function () {
                layer.msg("邮箱不存在，请先设置邮箱！");
            });
        }
    });
//修改邮箱
    $('#sendEmail').click(function () {
        getDom('.pop1').style.display="block";
        // $.ajax({
        //     type: 'post',
        //     url: MAIN_URL + "/pc/center/member/sendMail",
        //     dataType: 'json',
        //
        //     success: function (res) {
        //         console.log(111);
        //     }
        // });
    });
    $('#phonesend').click(function () {
        $('#phonesend').addClass("active");
        time = setInterval(function(){
            timeOut1();
        },1000);
        $.ajax({
            type: 'post',
            url: MAIN_URL + "/pc/login/sendRegisterValidNumber",
            data: {
                mobile:phone
            },
            dataType: 'json',
            success: function (res) {
                if(res.success=="success"&&res.statusCode=="200"){
                    validId=res.data.validId;
                    layui.use(['layer', 'form'], function () {
                        layer.msg("发送验证码成功");
                    });

                }else {
                    layui.use(['layer', 'form'], function () {
                        layer.msg("请重新获取验证码");
                    });
                   // console.log(num);

                }
            }
        });
    });
    $('#account_save4').click(function () {
        getDom(".pop1").style.display="none";
    });
    $('#account_save3').click(function () {
        console.log(validId);
        $.ajax({
            type: 'POST',
            url: MAIN_URL + "/pc/center/member/updateMemberMail",
            dataType: 'json',
            data:{
                mail:getDom('#updateEmail').value,
                verification:getDom('#numsend').value,
                validId:validId
            },
            success: function (res) {
                if (res.success == "success" ) {
                    console.log(res.message);
                    layui.use(['layer', 'form'], function () {
                        layer.msg("修改成功");
                    });
                    //getDom('#setEmail').value=getDom('#updateEmail').value;
                    getDom('.pop1').style.display="none";
                    location.reload();

                }else {
                    layui.use(['layer', 'form'], function () {
                        layer.msg(res.message);
                    });
                }
            }
        });
    });

//TODO 点击修改头像 暂时没有
// $('.account_black').click(function () {
// console.log('点击修改头像 暂时没有');
// });

$('#sendNum').click(function () {
     getDom('#sendNum').style.color="#B1B1B1";
    getDom('.pop').style.display="block";

});
    var time;
    var num=60;
    $('#sendNum2').click(function () {
        // console.log(11);
        if(num != 60){
            return;
        }
        var isPhone = /^1[34578]\d{9}$/;
        if (!isPhone.test(getDom('#updatePhone').value)) {
            layui.use(['layer', 'form'], function () {
                layer.msg("电话填写有误");
            });
        }else {
            $('#sendNum2').addClass("active");
            time = setInterval(function(){
                timeOut();
            },1000);
            $.ajax({
                type: 'post',
                url: MAIN_URL + "/pc/login/sendRegisterValidNumber",
                data: {
                    mobile:phone
                },
                dataType: 'json',
                success: function (res) {
                    if(res.success=="success"&&res.statusCode=="200"){
                        validId=res.data.validId;
                        layui.use(['layer', 'form'], function () {
                            layer.msg("发送验证码成功");
                        });

                    }else {
                        layui.use(['layer', 'form'], function () {
                            layer.msg("请重新获取验证码");
                        });
                        console.log(num);

                    }
                }
            });
        }

    });
    function timeOut() {
        //console.log(num);
        $('#sendNum2').html(num);
        if (num === 0) {
            $('#sendNum2').html('获取验证码');
            num = 60;
            clearInterval(time);
            $('#sendNum2').removeClass("active");
            // $('#sendNum2').attr("style","background-color:#5195EA");
        }
        num --;
    }
    function timeOut1() {
        //console.log(num);
        $('#phonesend').html(num);
        if (num === 0) {
            $('#phonesend').html('获取手机验证码');
            num = 60;
            clearInterval(time);
            $('#phonesend').removeClass("active");
            // $('#sendNum2').attr("style","background-color:#5195EA");
        }
        num --;
    }
    //  //TODO 获取验证码还未完善
    $('#account_save2').click(function () {
        getDom(".pop").style.display="none";
    });
$('#account_save1').click(function () {
    console.log(validId);
    $.ajax({
        type: 'POST',
        url: MAIN_URL + "/pc/center/member/updateMemberMobile",
        dataType: 'json',
        data:{
            mobile:getDom('#updatePhone').value,
            verification:getDom('#updateNum').value,
            validId:validId
        },
        success: function (res) {
            if (res.success == "success" ) {
                   console.log(res.message);
                layui.use(['layer', 'form'], function () {
                    layer.msg("修改成功");
                });
                // getDom('#setPhone').value=getDom('#updatePhone').value;
                getDom('.pop').style.display="none";
                location.reload();

            }else {
                layui.use(['layer', 'form'], function () {
                    layer.msg(res.message);
                });
            }
        }
    });
});
    $("#timeLimit_create_images").change(function () {

        $("#timeLimit_create_images_upLoad").ajaxSubmit(function (data) {
            if (typeof (data) == "string") {
                data = JSON.parse(data);
            }
            if (data.success == "success") {
                // div_html是包括图片和图片名称的容器
                 src=data.data.map.uri;
                getDom('#headImg2').src=MAIN_IMG+data.data.map.uri;


            }
            if (data.success == 'error') {
                Modal.alert({title: "温馨提示", message: data.message, icon: 'error'})
            }
        });
    });
});

