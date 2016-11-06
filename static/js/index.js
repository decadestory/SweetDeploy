$('[divfile]').eq(0).click(function () {
    $('input[name=deployFile]').trigger("click");
});

$('input[name=deployFile]').on("change", function () {
    $('[divfile]').eq(1).text($(this).val());
});

$('#btn-deploy').on("click", function () {
    if ($('input[name=deployFile]').val().length === 0) {
        return alert("Please Choose a File。");
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
                return $('#btn-txt').text("Upload Faild")
            };

            $('#btn-txt').text("Deploying[30%]");
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
                return $('#btn-txt').text("Uncompress Faild")
            };

            $('#btn-txt').text("Deploying[50%]");
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
                return $('#btn-txt').text("Backup Faild")
            }
            $('#btn-txt').text("Deploying[75%]");
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
                return $('#btn-txt').text("Faild")
            }

            $('#btn-txt').text("Success");
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

function signOut(){
    window.location.href = "/loginOut";
}

