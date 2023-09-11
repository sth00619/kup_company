
$(document).ready(function () {

    const cloudUrl = $('#cloudUrl').val();

    // 파일 다운로드
    $(document).on('click','#downFile',function(){

        var fileName = $(this).text();
        var downloadFile = cloudUrl + fileName;

        location.href = downloadFile;
    });

    //첨부파일 클릭
    $('.file_click').on('click',function(){
        $('.file_viewbox').toggleClass('file_on');
    });

    // 이미지 클릭 시 모달창 오픈
    $(document).on('click','._fileImg', function(){
        var fileUrl = $(this).attr('src');
        $('#fileUrl').attr('src',fileUrl);
        $('.modal').modal();
    });
})