$(document).ready(function () {

    let barcode = $('#_barcode').val();
    var barcodeOptions = {
    		format: "CODE128", // default: auto
    		width: 	4,
    		height:	126,
    		displayValue: true,
    		fontOptions: "", // bold, italic
    		font: "monospace",
    		textAlign: "center",
    		textPosition: "bottom",
    		textMargin: 2,
    		fontSize: 20,
    		background: "#ffffff",
    		lineColor: "#000000",
    		margin: 0,
    }

    $.ajax({
            url: "/getIsUsableBarcode",
            type: "GET",
            async: false,
            data: {
                "barcode" : barcode
            },
            success: function (data) {
                if (data === true) {
                JsBarcode("#barcodeCanvas", barcode, barcodeOptions); // 바코드 출력
            } else {
                let alertText = "";
                $.ajax({
                    url: "/getUsedTime",
                    type: "GET",
                    async: false,
                    data: {
                        "barcode" : barcode
                    },
                    success: function (used_time){
                        if(used_time === "" || used_time === null)
                            alertText = "유효하지 않은 쿠폰입니다.";
                        else
                            alertText = "유효하지 않은 쿠폰입니다.\n"+ used_time + "에 사용된 적이 있습니다.";
                    },
                    error: function () {
                        alert('잠시 후 다시 시도해주세요.');
                        return false;
                    }
                })
                alert(alertText);
                $(location).attr("href", history.go(-1))
                return;
            }
            },
            error: function () {
                alert('잠시 후 다시 시도해주세요.');
                return false;
            }
        })
})