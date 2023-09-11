$(document).on('click', '#_barcodeInput', function (){

    const barcode = $('#_barcode').val();
        $.ajax({
            url: "/coffeeBarcodeInput",
            type: "PUT",
            async: true,
            data: {
                "barcode" : barcode
            },
            success: function (data) {
                if (data === "처리되었습니다") {
                alert(data); // "처리되었습니다"
            } else {
                alert(data); // "유효하지 않은 쿠폰입니다"
                return false;
            }
            },
            error: function () {
                alert('잠시 후 다시 시도해주세요.');
                return false;
            }
        })
    })