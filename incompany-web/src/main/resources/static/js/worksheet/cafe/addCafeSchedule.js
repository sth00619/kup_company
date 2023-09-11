$(document).ready(function(){

    // 처리 결과 메세지
    var message = $('#message').val();
    if(typeof message != 'undefined' && message != '' && message != null) alert(message);

    // 양식 radio 타입에 id 생성
    var i = 0;
    $.each($('._writeForm'), function(){
        $(this).attr('id',i);
        $(this).next().attr('for',i);
        i++;
    });
    // 양식 라디오 버튼 클릭 시 해당 양식 contents에 출력
    $(document).on('change','._writeForm',function(){
        var text = $(this).val()
        editor.setHTML(text);

        // 제목 세팅
        setTitle($(this));

        // 작성일자 오늘 날짜 세팅
        setCreateTime();

        editorFocusTop();
    });



    $(document).on('click', '._cancelBtn', function(){
        window.history.back();
    });

    $(document).on('click', '._writingFormat', function(){
        location.href = "/writingFormat/addWritingFormat";
    });

    // 첨부파일
    /*$(function () {
        $('#attacheFiles').MultiFile({
          max: 5,
        });
    });*/

    /* not null 유효성 검사 */
    $(document).on('click', '._submitBtn', function(){

        if(isValue($('._title').val())){
            alert("제목을 입력해 주세요.");
            $('._title').focus();
            return false;
        }

    });

});

// 오늘 날짜 조회
function getToday(todayType){

    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (1 + date.getMonth())).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);

    var todayType1 = year + '-' + month + '-' + day;        // yyyy-MM-dd
    var todayType2 = (year + month + day).substring(2);     // yyMMdd

    const todayTypeArr = [todayType1, todayType2];

    if(todayType > todayTypeArr.length){
        alert('todayType 은 0 ~ '+todayTypeArr.length+' 까지만 가능합니다. \n function getToday(todayType) 을 참고해주세요.');
        return false;
    }

    return todayTypeArr[todayType];
}

// 작성일자 자동 세팅
function setCreateTime(){
    const text = '작성일자';
    const create_time_element = $('strong:contains('+text+')');
    const create_time_text = create_time_element.text();
    const todayType = 0;

    if(create_time_text.indexOf(text) !== -1){
        const today = getToday(todayType);
        create_time_element.text(text + ' : ' + today);
    }
}

// 제목 자동 세팅
function setTitle(writeForm){
    // 양식 명
    const writeFormName = writeForm.parent().find('._writeLabel').text();

    // 작성자
    const writerName = $('._writer').text();

    // 오늘 날짜
    const todayType = 1;
    const today = getToday(todayType);

    // 제목 세팅 - 예시) 일일업무일지_홍길동_220528
    const titleStr = writeFormName + '_' + writerName + '_' + today;
    $('._title').val(titleStr);
}

function editorFocusTop() {

    setTimeout(function(){
        $('._editor').find('.ProseMirror.toastui-editor-contents').scrollTop(0);
    }, 0);

}

// 널 체크 함수 값이 없을 때 true 반환
function isValue(value){
    return (typeof value == 'undefined' || value === '' || value == null);
}
