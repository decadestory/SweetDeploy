$('[divfile]').eq(0).click(function () {
    $('input[name=deployFile]').trigger("click");
});

$('input[name=deployFile]').on("change", function () {
    $('[divfile]').eq(1).text($(this).val());
});

$('#btn-deploy').on("click", function () {
    if ($('input[name=deployFile]').val().length === 0) {
        return alert("请先选择要发布的文件。");
    }

    $('#dicon').addClass("fa fa-refresh fa-spin");
    $('#form').ajaxSubmit({
        url: "/upload",
        method: "post",
        data: $('#form').formSerialize(),
        success: function (data) {
            if (data.error != 0) {
                setActionColor("#c74228")
                $('#dicon').removeClass("fa fa-refresh fa-spin");
                return $('#btn-txt').text("上传失败")
            };

            $('#btn-txt').text("正在发布[30%]");
            unzip(data.data);
        }
    });
});

function unzip(path) {
    $.ajax({
        url: "/unzip",
        type: "post",
        data: { path: path },
        success: function (data) {
            if (data.error != 0) {
                setActionColor("#c74228")
                $('#dicon').removeClass("fa fa-refresh fa-spin");
                return $('#btn-txt').text("解压失败")
            };

            $('#btn-txt').text("正在发布[50%]");
            backup();
        }
    });
}

function backup() {
    $.ajax({
        url: "/backup",
        type: "post",
        success: function (data) {
            if (data.error != 0) {
                setActionColor("#c74228")
                $('#dicon').removeClass("fa fa-refresh fa-spin");
                return $('#btn-txt').text("备份失败")
            }
            $('#btn-txt').text("正在发布[75%]");
            deploy();
        }
    });
}

function deploy() {
    $.ajax({
        url: "/deploy",
        type: "post",
        success: function (data) {
            if (data.error != 0) {
                setActionColor("#c74228")
                $('#dicon').removeClass("fa fa-refresh fa-spin");
                return $('#btn-txt').text("发布失败")
            }

            $('#btn-txt').text("发布成功");
            $('#dicon').removeClass("fa fa-refresh fa-spin");
            $('#dicon').addClass("fa fa-check");
            $('input[name=deployFile]').val("");
            setActionColor("#6abf26");
        }
    });
}

function setActionColor(color) {
    $('header').css("background-color", color);
    $('#btn-deploy').css("background-color", color);
    $('[divfile]:first-child').css("background-color", color);
    $('[divfile]').css("border-color", color);
}