$(document).ready(function () {
    var workLogNo = $('#workLogNo').val();

    // 권한별 버튼 노출
    // if ($('button').hasClass('_checkAuth') === false){
    //     $('._updateBtn, ._deleteBtn').show();
    // } else if ($('button').hasClass('_checkAuth') === false){
    //     $('._updateBtn, ._deleteBtn').remove();
    // }

    //결제버튼 처리
    $(document).on('click', '._paymentBtn', function () {
        var data = {
            "workLogNo": workLogNo
        }

        $.ajax({
            type: "POST",
            url: "updateCheckDocument",
            data: data,
            success: function () {
                alert("결제가 완료되었습니다")
                history.back();

            }

        }).fail(function () {
            alert("결제에 실패하셨습니다");
            return false;
        });


    });

    //취소버튼 경로설정
    $(document).on('click', '._cancelBtn', function () {
        var url = "/worksheet/document/documentList";
        $(location).attr('href', url);
    });

    //삭제버튼 처리
    $(document).on('click', '._deleteBtn', function () {
        var result = window.confirm("정말 삭제하시겠습니까?");
        if (result) {
            var form = $('#documentInfo').attr("action", "/worksheet/document/deleteDocument?workLogNo=" + workLogNo);
            form.submit();
        } else {
            return false;
        }
    });

    //수정버튼 처리
    $(document).on('click', '._updateBtn', function () {
        var url = "/worksheet/document/updateDocument?workLogNo=" + workLogNo;
        $(location).attr('href', url)
    });

    //전체목록 버튼
    $(document).on('click', '._fullListBtn', function () {
        var url = "/worksheet/document/documentList";
        $(location).attr('href', url)
    });

    //이전글 다음글
    var preWorkLogNo = $('#preWorkLog').attr('value');
    var nextWorkLogNo = $('#nextWorkLog').attr('value');
    $(document).on('click', '#preWorkLog', function () {
        var url = "/worksheet/document/documentInfo?workLogNo=" + preWorkLogNo;
        $(location).attr('href', url)
    });
    $(document).on('click', '#nextWorkLog', function () {
        var url = "/worksheet/document/documentInfo?workLogNo=" + nextWorkLogNo;
        $(location).attr('href', url)
    });
})