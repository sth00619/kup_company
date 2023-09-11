$(document).ready(function () {

    var groupwareRequestNo = $('#groupwareRequestNo').val();

    //전체목록 버튼
    $(document).on('click', '._fullListBtn', function () {
        var url = "/groupware/requestList";
        $(location).attr('href', url)
    });

    //삭제버튼 처리
    $(document).on('click', '._deleteBtn', function () {
        var result = window.confirm("정말 삭제하시겠습니까?");
        if (result) {
            var form = $('#groupwareRequestInfo').attr("action", "/groupware/deleteRequest?groupwareRequestNo=" + groupwareRequestNo);
            form.submit();
        } else {
            return false;
        }
    });

    //수정버튼 처리
    $(document).on('click', '._updateBtn', function () {
        var url = "/groupware/updateRequest?groupwareRequestNo=" + groupwareRequestNo;
        $(location).attr('href', url)
    });

})