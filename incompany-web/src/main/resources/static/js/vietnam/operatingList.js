$(document).ready(function () {


    var date = new Date();
    var selYear = date.getFullYear();

    // 현재년도를 기준으로 호출
    getYears(selYear);
    var year = date.getFullYear();
    // 현재 년도를 select 함.
    $('#year-select').val(selYear);

    setData();
    $('#tbody').append(setTotal());

    // 바뀐 년도를 기준으로 다시 option을 세팅함
    $('#year-select').change(function () {
        var chgYear = $(this).val();

        getYears(chgYear);
        $('#year-select').val(chgYear);



        year = chgYear;
        setData();
        $('#tbody').append(setTotal());



    });


    function getYears(getY) {

        // 기존 optopn을 삭제함
        $("#year-select option").remove();

        // 올해 기준으로 -2년부터 +5년을 보여줌.
        var stY = Number(getY) - 10;
        var enY = Number(getY) + 10;
        for (var y = stY; y <= enY; y++) {
            $('#year-select').append("<option value='" + y + "'>" + y + "년" + "</option>");
        }
    }

    function setData() {
        var str = '';
        var tbody = document.getElementById('tbody');



        for (var i = 1; i <= 12; i++) {

            var exist = false;
            var date = String(year) + '-' + i;
            for (let j = 0; j < operatingList.length; j++) {

                if (operatingList[j].date == date) {

                    var amountVnd = operatingList[j].amountVnd
                    var amountUsd = operatingList[j].amountUsd
                    var amountKrw = operatingList[j].amountKrw


                    amountVnd = amountVnd.toLocaleString('it-IT', {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2
                    });
                    amountUsd = amountUsd.toLocaleString('en-US', {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2
                    });
                    amountKrw = amountKrw.toLocaleString('ko-KR');


                    str += '<tr>'
                    str += '<td class="Year-view">'
                    str += year
                    str += '년</td>'
                    str += '<td><a href="/vietnam/operatingCost/info?no='
                    str += operatingList[j].no
                    str += '&date=' + date;
                    str += '">'
                    str += i
                    str += '월</a></td>'
                    str += '<td class="_amountVnd">'
                    str += amountVnd
                    str += '</td>'
                    str += '<td class="_amountUsd">'
                    str += amountUsd
                    str += '</td>'
                    str += '<td class="_amountKrw">'
                    str += amountKrw
                    str += '</td>';
                    str += '</tr>';

                    exist = true;

                }

            }
            if (!exist) {
                str += '<tr>'
                str += '<td class="Year-view">'
                str += year
                str += '년</td>'
                str += '<td><a href="/vietnam/operatingCost/info?date=';
                str += date;
                str += '">'
                str += i
                str += '월</a></td>'
                str += '<td class="_amountVnd">0,00'
                str += '</td>'
                str += '<td class="_amountUsd">0.00</td>'
                str += '<td class="_amountKrw">0</td>'
                str += '</tr>'

            }

        }
        tbody.innerHTML = str;



    }

    function setTotal() {


        var amountVnd = 0.00;
        var amountUsd = 0.00;
        var amountKre = 0;

        $('._amountVnd').each(function () {

            var valueformat = buildcomma($(this).text())

            if (valueformat) {
                amountVnd += Number(valueformat);

            }
        });


        $('._amountUsd').each(function () {

            var valueformat = uncomma($(this).text())

            if (valueformat) {
                amountUsd += Number(valueformat);

            }
        });
        $('._amountKrw').each(function () {

            var valueformat = uncomma($(this).text());

            if (valueformat) {
                amountKre += Number(valueformat);

            }
        });


        amountVnd = amountVnd.toLocaleString('it-IT', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        });
        amountUsd = amountUsd.toLocaleString('en-US', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        });
        amountKre = amountKre.toLocaleString('ko-KR');


        str = '';
        str += '<tr>'
        str += '<td colspan="2" class="title-bgc03">TOTAL</td>'
        str += '<td class="title-bgc03">'
        str += amountVnd
        str += '</td>'
        str += '<td class="title-bgc03">'
        str += amountUsd;
        str += '</td>'
        str += '<td class="title-bgc03">'
        str += amountKre
        str += '</td>'
        str += '</tr>';
        return str;
    }


    function buildcomma(str) {
        str = String(str);
        str = str.replaceAll('.', '');
        str = str.replaceAll(',', '.');
        return str;

    }


    function uncomma(str) {
        str = String(str);
        return str.replaceAll(/[^-\.0-9]/g, '');

    }

});