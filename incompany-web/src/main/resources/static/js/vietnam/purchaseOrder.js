$(document).ready(function () {


    $(document).on('click', '#addPoNoBtn', function () {

        var addPoNo = $('#addPoNo').val();
        var ans =confirm("Would you like to add?");

        if(!addPoNo){
            alert('Please inser PO NO');
            return false;
        }
        
        if(ans){
            $.ajax({
                type: "POST",
                url: 'insertPurchaseOrderNo',
                data: {
                    "poNo": addPoNo
                },
                success: function () {
                    location.reload();
                }
    
            }).fail(function () {
                alert("fail");
                return false;
            });
        }





    });


    $(document).on('click', '._deletePoNo', function () {

        var deletePoNo = $(this).closest('._pList').children('._poIdxNo').text();
        var delConfirm = confirm("Do you want to delete??");

        if (delConfirm) {
            $.ajax({
                type: "DELETE",
                url: 'deletePurchaseOrderNo',
                data: {
                    "poIdxNo": deletePoNo
                },
                success: function () {
                    location.reload();
                }

            }).fail(function () {
                alert("fail");
                return false;
            });
        }



    });



    $(document).on('click', '._updateBtn', function () {


        $(this).addClass('_saveBtn');
        $(this).removeClass('_updateBtn');


        $(this).text('SAVE');
        $(this).prev('.typing-txt').css({
            display: 'inline-block'
        });
        $(this).addClass('Delete-btn');
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

        var columnName = $(this).prev().attr('columnName');

        var value = $(this).prev().val();
        var poIdxNo = $(this).closest('._pList').children('._poIdxNo').text();
        var poNo = $(this).closest('._pList').children('._poNo').children('._poNoVal').val();


        var data = {
            "poIdxNo": poIdxNo,
            "poNo": poNo,
            "columnName": columnName,
            "value": value
        }

        $.ajax({
            type: "PUT",
            url: 'updateValue',
            data: data,
            success: function () {
                location.reload();
            }

        }).fail(function () {
            alert("fail");
            return false;
        });

    });

    $(document).on('click', '._updateState', function () {

        var columnName = 'state';
        var value = $(this).val();
        var poIdxNo = $(this).closest('._pList').children('._poIdxNo').text();
        var poNo = $(this).closest('._pList').children('._poNo').children('._poNoVal').val();

        var data = {
            "poIdxNo": poIdxNo,
            "poNo": poNo,
            "columnName": columnName,
            "value": value
        }

        if (value == "2") {

            var request = $.ajax({
                type: "GET",
                url: 'checkValIncluded',
                data: {
                    "poIdxNo": poIdxNo
                },
                success: function (result) {
                    if (typeof result != "undefined" && result != '' && result != null) {
                        alert("CHECK " + result);
                        return false;
                    }

                }

            }).fail(function () {
                alert("fail");
                return false;
            });

            request.done(function (result) {

                if (!result) {

                    updateStateAjax(data);

                }

            })

        } else {
            updateStateAjax(data);

        }



    });

    function updateStateAjax (data) {

        $.ajax({
            type: "PUT",
            url: 'updateValue',
            data: data,
            success: function () {
                location.reload();
            }

        }).fail(function () {
            alert("fail");
            return false;
        });
    }
});