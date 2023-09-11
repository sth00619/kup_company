$(document).ready(function(){

    // 취소버튼
    $(document).on('click', '._cancelBtn', function(){
        window.history.back();
    });


    // 첨부파일 최대 5개까지
    $(function () {
        $('#attacheFiles').MultiFile({
          max: 5,
        });
    });

    // 제목 세팅
    setTitle();

    /* not null 유효성 검사 */
    $(document).on('click', '._submitBtn', function(){

        const title = $('._title').val();

        const approverStr = "approver";
        const referrerStr = "referrer";

        var approver = [];
        var referrer = [];

        $('._selectApprover').each(function () {
            approver.push($(this).val())
        });

        $('._selectRef').each(function () {
            referrer.push($(this).val())
        });

        if (!title) {
            alert('제목을 입력해주세요');
            return false;
        }

        if (approver.length == 0) {
            alert('결재자를 한명이상 선택해주세요');
            return false;
        }
    });

});

// 널 체크 함수 값이 없을 때 true 반환
function isValue(value){
    return (typeof value == 'undefined' || value === '' || value == null);
}

// 오늘 날짜 조회
function getToday(){

    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (1 + date.getMonth())).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);

    var todayType1 = year + '-' + month;        // yyyy-MM

    return todayType1;
}


// 제목 자동 세팅
function setTitle(){
    // 작성자
    const writerName = $('._writer').text();

    // 오늘 날짜
    const today = getToday();

    // 제목 세팅 - 예시) 자기계발비_연월_이름
    const titleStr = '자기계발비_' + today + '_' + writerName;
    $('._title').val(titleStr);
}

function editorFocusTop() {

    setTimeout(function(){
        $('._editor').find('.ProseMirror.toastui-editor-contents').scrollTop(0);
    }, 0);

}
