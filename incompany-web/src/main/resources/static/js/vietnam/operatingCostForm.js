$(document).ready(function () {

    const operatingNo = $('#no').val();

    $(document).on('click', '._closeBtn', function () {

        location.href = "list";
    });

    $(document).on('click', '._cancleBtn', function () {
        location.reload();
    });

    $(document).on('click', '._editBtn', function () {


        $('._closeBtn').addClass('_cancleBtn');
        $('._closeBtn').removeClass('_closeBtn');

        $(this).text('SAVE');
        $('.typing-txt').css({
            display: 'inline-block'
        });
        $(this).addClass('Delete-btn');
        if (operatingNo) {
            $(this).addClass('_saveBtn');

        } else {
            $(this).addClass('_insertBtn');

        }

        $(this).removeClass('Edit-btn');
        $(this).removeClass('Edit-_editBtn');

        $('.typing-txt').css({
            border: '1px solid #edf0f5'
        });
        $('.typing-txt').attr("disabled", false);
        $('.date-txt').attr("disabled", false);
        $('.date-txt').css({
            opacity: '1'
        });
        $('textarea').attr("disabled", false);


    });


    $(document).on('click', '._saveBtn', function () {



        var form = $("#form").serializeArray();
        for (let i = 0; i < form.length; i++) {
            var name = form[i].name;

            if (name.includes('Usd') || name.includes('Krw')) {
                if(!form[i].value){
                    form[i].value = 0
                }else{
                    form[i].value = form[i].value.replaceAll(',', '');

                }


                
            }

            if (name.includes('Vnd')) {
                if(!form[i].value){
                    form[i].value = 0
                }else{
                    form[i].value = form[i].value.replaceAll('.', '');
                    form[i].value = form[i].value.replaceAll(',', '.');
                }


            }

        }


        $.ajax({
            cache: false,
            url: "info",
            type: 'POST',
            data: form,
            success: function () {
                location.reload();
            }, // success 

            error: function (xhr, status) {

                alert('저장에 실패했습니다');
                return false;
            }
        }); // $.ajax */



    });

    $(document).on('click', '._insertBtn', function () {



        var form = $("#form").serializeArray();
        for (let i = 0; i < form.length; i++) {
            var name = form[i].name;

            if (name.includes('Usd') || name.includes('Krw')) {
                if(!form[i].value){
                    form[i].value = 0
                }else{
                form[i].value = form[i].value.replaceAll(',', '');
                }
            }

            if (name.includes('Vnd')) {
                if(!form[i].value){
                    form[i].value = 0
                }else{
                    form[i].value = form[i].value.replaceAll('.', '');
                    form[i].value = form[i].value.replaceAll(',', '.');
                }

            }

        }


        $.ajax({
            cache: false,
            url: "form",
            type: 'POST',
            data: form,
            success: function (data) {

                location.href = "/vietnam/operatingCost/info?date=2022-2&no=" + data;
            }, // success 

            error: function (xhr, status) {

                alert('저장에 실패했습니다');
                return false;
            }
        }); // $.ajax */



    });


})