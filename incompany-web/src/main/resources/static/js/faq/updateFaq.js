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

$(document).ready(function () {


    var form = $('#form');

    $(document).on('click', '#updateFaqBtn', function () {
        $('#form').attr("action", "updateFaq")
        var contents = editor.getHTML();
        form.append("<input type='hidden' name='contents' value='" + contents + "'>");
        form.submit();
        
    });


    $(document).on('click', '._cancelBtn', function () {

        window.history.back();

    });



})