//toast UI
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
    const cloudUrl = $('#cloudUrl').val();

    var commandNo = $('#commandNo').val();

    //삭제버튼 처리
    $(document).on('click','._deleteBtn', function(){
        var result = window.confirm("정말 삭제하시겠습니까?");
        if(result){
            $('#commandInfo').attr("action","/command/deleteCommand?commandNo="+ commandNo);
            form.submit();
        }else {
            return false;
        }
    });

    //수정버튼 처리
    $(document).on('click','._updateBtn', function(){
        var url = "/command/updateCommand?commandNo="+commandNo;
        $(location).attr('href',url)
    });

    //전체목록 버튼
    $(document).on('click','._fullListBtn', function(){
        var url = "/command/list";
        $(location).attr('href',url)
    });

    // 파일 다운로드
    $(document).on('click','#downFile', function(){
        var fileName = $(this).text();
        var downloadFile = cloudUrl+fileName;
        location.href=downloadFile;
    })
    //첨부파일 클릭
    $('.file_click').on('click',function(){
        $('.file_viewbox').toggleClass('file_on');
    });
})