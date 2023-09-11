multiplyFreightAmount();
multiplyLocalAmount();
addfreightSubtotal();
addLocalSubtotal();

addTotal();



function multiplyFreightAmount() {
    var result = 0.00;

    var freightAmountList = document.getElementsByClassName("_freightAmount");
    var freightQuantityList = document.getElementsByClassName("_freightQuantity");
    var freightUnitPriceList = document.getElementsByClassName("_freightUnitPrice");

    for (var i = 0; i < freightAmountList.length; i++) {
        var result = 0.00;
        var quantity = Number(uncomma(freightQuantityList[i].value));
        var unitPrice = Number(uncomma(freightUnitPriceList[i].value));

        if (quantity && unitPrice) {
            result = quantity * unitPrice;

        }

        result = result.toLocaleString('en-US', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        });

        freightAmountList[i].innerHTML = result;

    }



}

function multiplyLocalAmount() {
    var result = 0;

    var localQuantityList = document.getElementsByClassName("_local_quantity");
    var localUnitPriceList = document.getElementsByClassName("_local_unit_price");
    var localAmountPriceList = document.getElementsByClassName("_local_amount");


    for (var i = 0; i < localAmountPriceList.length; i++) {
        var result = 0.00;
        var quantity = Number(uncomma(localQuantityList[i].value));
        var unitPrice = Number(uncomma(localUnitPriceList[i].value));

        if (quantity && unitPrice) {
            result = quantity * unitPrice;

        }

        result = result.toLocaleString('en-US', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        });

        localAmountPriceList[i].innerHTML = result;

    }



}


function addfreightSubtotal() {

    var result = 0.00;

    var freightAmountList = document.getElementsByClassName("_freightAmount");


    for (var i = 0; i < freightAmountList.length; i++) {
        var amount = Number(uncomma(freightAmountList[i].innerText));

        result += amount;
    }

    result = result.toLocaleString('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    });



    document.getElementById("freightSubTotal").innerHTML = result;

}

function addLocalSubtotal() {

    var result = 0.00;

    var localAmountList = document.getElementsByClassName("_local_amount");


    for (var i = 0; i < localAmountList.length; i++) {
        var amount = Number(uncomma(localAmountList[i].innerText));

        result += amount;
    }

    result = result.toLocaleString('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    });



    document.getElementById("localSubTotal").innerHTML = result;




}



function addTotal() {
    var result = 0;

    var freightSubtotal = Number(uncomma(document.getElementById("freightSubTotal").innerText));
    var localsubtotal = Number(uncomma(document.getElementById("localSubTotal").innerText));

    if (freightSubtotal && localsubtotal) {
        result = freightSubtotal + localsubtotal;
    }
    result = result.toFixed(2);
    result = numberWithCommas(result);
    document.getElementById("total").innerText = result

}



// 소수점 포함 3번째 자리마다 콤마
function numberWithCommas(num) {
    var parts = num.toString().split(".");
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
}

function comma(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}

function uncomma(str) {
    str = String(str);
    return str.replace(/[^-\.0-9]/g, '');

}

function uncommaExpPoint(str) {
    str = String(str);
    return str.replace(/[^\d]/g, '');
}

function inputNumberFormat(obj) {

    obj.value = comma(uncomma(obj.value));

    multiplyFreightAmount();
    multiplyLocalAmount();
    addfreightSubtotal();
    addLocalSubtotal();
    
    addTotal();
}