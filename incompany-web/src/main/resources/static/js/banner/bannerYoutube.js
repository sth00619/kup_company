$(document).ready(function () {
    // ajax 실패 메시지
    const failMessage = "저장에 실패하셨습니다. 담당자에게 문의하세요.";
    //정규표현식 (종료 시간 유효성 검사에 사용됩니다.)
    const regex = /\d{2}:\d{2}/;

    // 저장 버튼 클릭시
    $(document).on('click', '._addBtn', function () {

        const videoTitle = document.getElementById('videoTitle').value.trim();
        const videoId = document.getElementById('videoId').value.trim();
        let endTime = document.getElementById('endTime').value.trim();
        if($('#showCheck').is(':checked') == true){
            var showCheck = "Y";
        }else{
            var showCheck = "N";
        }

        // 유효성 검사
        if (videoTitle.length == 0) {
            alert("영상 제목을 입력해주세요.");
            return false;
        }

        if ( !(videoId.length == 11) ) {
            alert("올바른 영상 ID를 입력해주세요.");
            return false;
        }
        if (endTime.length == 0){
            endTime = "00:00";
        } else if(endTime.length != 5 || regex.test(endTime) == false){
            alert("올바른 종료 시간을 입력해주세요.");
            return false;
        }

        $.ajax({
            type: "POST",
            url: "/banner/addBannerYoutube",
            data: {
                videoTitle : videoTitle,
                videoId : videoId,
                endTime : endTime,
                showCheck : showCheck
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

    // 수정 버튼 클릭시
    $(document).on('click', '._writeBtn', function () {

        $('._writeBtn').not($(this)).hide();

        var youtubeTable = $('._youtubeTable')
        var youtubeInputList = youtubeTable.find('input');
        youtubeInputList.attr('readonly', true);
        youtubeInputList.removeClass('_selectInput');

        var updateBtn = youtubeTable.find('._updateBtn');
        updateBtn.text('수정');
        updateBtn.addClass('_writeBtn');
        updateBtn.removeClass('_updateBtn');
        var exitBtn = youtubeTable.find('._exitBtn');
        exitBtn.hide();

        var closetBylList = $(this).closest('._bylList');
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

        $('._youtubeTable').load(location.href + ' ._youtubeTable');
    });

    // 수정 - 저장 버튼 클릭시
    $(document).on('click', '._updateBtn', function () {
        var closetForm = $(this).closest('._bylList');
        var videoNo = closetForm.find('._videoNo').text().trim();
        var videoTitle = closetForm.find('._videoTitle').val().trim();
        var videoId = closetForm.find('._videoId').val().trim();
        var endTime = closetForm.find('._endTime').val().trim();
        if(closetForm.find('._showCheck').is(':checked') == true){
            var showCheck = "Y";
        }else{
            var showCheck = "N";
        }

        // 유효성 검사
        if (videoTitle.length == 0) {
            alert("영상 제목을 입력해주세요.");
            return false;
        }

        if ( !(videoId.length == 11) ) {
            alert("올바른 영상 ID를 입력해주세요.");
            return false;
        }

        if (endTime.length == 0){
            endTime = "00:00";
        } else if(endTime.length != 5 || regex.test(endTime) == false){
            alert("올바른 종료 시간을 입력해주세요.");
            return false;
        }

        $.ajax({
            type: "POST",
            url: "/banner/updateBannerYoutube",
            data: {
                videoNo : videoNo,
                videoTitle : videoTitle,
                videoId : videoId,
                endTime : endTime,
                showCheck : showCheck
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

    // 삭제 버튼 클릭시
    $(document).on('click', '._deleteBtn', function () {
        var videoNo = $(this).closest('._bylList').find('._videoNo').text();

        var result = confirm("삭제하시겠습니까?")
        if (!result) {
            return false;
        }
        $.ajax({
            url: "deleteBannerYoutube",
            type: "DELETE",
            data: {
                videoNo : videoNo
            },
            success: function () {
                location.reload();
            },
            error: function () {

                alert('영상 삭제에 실패하셨습니다.');
                return false;

            }
        })
    });
});