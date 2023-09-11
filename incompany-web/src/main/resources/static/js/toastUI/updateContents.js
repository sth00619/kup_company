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

    // toast UI 에디터의 contents 부분 form테그와 함께 전송
    var form = $('#updateForm');
    $(document).on('click', '._submitBtn', function () {
        var contents = editor.getHTML();
        $('#paymentCheck').attr('value','N');
        form.append("<input type='text' name='contents' value='" + contents + "' hidden>");
        form.submit();
    });
    $(document).on('click', '._temporaryBtn', function () {
        var contents = editor.getHTML();
        $('#paymentCheck').attr('value','T');
        form.append("<input type='text' name='contents' value='" + contents + "' hidden>");
        form.submit();
    });

})