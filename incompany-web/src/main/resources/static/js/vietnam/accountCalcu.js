const saTotalAmountUsd = "_saTotalAmountUsd";
const vTotalAmountUsd = "_vTotalAmountUsd";
const saTotalAmountKrw = "_saTotalAmountKrw";
const vTotalAmountKrw = "_vTotalAmountKrw";

const amountMarginUsd = "amountMarginUsd";
const amountMarginKrw = "amountMarginKrw";


addtotalAmount(saTotalAmountUsd);
addtotalAmount(vTotalAmountUsd);
addtotalAmount(saTotalAmountKrw);
addtotalAmount(vTotalAmountKrw);

amountMargin(saTotalAmountUsd, vTotalAmountUsd, amountMarginUsd);
amountMargin(saTotalAmountKrw, vTotalAmountKrw, amountMarginKrw);

profitMargin();




// amount + h/f 더해 total amount에 뿌리기
function addtotalAmount(className) {

    var classList = document.getElementsByClassName(className);
    var resultInput = document.getElementById(className);

    var result = 0;

    for (var i = 0; i < classList.length; i++) {
        var value = classList[i].value;
        var valueformat = value.replace(/[^-\.0-9]/g, '');

        result += Number(valueformat);
    };

    // 달러면 소수점 2개까지 보여주기
    if (className.includes('Usd')) {
        result = result.toFixed(2);
    }

    result = numberWithCommas(result);




    resultInput.innerText = result;
}





// sa total amount - vietname total amount = amountMargin
function amountMargin(satotal, vTotal, idName) {

    var result = 0;

    var saVal = document.getElementById(satotal).innerText;
    saVal = Number(saVal.replace(/[^-\.0-9]/g, ''));

    var vVal = document.getElementById(vTotal).innerText;
    vVal = Number(vVal.replace(/[^-\.0-9]/g, ''));

    result = saVal - vVal;

    if (idName.includes('Usd')) {
        result = result.toFixed(2);
    }

    result = numberWithCommas(result);

    document.getElementById(idName).innerText = result;


}

// amount margin usd 나누기 saudi total amount usd = profit margin (소수점 2개)
function profitMargin() {

    var result = 0;
    var saTotalAmountUsdVal = document.getElementById(saTotalAmountUsd).innerText;
    saTotalAmountUsdVal = Number(saTotalAmountUsdVal.replace(/[^-\.0-9]/g, ''));


    var amountMarginVal = document.getElementById(amountMarginUsd).innerText;
    amountMarginVal = Number(amountMarginVal.replace(/[^-\.0-9]/g, ''));

    result = (amountMarginVal / saTotalAmountUsdVal)*100;


    if (result) {
        document.getElementById("profitMargin").innerText = result.toFixed(2);

    }

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

    addtotalAmount(saTotalAmountUsd);
    addtotalAmount(vTotalAmountUsd);

    amountMargin(saTotalAmountUsd, vTotalAmountUsd, amountMarginUsd);

    profitMargin();

    obj.value = comma(uncomma(obj.value));

    // const startPosition = obj.setSelectionRange && (obj.value.length - obj.selectionEnd);
    // const len = Math.max(obj.value.length - startPosition, 0);
    // console.log(startPosition, len)

    obj.setSelectionRange(len, len);

}

function inputOnlyNumberFormat(obj) {


    addtotalAmount(saTotalAmountKrw);
    addtotalAmount(vTotalAmountKrw);

    amountMargin(saTotalAmountKrw, vTotalAmountKrw, amountMarginKrw);


    obj.value = comma(uncommaExpPoint(obj.value));
}