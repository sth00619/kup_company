$(document).ready(function () {
    // ajax 실패 메시지
    const failMessage = "수정을 실패하셨습니다. 담당자에게 문의하세요.";

    // 수정 버튼 클릭시
    $(document).on('click', '._writeBtn', function () {

        $('._writeBtn').not($(this)).hide();

        var imgCategoryTable = $('._imgCategoryTable')
        var imgCategoryInputList = imgCategoryTable.find('input');
        imgCategoryInputList.attr('readonly', true);
        imgCategoryInputList.removeClass('_selectInput');

        var updateBtn = imgCategoryTable.find('._updateBtn');
        updateBtn.text('수정');
        updateBtn.addClass('_writeBtn');
        updateBtn.removeClass('_updateBtn');
        var exitBtn = imgCategoryTable.find('._exitBtn');
        exitBtn.hide();

        var closetBylList = $(this).closest('._biclList');
        var updateInputList = closetBylList.find('input');

        updateInputList.attr('readonly', false);
        updateInputList.attr('disabled', false);

        updateInputList.addClass('_selectInput');
        $(this).next().show();
        $(this).text('저장');
        $(this).addClass('_updateBtn');
        $(this).removeClass('_writeBtn');
    });

    // 취소했을때 기존 value로 다시
    $(document).on('click', '._exitBtn', function () {

        $('._imgCategoryTable').load(location.href + ' ._imgCategoryTable');
    });

    // 수정 - 저장 버튼 클릭시
    $(document).on('click', '._updateBtn', function () {
        var closetForm = $(this).closest('._biclList');
        var categoryNo = parseInt(closetForm.find('._categoryNo').text());
        var categoryName = closetForm.find('._categoryName').val().trim();

        // 유효성 검사
        if (categoryName.length == 0) {
            alert("카테고리 이름을 입력해주세요.");
            return false;
        }

        $.ajax({
            type: "POST",
            url: "/banner/updateBannerImgCategory",
            data: {
                categoryNo : categoryNo,
                categoryName : categoryName,
            },
            success: function(data) {
                if(data === true){
                    location.reload();
                } else {
                    alert(failMessage);
                }
            },
            error: function (){
                alert(failMessage);
                return false;
            }
        })
    });
});