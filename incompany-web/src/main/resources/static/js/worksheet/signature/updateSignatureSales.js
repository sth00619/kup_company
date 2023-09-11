$(document).ready(function(){

    /* 전체매출 */
    $('._sales').on('blur',function(){
        totalSales();
    })

    /* 전체지출*/
    $('._spend').on('blur',function(){
        totalSpend();
    })

    /*그외 전체지출*/
    $('._otherSpend').on('blur',function(){
        otherTotalSpend();
    })


    /* null check */
    $('._submitBtn').on('click',function(){
        var accountDate = $('#accountDate').val();
        if (accountDate == '') {
            alert("작성일을 선택해 주세요.");
            return false;
        }
    })
})

/* 전체매출 */
function totalSales () {

    var totalSales = 0;

    $('._sales').each(function(){

        var inputVal = $(this).val();
        var sale = minusStr(inputVal);

        totalSales += sale;

    })
        totalSales = totalSales.toLocaleString();
        $('#totalSales').text(totalSales);
}

/* 전체지출*/
function totalSpend () {

    var totalSpend = 0;

    $('._spend').each(function(){

        var inputVal = $(this).val();
        var spend = minusStr(inputVal);

        totalSpend += spend;

    })
        totalSpend = totalSpend.toLocaleString();
        $('#totalSpend').text(totalSpend);
}

/*그외 전체지출*/
function otherTotalSpend () {

    var otherTotalSpend = 0;

    $('._otherSpend').each(function(){

        var inputVal = $(this).val();
        var otherSpend = minusStr(inputVal);

        otherTotalSpend += otherSpend;

    })
        otherTotalSpend = otherTotalSpend.toLocaleString();
        $('#otherTotalSpend').text(otherTotalSpend);
}


// 문자 제거 Only 숫자
function minusStr(value) {
    value = value.replace(/[^\d]+/g, "");
    value = Number(value);
    return value;
}