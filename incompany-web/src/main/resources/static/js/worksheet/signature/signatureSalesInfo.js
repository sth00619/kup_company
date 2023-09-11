$(document).ready(function () {

    const signatureSalesNo = $('#signatureSalesNo').val();

    //취소버튼 경로설정
    $(document).on('click', '._cancelBtn', function () {
        window.history.back();
        /*var url = "/worksheet/signature/signatureSalesList";
        $(location).attr('href', url);*/
    });

    //삭제버튼 처리
    $(document).on('click', '._deleteBtn', function () {
        var result = window.confirm("정말 삭제하시겠습니까?");
        if (result) {
            var form = $('#signatureInfo').attr("action", "/worksheet/signature/deleteSignatureSales?signatureSalesNo=" + signatureSalesNo);
            form.submit();
        } else {
            return false;
        }
    });

    //수정버튼 처리
    $(document).on('click', '._updateBtn', function () {
        var url = "/worksheet/signature/updateSignatureSales?signatureSalesNo=" + signatureSalesNo;
        $(location).attr('href', url)
    });

})