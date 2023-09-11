var tdContent = document.getElementById('contents')
var contents = tdContent.innerText;

const Editor = toastui.Editor;
const tableMergedCell = Editor.plugin.tableMergedCell;
const colorSyntaxPlugin = Editor.plugin.colorSyntax;

const editor = new Editor({
    el: document.querySelector('#editor'),
    height: '450px',
    initialEditType: 'wysiwyg',
    initialValue: contents,
    previewStyle: 'vertical',
    plugins: [tableMergedCell, colorSyntaxPlugin]
});


$(document).ready(function () {

    var form = $('#form');
    var requestNo = $('#requestNo').val();

    // 양식 radio 타입에 id 생성
    var i = 0;
    $.each($('._writeForm'), function () {
        $(this).attr('id', i);
        $(this).next().attr('for', i);
        i++;
    });
    // 양식 라디오 버튼 클릭 시 해당 양식 contents에 출력
    $(document).on('change', '._writeForm', function () {
        var text = $(this).val()
        editor.setHTML(text);
    });

    $(document).on('click', '#dleFileListBtn', function () {
        var fileNameBef = $('.fileNameBef').length;
        $(this).parent().remove();
        if (fileNameBef < 1) {
            $('#fileListDiv').prepend('<div class="fileNameBef"><input type="file" class="selectFile"></div>')
        }
        $('#maxMsg').remove();

    })

    $(document).on('change', '.selectFile', function () {
        var maxMsg = $('#maxMsg').text()
        var fileLengths = $('.fileName').length;
        var fileNameBef = $('.fileNameBef').length;
        var fileValue = $(this).val().split("\\");
        var fileName = fileValue[fileValue.length - 1];

        var str = "";
        str += '<a  id="dleFileListBtn">x</a><span>';
        str += fileName
        str += '</span>';
        $(this).parent().prepend(str)
        $(this).attr('hidden', true)
        $('.fileNameBef').attr('class', 'fileName')
        $(this).attr('name', 'file')
        if (fileLengths + fileNameBef < 5) {
            $('#fileListDiv').prepend('<div  class="fileNameBef"><input type="file" class="selectFile"></div>')
        } else {
            if (!maxMsg) {
                $('#fileListDiv').prepend('<p id="maxMsg">파일은 최대 5개까지 업로드 가능합니다</p>')
            }
        }
    })

    $(document).on('click', '#updateBtn', function () {

        var contents = editor.getHTML();

        $('#form').attr("action", "edit")
        form.append("<input type='text' name='contents' value='" + contents + "' hidden>");
        form.submit();

    })

    $(document).on('click', '#goContents', function () {
        location.href = '/worksheet/request/contents?requestNo=' + requestNo;

    });


});