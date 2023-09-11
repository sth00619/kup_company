$(document).ready(function () {

    /* 프로젝트 > 참여인원 4명 이상일 경우 */
    $('.p_people_wrap').each(function () {
        var peopleCount = $(this).children();
        if (peopleCount.length > 4) {
            $(peopleCount).each(function (index) {
                $(this).eq(index).hide();
            })
            $(this).append('<div class="Excess"><img src="/images/img/plus.png"></div>');
        }
    });

    /* 프로젝트 > 데이터 없어도 박스 출력 */
    let projectBoxCnt = 0;
    $('._project_box').each(function () {
        projectBoxCnt++;
    });
    projectBoxCnt = (4 - projectBoxCnt);

    for (var i = 0; i < projectBoxCnt; i++) {
        let html = '';
        html += '<div class="project_box"></div>';
        $('._project_group').append(html);
    }

    $('._project_box').each(function () {
        var contents = $('#contents');

    });

    // 처리 실패 메세지
    if ($('#isSuccess').val() === 'false') {
        const message = $('#message').val();
        alert(message);
    }

    $(document).on("click", "#currentBtn", function () {

        $('#currentBtn').addClass('hide');
        $('#currentBtnModit').addClass('open');

        $('#this_week').attr("disabled", false);
    });

    $(document).on("click", "#nextBtn", function () {


        $('#nextBtn').addClass('hide');
        $('#nextBtnModit').addClass('open');

        $('#next_week').attr("disabled", false);
    });


    $(document).on("click", "#currentBtnModit", function () {

        if ($("#this_week").is(":disabled")) {
            $('#this_week').attr("disabled", true);
            $('#this_week').focus();
            $('#currentBtn').removeClass('hide');
            $('#currentBtnModit').removeClass('open');


        } else {
            var thisAmount = $('#this_week').val();
            var currentDate = new Date();

            // 현재 년도를 가져옵니다.
            var currentYear = currentDate.getFullYear();

            // 현재 주차를 가져옵니다.
            var currentWeek = Math.ceil((((currentDate - new Date(currentYear, 0, 1)) / 86400000) + 1) / 7);


            $.ajax({
                url: 'targetAmount',
                type: 'POST',
                data: {
                    targetAmountString: thisAmount,
                    year: currentYear,
                    week: currentWeek
                },

                success: function (err) {
                    $("#sales_goals").load(window.location.href + " #goalswrap");
                },
                error: function (errcd) {
                    alert("요청에 실패했습니다.");
                }, // 요청 실패.

            });

        }

    });

    // insert 하는 숫자에 자동으로 comma 추가
    $("#next_week").toLocaleString()
    $("#this_week").toLocaleString()


    $(document).on("click", "#nextBtnModit", function () {

        if ($("#next_week").is(":disabled")) {
            $('#next_week').attr("disabled", true);
            $('#next_week').focus();
            $('#nextBtn').removeClass('hide');
            $('#nextBtnModit').removeClass('open');

        } else {

            var nextAmount = $('#next_week').val();

            // 현재 날짜
            var currentDate = new Date();

            // 일주일 뒤 날짜
            var oneWeekLater = new Date(currentDate.getTime() + (7 * 24 * 60 * 60 * 1000));

            // 일주일 뒤의 년도와 주차
            var year = oneWeekLater.getFullYear();
            var nextWeek = Math.ceil((((oneWeekLater - new Date(year, 0, 1)) / 86400000) + 1) / 7);

            $.ajax({
                url: 'targetAmount',
                type: 'POST',
                data: {
                    targetAmountString: nextAmount,
                    year: year,
                    week: nextWeek
                },

                success: function (err) {
                    $("#sales_goals").load(window.location.href + " #goalswrap");

                },
                error: function (errcd) {
                    alert("요청에 실패했습니다.");
                    console.log(errcd);
                }, // 요청 실패.

            });

        }
    });

});

function formatNumberInput(input) {
    // 입력할 때 comma 추가하는 함수
    var value = input.value.replace(/[^\d]/g, '');
    var formattedValue = comma(value);
    if (formattedValue !== input.value) {
        input.value = formattedValue;
    }
}

$(document).on("input", "#this_week", function () {
    formatNumberInput(this);
});

$(document).on("input", "#next_week", function () {
    formatNumberInput(this);
});

function setDefaultIfEmpty(inputElement) {
    // 값이 비어있는 경우 기본값 0 입력
    if (inputElement.value.trim() === '') {
        inputElement.value = '0';
    }
}

function comma(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}

function uncomma(str) {
    str = String(str);
    return str.replace(/[^\d]+/g, '');
}


