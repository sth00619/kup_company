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

$(document).ready(function () {

    var projectNo = $('#projectNo').val();
    var form =$('#form');


    // 삭제
    $(document).on('click','#deleteBtn', function(){
        var ans =confirm("삭제하시겠습니까?")
        if(ans){
        $('#form').attr("action","delete");
        form.append("<input type='hidden' name ='projectNo' value='"+projectNo+"'>");
        form.append("<input type='hidden' name='_method' value='delete'>");
        form.submit();
        }
    })


    $(document).on('click','#updateBtn', function(){
    location.href = '/worksheet/project/edit?projectNo='+projectNo;
    });

    $(document).on('click','#goList', function(){
        location.href = '/worksheet/project/list';
    });
    
    // 파일 토글
    $('.file_click').on('click',function(){
        $('.file_viewbox').toggleClass('file_on');
    });
    

});