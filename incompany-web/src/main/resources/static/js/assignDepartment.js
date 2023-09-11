$(document).ready(function(){
    // 선택한 부서 코드 추출
    var departmentCode = $('#departmentCode').val();

    // 사원 체크박스 체크에 따른 처리 이벤트
    $('.assignCheck').on('click',function(){

        // 선택한 check 박스의 checked 여부 true / false 반환
        var assignCheck = $(this).is(':checked');

        // 선택한 사원의 사원 코드 추출
        var employeeCode = $(this).parent().find('.employee').attr('value');

        // check false
        var assignUrl = '/deleteAssignDepartment';

        // check true
        if(assignCheck) assignUrl = '/addAssignDepartment';

        // assign department Ajax
        var request = $.ajax({
            url: assignUrl,
            method: 'GET',
            data: {
                  departmentCode : departmentCode
                , employeeCode   : employeeCode
            },
            dataType: 'text'
        });

        request.done(function( data ){
            if(data > 0){
                alert('✔ 정상처리 되었습니다.');
                location.reload();
            }else if(data == 0) {
                alert('☢ request.done / data == 0');
            };
        });

        request.fail(function(jqXHR, textStatus){
            alert('☢ Ajax ERROR ', jqXHR, textStatus);
        });
    });
});