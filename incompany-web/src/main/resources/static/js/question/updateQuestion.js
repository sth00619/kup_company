//toast UI
var tdContent = document.getElementById('contents')
var contents = tdContent.innerText;

const Editor = toastui.Editor;
const tableMergedCell = Editor.plugin.tableMergedCell;
const colorSyntaxPlugin = Editor.plugin.colorSyntax;

const editor = new Editor({
    el: document.querySelector('#editor'),
    height: '500px',
    initialEditType: 'wysiwyg',
    initialValue: contents,
    previewStyle: 'vertical',
    plugins: [tableMergedCell, colorSyntaxPlugin]
});

$(document).ready(function(){

    // 파일 지우기
    $(document).on('click', '#fileListBtn', function () {
        var fileNameBef = $('.fileNameBef').length;
        $(this).parent().remove();
        if (fileNameBef < 1) {
            $('#fileListDiv').prepend('<div class="fileNameBef"><input type="file" class="selectFile"></div>')
        }
        $('#maxMsg').remove();
    });

    // 파일 업로드
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
    });



    // toast UI 에디터의 contents 부분 form테그와 함께 전송
    var form = $('#updateQuestion');
    $(document).on('click', '._submitBtn', function () {
        var contents = editor.getHTML();
        form.append("<input type='text' name='contents' value='" + contents + "' hidden>");
        form.submit();
    });
    $(document).on('click', '._cancelBtn', function(){
        window.history.back();
    });
})