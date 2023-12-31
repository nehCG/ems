layui.use(['form', 'jquery', 'jquery_cookie'], function () {
    var form = layui.form,
        layer = layui.layer,
        $ = layui.jquery,
        $ = layui.jquery_cookie($);

    form.on('submit(login)', function (data) {
        $.ajax({
            type: "post",
            url: ctx + "/user/login",
            data: {
                userName: data.field.username,
                userPwd: data.field.password
            },
            success: function (result) {
                if (result.code == 200) {
                    layer.msg("Login Successful！", function () {
                        if ($("#rememberMe").prop("checked")) {
                            $.cookie("userIdStr", result.result.userIdStr, {expires: 7});
                            $.cookie("userName", result.result.userName, {expires: 7});
                            $.cookie("trueName", result.result.trueName, {expires: 7});
                        } else {
                            $.cookie("userIdStr", result.result.userIdStr);
                            $.cookie("userName", result.result.userName);
                            $.cookie("trueName", result.result.trueName);
                        }
                        window.location.href = ctx + "/main";
                    });
                } else {
                    layer.msg(result.msg, {icon: 5});
                }
            }
        });
        return false;
    });
});