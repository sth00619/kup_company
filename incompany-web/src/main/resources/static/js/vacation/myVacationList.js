$('._myVacationList').on('click', function () {
    let url = "/vacation/vacationInfo";

    // 휴가 신청 정보 고유 번호
    url += "?vacationRecordNo=" + $(this).attr('value');

    // 휴가 신청 정보 상세 보기 이동
    $(location).attr('href', url);
});

// 진행 구분 별 조회 radio 그룹 클릭
$(document).on('click', '._status', function (e) {
    let url = '/vacation/myVacationList';

    // 진행 구분
    url += '?status=' + $(this).prev().val();

    // 기간 조회 타입
    url += '&dateType=' + $('#dateType').val();

    // 요청 할 기준 일
    url += '&requestDate=' + $('#requestDate').val();

    $(location).attr('href', url);
});