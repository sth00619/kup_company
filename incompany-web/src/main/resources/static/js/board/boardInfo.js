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

    var boardNo = $('#boardNo').val();

    //이전글 다음글
    var preBoardNo = $('#preBoard').attr('value');
    var nextBoardNo = $('#nextBoard').attr('value');
    $(document).on('click','#preBtn',function(){
        var url = "/board/boardInfo?boardNo="+preBoardNo;
        $(location).attr('href',url)
    });
     $(document).on('click','#nextBtn',function(){
        var url = "/board/boardInfo?boardNo="+nextBoardNo;
        $(location).attr('href',url)
    });

    //삭제버튼 처리
    $(document).on('click','._deleteBtn', function(){
        var result = window.confirm("정말 삭제하시겠습니까?");
        if(result){
            $('#boardInfo').attr("action","/board/deleteBoard?boardNo="+ boardNo);
            form.submit();
        }else {
            return false;
        }
    });

    //수정버튼 처리
    $(document).on('click','._updateBtn', function(){
        var url = "/board/updateBoard?boardNo="+boardNo;
        $(location).attr('href',url)
    });

    //전체목록 버튼
    $(document).on('click','._fullListBtn', function(){
        var url = "/board/list";
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