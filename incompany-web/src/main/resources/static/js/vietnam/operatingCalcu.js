addStaffSubTotal();
addAmountSubTotal();
addTotal();

// 소수점 포함 3번째 자리마다 콤마
function numberWithCommas(num) {
    var parts = num.toString().split(".");
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
}

// 소수점 포함 3번째 자리마다 점
function numberWithDots(num) {
    var parts = num.toString().split(".");
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".") + (parts[1] ? "." + parts[1] : "");
}



function comma(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}

function dot(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1.');
}


function undot(str) {
    str = String(str);
    return str.replace(/[^-\,0-9]/g, '');

}

function uncomma(str) {
    str = String(str);
    return str.replace(/[^-\.0-9]/g, '');

}

function buildcomma(str) {
    str = String(str);
    str = str.replaceAll('.', '');
    str = str.replaceAll(',', '.');
    return str;

}

function unDot(str) {
    str = String(str);
    return str.replace(/[^-\,0-9]/g, '');

}


function uncommaExpPoint(str) {
    str = String(str);
    return str.replace(/[^\d]/g, '');
}

function inputNumberFormat(obj) {

    if (obj.className.includes("_staff")) {
        addStaffSubTotal()
    } else if (obj.className.includes('_amount')) {
        addAmountSubTotal();
    }
    addTotal();

    obj.value = comma(uncomma(obj.value));


}

function inputNumberFormatWithDot(obj) {

    if (obj.className.includes("_staff")) {
        addStaffSubTotal()
    } else if (obj.className.includes('_amount')) {
        addAmountSubTotal();
    }
    addTotal();

    obj.value = dot(undot(obj.value));


}

function inputOnlyNumberFormat(obj) {

    if (obj.className.includes("_staff")) {
        addStaffSubTotal()
    } else if (obj.className.includes('_amount')) {
        addAmountSubTotal();
    }
    addTotal();
    obj.value = comma(uncommaExpPoint(obj.value));

}

function addStaffSubTotal() {

    var staffVnd = document.getElementsByClassName('_staffVnd');
    var staffUsd = document.getElementsByClassName('_staffUsd');
    var staffKrw = document.getElementsByClassName('_staffKrw');

    var resultVnd = 0.00;
    var resultUsd = 0.00;
    var resultKrw = 0;


    for (var i = 0; i < staffVnd.length; i++) {
        var value = staffVnd[i].value;
        value = buildcomma(value);

        resultVnd += Number(value);

    };

    for (var i = 0; i < staffUsd.length; i++) {
        var value = staffUsd[i].value;
        var valueformat = uncomma(value)

        resultUsd += Number(valueformat);
    };

    for (var i = 0; i < staffKrw.length; i++) {
        var value = staffKrw[i].value;
        var valueformat = uncomma(value)

        resultKrw += Number(valueformat);
    };



    resultVnd = resultVnd.toLocaleString('it-IT', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    });
    resultUsd = resultUsd.toLocaleString('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    });
    resultKrw = resultKrw.toLocaleString('ko-KR');


    document.getElementById('staffSubVnd').innerText = resultVnd;
    document.getElementById('staffSubUsd').innerText = resultUsd;
    document.getElementById('staffSubKrw').innerText = resultKrw;


}

function addAmountSubTotal() {


    var amountVnd = document.getElementsByClassName('_amountVnd');
    var amountUsd = document.getElementsByClassName('_amountUsd');
    var amountKrw = document.getElementsByClassName('_amountKrw');

    var amountVndResult = 0.00;
    var amountUsdResult = 0.00;
    var amountKrwResult = 0;


    for (var i = 0; i < amountVnd.length; i++) {

        var value = amountVnd[i].value;
        value = buildcomma(value);

        amountVndResult += Number(value);

    };

    for (var i = 0; i < amountUsd.length; i++) {
        var value = amountUsd[i].value;
        var valueformat = uncomma(value);

        amountUsdResult += Number(valueformat);
    };

    for (var i = 0; i < amountKrw.length; i++) {
        var value = amountKrw[i].value;
        var valueformat = uncomma(value)

        amountKrwResult += Number(valueformat);
    };

    amountVndResult = amountVndResult.toLocaleString('it-IT', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    });
    amountUsdResult = amountUsdResult.toLocaleString('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    });
    amountKrwResult = amountKrwResult.toLocaleString('ko-KR');

    document.getElementById('amountSubVnd').innerText = amountVndResult;
    document.getElementById('amountSubUsd').innerText = amountUsdResult;
    document.getElementById('amountSubKrw').innerText = amountKrwResult;
}

function addTotal() {
    var staffSubTotalVnd = document.getElementById('staffSubVnd').innerText;
    var staffSubTotalUsd = uncomma(document.getElementById('staffSubUsd').innerText);
    var staffSubTotalKrw = uncomma(document.getElementById('staffSubKrw').innerText);

    var amountSubTotalVnd = document.getElementById('amountSubVnd').innerText;
    var amountSubTotalUsd = uncomma(document.getElementById('amountSubUsd').innerText);
    var amountSubTotalKrw = uncomma(document.getElementById('amountSubKrw').innerText);

    staffSubTotalVnd = buildcomma(staffSubTotalVnd);
    amountSubTotalVnd = buildcomma(amountSubTotalVnd)

    var totalVnd = 0.00;
    var totalUsd = 0.00;
    var totalKrw = 0;

    totalVnd = Number(staffSubTotalVnd) + Number(amountSubTotalVnd);
    totalUsd = Number(staffSubTotalUsd) + Number(amountSubTotalUsd);
    totalKrw = Number(staffSubTotalKrw) + Number(amountSubTotalKrw);


    totalVnd = totalVnd.toLocaleString('it-IT', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    });
    totalUsd = totalUsd.toLocaleString('en-US', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2
    });
    totalKrw = totalKrw.toLocaleString('ko-KR');



    document.getElementById('totalVnd').innerText = totalVnd;
    document.getElementById('totalUsd').innerText = totalUsd;
    document.getElementById('totalKrw').innerText = totalKrw;

}