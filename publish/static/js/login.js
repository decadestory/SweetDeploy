
$('[submit]').on("click", function () {

    var acc = $('input[name=sd-account]').val();
    var pwd = $('input[name=sd-password]').val();

    $.ajax({
        url: "/submit",
        type: "post",
        data: {
            sd_account: acc,
            sd_password: pwd
        },
        success: function (data) {
            if (data.error != 0)
                return alert(data.data);
            window.location.href = "/";
        }
    });

});

