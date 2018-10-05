/**
 * Created by Administrator on 2018/1/24 0024.
 */
var emailAddress=searchUrl('checkId');

var regExp=/[0-9A-Za-z]{6,21}$/;
$('#submit').click(function () {
    var password1=getDom('#password1').value;
    var password2=getDom('#password2').value;
    if (password1 != "") {
        if (password2 != "") {
            if (password1 == password2) {
                if ((regExp.test(password1))){
                    $.ajax({
                        type: 'POST',
                        url: MAIN_URL + "/pc/center/member/updatePassByMail",
                        dataType: 'json',
                        data: {
                            mailAddress: emailAddress,
                            password: password1
                        },
                        success: function (res) {
                            if(res.success=="success"){
                                layui.use(['layer', 'form'], function () {
                                    layer.msg(res.message);
                                });
                                setTimeout(function () {
                                    location.replace('/html/login.html')
                                },3000);
                            }else {
                                layui.use(['layer', 'form'], function () {
                                    layer.msg(res.message);
                                });
                            }


                            }


                    });
                }else {
                    layui.use(['layer', 'form'], function () {
                        layer.msg("请输入6到21位字符");
                    });
                }


            } else {
                layui.use(['layer', 'form'], function () {
                    layer.msg("两次密码不一样");
                });
            }
        } else {
            layui.use(['layer', 'form'], function () {
                layer.msg("密码不能为空");
            });
        }
    } else {
        layui.use(['layer', 'form'], function () {
            layer.msg("密码不能为空");
        });
    }
});
