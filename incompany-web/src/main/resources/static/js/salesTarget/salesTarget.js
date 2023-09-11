$(document).ready(function () {
    // 연도 구하기
    function getYear() {
        let year = parseInt($('#year').text().slice(0, -2));
        return year;
    }

    // 달 구하기
    function getMonth() {
        let month = parseInt($('#month').text().slice(0, -1));
        return month;
    }

    // 주차 구하기
    function getWeek() {
        let weekText = $('.the_weekbtn._week.active').text();
        let week;

        if (weekText.length === 2) {
            week = 0;
        } else {
            week = parseInt(weekText.substring(0, 1));
        }
        return week;
    }

    // 카테고리 구하기
    function getCategory() {
        let category = parseInt($('#category').val());
        return category;
    }

//======================================================================================//

    // 지점 채우기
    pointReload()

    // 예상 마우스 호버 이벤트
    $(document).on('mouseenter', '._note', function() {
        if ($(this).text().length > 8) {
            let value = $(this).siblings('._note_value').val();
            $(this).addClass('per_note');
            $(this).text(value);
        }
    });
    $(document).on('mouseleave', '._note', function() {
        if ($(this).text().length > 8) {
            let value = $(this).siblings('._note_formatted_value').val();
            $(this).removeClass('per_note');
            $(this).text(value);
        }
    });

    // 저번달 버튼
    $('#last_month').on('click', function() {
        let year = parseInt($('#year').text().slice(0, -2));
        let month = parseInt($('#month').text().slice(0, -1));

        if (month === 1) {
            month = 12;
            year = year - 1;
            $('#month').text(month + '월');
            $('#year').text(year + '년 ');
        } else {
            month = month - 1;
            $('#month').text(month + '월');
        }
        updateWeekRange(year, month);

        // 선택된 달에 맞춰 지점 리로드
        pointReload()
    });

    // 다음달 버튼
    $('#next_month').on('click', function() {
        let year = parseInt($('#year').text().slice(0, -2));
        let month = parseInt($('#month').text().slice(0, -1));

        if (month === 12) {
            month = 1;
            year = year + 1;
            $('#month').text(month + '월');
            $('#year').text(year + '년 ');
        } else {
            month = month + 1;
            $('#month').text(month + '월');
        }
        updateWeekRange();

        // 선택된 달에 맞춰 지점 리로드
        pointReload()
    });

    // 주차 선택
    $(document).on('click', '._week', function() {
        if (!$(this).hasClass('active')) {
            // 기존에 active 클래스가 있는 버튼에서 active 클래스 제거
            $('._week.active').removeClass('active');

            // 클릭된 버튼에 active 클래스 추가
            $(this).addClass('active');

            // 선택된 주차에 맞춰 지점 리로드
            pointReload()
        }
    });

    // 카테고리 열고 닫기
    $('.select_category').click(function() {
        $(this).find('.point_ani').toggleClass('active');
        $('.top_slide_category').next().slideToggle('fast');
    });

    // 카테고리 선택
    $('.the_category_select li span').click(function() {
        if ($(this).text() !== $('.select_category ._category').text()) {
            if (getCategory() == 1) {
                $('#category').val(2);
            } else {
                $('#category').val(1);
            }
            $('.select_category ._category').text($(this).text());
            $(this).addClass('top_slide_sub5').parent().siblings().find('span').removeClass('top_slide_sub5');

            $('.select_category').find('.point_ani').toggleClass('active');
            $('.top_slide_category').next().slideToggle('fast');

            // 선택된 카테고리에 맞춰 지점 리로드
            pointReload()
        }
    });

    // 지점 열고 닫기
    $(document).on('click', '.point_skill', function() {
        $(this).closest('.each_point').find('.point_ani').toggleClass('active');

        // slideToggle: 애니메이션 toggleClass : 즉시 열고 닫기
        $(this).next().slideToggle();
        //$(this).closest('.each_point').find('.point_amount').toggleClass('active');
        //$(this).closest('.each_point').find('.group_amount_lists').toggleClass('active');
    });

    // 지점 열고 닫기
    $(document).on('click', '._confirmed', function() {
        let param = $(this).find('._confirmedNo').val();
        let currentURL = window.location.href;
        let category = getCategory();
        let url;

        if (category === 1) {
            url = currentURL.replace("/salesTarget/salesTarget", "/contractFortune/contractFortuneInfo?contractCode=") + param;
        } else {
            url = currentURL.replace("/salesTarget/salesTarget", "/insurance/insuranceInfo?insuranceManageNo=") + param;
        }


        window.open(url, '_blank');
    });

//======================================================================================//

    const dateRegex = /\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])/;
    const amountRegex = /^\d+$/;
    const probabilityRegex = /^(?:[1-9]|[1-9][0-9])$/;

    const $writingSum = $('.writing_sum');
    const $writingSubmit = $('.writing_submit');

    // 작성하기 버튼
    $('.the_plusbtn').click(function() {
        $writingSum.on('input', checkWritingInput);
        $writingSum.addClass('active');

        // 작성하기 열 때 기존 데이터 초기화
        $writingSum.find('input._estimatedDate').val('');
        $writingSum.find('input._estimatedUserName').val('');
        $writingSum.find('input._estimatedAmount').val('');
        $writingSum.find('input._probability').val('');
        $writingSum.find('textarea._note').val('');
    });

    // 작성하기 닫기 버튼
    $('.close_writing').click(function() {
        $writingSum.removeClass('active');
        $writingSubmit.removeClass('active');
        $writingSubmit.attr("disabled", true);
    });

    // 작성하기 완료 버튼
    $writingSubmit.click(function() {
        let estimatedDateValue = $writingSum.find('input._estimatedDate').val().trim();
        let estimatedUserNameValue = $writingSum.find('input._estimatedUserName').val().trim();
        let estimatedAmountValue = $writingSum.find('input._estimatedAmount').val().trim().replace(/,/g, '');
        let probabilityValue = $writingSum.find('input._probability').val().trim().replace(/\s|%$/g, '');
        let noteValue = $writingSum.find('textarea._note').val().trim();
        let category = getCategory();

        // 유효성 검사
        if (estimatedDateValue === null || estimatedDateValue.trim() === '') {
            alert("날짜 항목이 비어있습니다.\n값을 입력해 주십시오.")
            return false;
        } else {
            if(dateRegex.test(estimatedDateValue) === false){
                alert("날짜 형식이 올바르지 않거나 올바르지 않은 날짜를 입력하였습니다.\n올바른 형식 : yyyy-MM-dd")
                return false;
            }
        }
        if (estimatedUserNameValue === null || estimatedUserNameValue === '') {
            alert("이름 항목이 비어있습니다.\n값을 입력해 주십시오.")
            return false;
        }
        if (estimatedAmountValue === null || estimatedAmountValue === '') {
            alert("금액 항목이 비어있습니다.\n값을 입력해 주십시오.")
            return false;
        } else {
            if(amountRegex.test(estimatedAmountValue) === false){
                alert("금액 항목에 숫자가 아닌 값이 입력되었습니다.")
                return false;
            }
        }
        if (probabilityValue === null || probabilityValue === '') {
            alert("확률 항목이 비어있습니다.\n값을 입력해 주십시오.")
            return false;
        } else {
            if(probabilityRegex.test(probabilityValue) === false){
                alert("확률 항목에는 1~99 사이의 숫자만 입력 가능합니다.")
                return false;
            }
        }

        $.ajax({
            url: '/salesTarget/addEstimated',
            method: 'POST',
            data: {
                estimatedDate: estimatedDateValue,
                estimatedUserName: estimatedUserNameValue,
                estimatedAmount: estimatedAmountValue,
                probability: probabilityValue,
                note: noteValue,
                category: category
            },
            success: function(data) {
                if(data){
                    pointReload()
                    $writingSum.removeClass('active');
                } else {
                    alert('저장 중 오류가 발생하였습니다.\n담당자에게 문의하세요.');
                    return false;
                }

            },
            error: function() {
                alert('작성 요청이 실패했습니다.');
            }
        });
    });

    // 작성하기 값 입력 여부 확인
    function checkWritingInput() {
        let estimatedDateValue = $writingSum.find('input._estimatedDate').val().trim();
        let estimatedUserNameValue = $writingSum.find('input._estimatedUserName').val().trim();
        let estimatedAmountValue = $writingSum.find('input._estimatedAmount').val().trim();
        let probabilityValue = $writingSum.find('input._probability').val().trim();

        if (estimatedDateValue === '' || estimatedUserNameValue === '' || estimatedAmountValue === '' || probabilityValue === ''){
            $writingSubmit.removeClass('active');
            $writingSubmit.attr("disabled", true);
        } else {
            $writingSubmit.addClass("active");
            $writingSubmit.attr("disabled", false);
        }
    }


    //-------------------------------------------------------------//

    const $modifySum = $('.modify_sum');
    const $modifySubmit = $('.modify_submit');

    // 수정하기 버튼
    $(document).on('click', '._estimated', function() {
        let estimatedNo = $(this).closest('.modif_box').find('._estimatedNo').val();
        let estimatedDate = $(this).closest('.modif_box').find('._estimatedDate').text();
        let userName = $(this).closest('.modif_box').find('._estimatedUserName').text();
        let amount = parseInt($(this).closest('.modif_box').find('._estimatedAmount').text().replace(/,/g, ''));
        let probability = $(this).closest('.modif_box').find('._probability').text();
        let note = $(this).closest('.modif_box').find('._note_value').val();
        let category = getCategory();

        $modifySum.on('input', checkModifyInput);
        $modifySum.find('input._estimatedNo').val(estimatedNo);
        $modifySum.find('input._estimatedDate').val(estimatedDate);
        $modifySum.find('input._estimatedUserName').val(userName);
        $modifySum.find('input._estimatedAmount').val(amount.toLocaleString());
        $modifySum.find('input._probability').val(probability);
        $modifySum.find('textarea._note').val(note);

        $modifySum.addClass('active');
    });

    // 수정하기 닫기 버튼
    $('.close_modify').click(function() {
        $modifySum.removeClass('active');
        $modifySubmit.removeClass('active');
        $modifySubmit.attr("disabled", true);
    });

    // 수정하기 완료 버튼
    $modifySubmit.click(function() {
        let estimatedNoValue = $modifySum.find('input._estimatedNo').val();
        let estimatedDateValue = $modifySum.find('input._estimatedDate').val().trim();
        let estimatedUserNameValue = $modifySum.find('input._estimatedUserName').val().trim();
        let estimatedAmountValue = $modifySum.find('input._estimatedAmount').val().trim().replace(/,/g, '');
        let probabilityValue = $modifySum.find('input._probability').val().trim().replace(/\s|%$/g, '');
        let noteValue = $modifySum.find('textarea._note').val().trim();

        // 유효성 검사
        if (estimatedDateValue === null || estimatedDateValue.trim() === '') {
            alert("날짜 항목이 비어있습니다.\n값을 입력해 주십시오.")
            return false;
        } else {
            if(dateRegex.test(estimatedDateValue) === false){
                alert("날짜 형식이 올바르지 않거나 올바르지 않은 날짜를 입력하였습니다.\n올바른 형식 : yyyy-MM-dd")
                return false;
            }
        }
        if (estimatedUserNameValue === null || estimatedUserNameValue === '') {
            alert("이름 항목이 비어있습니다.\n값을 입력해 주십시오.")
            return false;
        }
        if (estimatedAmountValue === null || estimatedAmountValue === '') {
            alert("금액 항목이 비어있습니다.\n값을 입력해 주십시오.")
            return false;
        } else {
            if(amountRegex.test(estimatedAmountValue) === false){
                alert("금액 항목에 숫자가 아닌 값이 입력되었습니다.")
                return false;
            }
        }
        if (probabilityValue === null || probabilityValue === '') {
            alert("확률 항목이 비어있습니다.\n값을 입력해 주십시오.")
            return false;
        } else {
            if(probabilityRegex.test(probabilityValue) === false){
                alert("확률 항목에는 1~99 사이의 숫자만 입력 가능합니다.")
                return false;
            }
        }

        $.ajax({
            url: '/salesTarget/updateEstimated',
            method: 'PUT',
            data: {
                estimatedNo: estimatedNoValue,
                estimatedDate: estimatedDateValue,
                estimatedUserName: estimatedUserNameValue,
                estimatedAmount: estimatedAmountValue,
                probability: probabilityValue,
                note: noteValue
            },
            success: function(data) {
                if(data){
                    pointReload()
                    $modifySum.removeClass('active');
                } else {
                    alert('수정 중 오류가 발생하였습니다.\n담당자에게 문의하세요.');
                    return false;
                }
            },
            error: function() {
                alert('수정 요청이 실패했습니다.');
            }
        });
    });

    // 수정하기 값 입력 여부 확인
    function checkModifyInput() {
        let estimatedDateValue = $modifySum.find('input._estimatedDate').val().trim();
        let estimatedUserNameValue = $modifySum.find('input._estimatedUserName').val().trim();
        let estimatedAmountValue = $modifySum.find('input._estimatedAmount').val().trim();
        let probabilityValue = $modifySum.find('input._probability').val().trim();

        if (estimatedDateValue === '' || estimatedUserNameValue === '' || estimatedAmountValue === '' || probabilityValue === ''){
            $modifySubmit.removeClass('active');
            $modifySubmit.attr("disabled", true);
        } else {
            $modifySubmit.addClass("active");
            $modifySubmit.attr("disabled", false);
        }
    }

//======================================================================================//

    // 삭제 버튼
    $(document).on('click', '._delete_button', function() {
        if(!confirm('정말로 삭제하시겠습니까?')){
            return false;
        }
        var estimatedNo = $(this).closest(".person_textarea").find("._estimatedNo").val();

        $.ajax({
            url: '/salesTarget/deleteEstimated',
            type: "DELETE",
            data: { estimatedNo: estimatedNo },
            success: function() {
                pointReload()
            },
            error: function() {
                alert('삭제 중 오류가 발생하였습니다.');
            }
        });
    });

//======================================================================================//

    // 주차 부분 리로드 ajax
    function updateWeekRange() {

        let year = getYear();
        let month = getMonth();
        let week = getWeek();

        const id = "#week_range";

        $.ajax({
            url: '/salesTarget/getWeekRange',
            type: 'GET',
            data: {
                date: year,
                month: month,
                week: week,
                id: id
            },
            success: function(fragment) {
                // 부분 리로드
                $(id).replaceWith(fragment);
            },
            error: function() {
                alert("정보를 불러오는 데 실패했습니다.")
                return false;
            }
        })
    }

    // ajax에 필요한 값 설정 부분
    function pointReload() {
        $('.point_skill').each(function() {
            let year = getYear();
            let month = getMonth();
            let week = getWeek();
            let category = getCategory();
            let departmentCode = $(this).closest('.each_pointwrap').attr('id');
            let info = $(this).closest('.each_point').find('._info');
            const className = "._info";

            getSalesTarget(info, year, month, week, category, departmentCode, className);
        });
    }

    // 리스트 조회 및 리로드 ajax
    function getSalesTarget(info, year, month, week, category, departmentCode, className) {
        $.ajax({
            url: '/salesTarget/getSalesTargetList',
            type: 'GET',
            data: {
                year: year,
                month: month,
                week: week,
                category: category,
                departmentCode: departmentCode,
                className: className
            },
            success: function(fragment) {
                // 부분 리로드
                $(info).replaceWith(fragment);
            },
            error: function() {
                alert("정보를 불러오는 데 실패했습니다.");
                return false;
            }
        });
    }
})