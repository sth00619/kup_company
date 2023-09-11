const Editor = toastui.Editor;
const tableMergedCell = Editor.plugin.tableMergedCell;
const colorSyntaxPlugin = Editor.plugin.colorSyntax;

const editor = new Editor({
    el: document.querySelector('#editor'),
    height: '450px',
    initialEditType: 'wysiwyg',
    previewStyle: 'vertical',
    plugins: [tableMergedCell, colorSyntaxPlugin]
});



$(document).ready(function () {

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

    // toast UI 에디터의 contents 부분 form테그와 함께 전송
    var form = $('#addDocument');
    $(document).on('click', '._submitBtn', function () {
        var contents = editor.getHTML();
        $('#addDocument').attr("action", "addDocument")
        form.append("<input type='text' name='contents' value='" + contents + "' hidden>");
        form.submit();
    });


    $(document).on('click', '#back', function () {
        window.history.back();
    });



    var form = $('#form');


    $(document).on('click', '#addBtn', function () {

        var contents = editor.getHTML();

        $('#form').attr("action", "form")
        form.append("<input type='text' name='contents' value='" + contents + "' hidden>");

        form.submit();


    })

    $(function () {
        $('#attacheFiles').MultiFile({
            max: 5,
        });
    });


});