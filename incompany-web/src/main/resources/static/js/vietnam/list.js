$(document).ready(function () {

    $(document).on('click', '.Edit-btn', function () {

        $(this).text('SAVE');
        $(this).prev('.typing-txt').css({
            display: 'inline-block'
        });
        $(this).addClass('Delete-btn');
        $(this).addClass('_saveBtn');

        $(this).removeClass('Edit-btn');
        $(this).prev('.typing-txt').css({
            border: '1px solid #edf0f5'
        });
        $(this).prev('.typing-txt').attr("disabled", false);
        $(this).prev('.date-txt').attr("disabled", false);
        $(this).prev('.date-txt').css({
            opacity: '1'
        });
    });


    $(document).on('click', '._saveBtn', function () {


        var value = $(this).prev().val();
        var columnName = $(this).val();
        var poIdxNo = $(this).closest('._pList').children('._poIdxNo').text();
        var poNo = $(this).closest('._pList').children('._poNo').attr("value");

        var data = {
            "columnName": columnName,
            "value": value,
            "poIdxNo": poIdxNo,
            'poNo': poNo,
            'action': 'insert'
        }


        $.ajax({
            type: "POST",
            url: 'update',
            data: data,
            success: function () {
                $('._reload').load(location.href + ' ._reload');

            }

        }).fail(function () {
            alert("fail");
            return false;
        });



    });



})