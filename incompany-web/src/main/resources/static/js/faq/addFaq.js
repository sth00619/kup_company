//toast UI
const Editor = toastui.Editor;
const tableMergedCell = Editor.plugin.tableMergedCell;
const colorSyntaxPlugin = Editor.plugin.colorSyntax;

const editor = new Editor({
  el: document.querySelector('#editor'),
  height: '400px',
  initialEditType: 'wysiwyg',
  previewStyle: 'vertical',
  plugins: [tableMergedCell, colorSyntaxPlugin]
});


$(document).ready(function () {
    // toast UI 에디터의 contents 부분 form테그와 함께 전송
    var form = $('#addFaq');

    var today = moment().format('YYYY-MM-DD');

    $('#today').text(today);


    $(document).on('click', '._submitBtn', function () {
        var contents = editor.getHTML();
        $('#addFaq').attr("action", "addFaq")
        form.append("<input type='text' name='contents' value='" + contents + "' hidden>");
        form.submit();
    });

    $(document).on('click', '._cancelBtn', function () {

        window.history.back();

    });

})