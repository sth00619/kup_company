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
  // const DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";
  // $("#dtBox").DateTimePicker({
  //   dateTimeFormat: DATE_FORMAT,
  // });
  // $("#dtBox2").DateTimePicker({
  //   dateTimeFormat: DATE_FORMAT,
  // });
  var form = $('#form');

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
  $(document).on('click', '#updateNoticeBtn', function () {
    // var startTime = $('#startTime').val();
    // var endTime = $('#endTime').val();
    var contents = editor.getHTML();
    var category = $('.preface_select option:selected').val();

    console.log(category)

    $('#form').attr("action", "updateNotice")
    form.append("<input type='text' name='contents' value='" + contents + "' hidden>");
    form.append("<input type='text' name='category' value='" + category + "' hidden>");

    form.submit();
    // }else{
    //   var ans = confirm("고정 공지사항 시작날짜와 끝날날짜를 입력 안하실경우 고정되지 않습니다")
    //   }if(ans){
    //     $('#form').attr("action", "updateNotice")
    //     form.append("<input type='hidden' name='contents' value='" + contents + "'>");
    //     form.submit();
    // }
  })

  
  $('input[type="text"]').keydown(function() {
    if (event.keyCode === 13) {
      event.preventDefault();
    };
  });

  $(document).on('click', '._cancelBtn', function(){
      window.history.back();
  });
  
  
})

