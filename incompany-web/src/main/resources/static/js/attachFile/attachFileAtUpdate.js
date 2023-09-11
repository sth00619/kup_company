$(document).ready(function(){

    // 파일 삭제
    $(document).on('click', '#deleteFileListBtn', function () {
        var fileNameBef = $('.fileNameBef').length;
        $(this).parent().remove();

        if (fileNameBef < 1) {
            $('#fileListDiv').prepend('<div class="fileNameBef"><input type="file" class="selectFile"></div>')
        }

        $('#maxMsg').remove();
    });

    $(document).on('change', '.selectFile', function () {
        var maxMsg = $('#maxMsg').text();
        var fileLengths = $('.fileName').length;
        var fileNameBef = $('.fileNameBef').length;
        var fileValue = $(this).val().split("\\");
        var fileName = fileValue[fileValue.length - 1];

        var str = "";
        str += '<a id="deleteFileListBtn">x</a><span>';
        str += fileName
        str += '</span>';

        $(this).parent().prepend(str);
        $(this).attr('hidden', true);
        $('.fileNameBef').attr('class', 'fileName');
        $(this).attr('name', 'file');

        if (fileLengths + fileNameBef < 5) {
            $('#fileListDiv').prepend('<div  class="fileNameBef"><input type="file" class="selectFile"></div>');
        } else {
            if (!maxMsg) {
                $('#fileListDiv').prepend('<p id="maxMsg">파일은 최대 5개까지 업로드 가능합니다</p>');
            }
        }
    });

})