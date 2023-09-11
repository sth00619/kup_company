var tdContent = document.getElementById('contents')
var contents = tdContent.innerText;

const Editor = toastui.Editor;
const tableMergedCell = Editor.plugin.tableMergedCell;
const colorSyntaxPlugin = Editor.plugin.colorSyntax;

const viewer = Editor.factory({
    el: document.querySelector('#viewer'),
    viewer: true,
    initialValue: contents,
    plugins: [tableMergedCell, colorSyntaxPlugin]
});

$(document).ready(function(){

    var faqNo = $('#faqNo').val();
    var form =$('#form');

    $("#listBtn").on("click",function(){
        window.history.back();
    });

    $(document).on('click','#deleteBtn', function(){
        var ans =confirm("삭제하시겠습니까?")
        if(ans){
        $('#form').attr("action","deleteFaq");
        form.append("<input type='hidden' name ='faqNo' value='"+faqNo+"'>");
        form.append("<input type='hidden' name='_method' value='delete'>");
        form.submit();
        }
    })

})



