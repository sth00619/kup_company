$(document).ready(function () {

const cloudUrl = $('#cloudUrl').val();

    $(document).on('click', '.dleFileListBtn', function () {
        var fileNameBef = $('.fileNameBef').length;

        var deleteFileName = $(this).prev().prev().val();
        $('#form').append("<input name='deleteFile' value='"+cloudUrl+deleteFileName+"' hidden/>")

        $(this).parent().remove();
        if (fileNameBef < 1) {
            $('#fileListDiv').prepend('<div class="fileNameBef"><input type="file" class="selectFile"></div>')
        }
        // $('#maxMsg').remove();

    })



    $(document).on('change', '.selectFile', function () {
        var key = $(this).attr('name');
        var fileListDiv = $(this).closest('.fileListDiv')
        
        var maxMsg = $('#maxMsg').text()

        var fileLengths = $('.fileName').length;
        var fileNameBef = $('.fileNameBef').length;
        var fileValue = $(this).val().split("\\");
        var fileName = fileValue[fileValue.length - 1];

        var str = "";
        str += '<span class="_fileMargin">';
        str += fileName
        str += '</span>';
        str += '<a class="dleFileListBtn">x</a>'

        $(this).parent().prepend(str)
        $(this).attr('hidden', true)
        $('.fileNameBef').attr('class', 'fileName')
        $(this).attr('name', key)
        fileListDiv.prepend('<div  class="fileNameBef"><input type="file" name="'+key+'" class="selectFile"></div>')

        // if (fileLengths + fileNameBef < 5) {
        //     $('#fileListDiv').prepend('<div  class="fileNameBef"><input type="file" class="selectFile"></div>')
        // } else {
        //     if (!maxMsg) {
        //         $('#fileListDiv').prepend('<p id="maxMsg">파일은 최대 5개까지 업로드 가능합니다</p>')
        //     }
        // }
    })

    $(document).on('click', '#updateBtn', function () {


        $('#form').attr("action", "info")
        form.submit();

    })


})