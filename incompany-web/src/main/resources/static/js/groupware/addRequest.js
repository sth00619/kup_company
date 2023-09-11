$(document).ready(function(){

    /* 취소 버튼 클릭 시 뒤로가기*/
    $(document).on('click', '._cancelBtn', function(){
        window.history.back();
    });


    /* 첨부파일 추가 갯수 5개 */
    $(function () {
        $('#attacheFiles').MultiFile({
          max: 5,
        });
    });

    /* not null 유효성 검사 */
    $(document).on('click', '._submitBtn', function(){

        if(isValue($('._title').val())){
            alert("제목을 입력해 주세요.");
            $('._title').focus();
            return false;
        }

    });

});


// 널 체크 함수 값이 없을 때 true 반환
function isValue(value){
    return (typeof value == 'undefined' || value === '' || value == null);
}