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

  var today = moment().format('YYYY-MM-DD');

  $('#today').text(today);
  var type = $('#type').val();

  var form = $('#form');
  
  $(document).on('click', '#addNoticeBtn', function () {
    

    var contents = editor.getHTML();
    var category = $('.preface_select option:selected').val();


        $('#form').attr("action", "addNotice")

        form.append("<input type='text' name='contents' value='" + contents + "' hidden>");
        if(type == 1 || type == 2) {
          form.append("<input type='text' name='category' value='" + category + "' hidden>");

        }

        form.submit();


  })

  $('input[type="text"]').keydown(function() {
    if (event.keyCode === 13) {
      event.preventDefault();
    };
  });
  
  
  $(function () {
    $('#attacheFiles').MultiFile({
      max: 5,
    });
  });
})

