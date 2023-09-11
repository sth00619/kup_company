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

    // 이전글 다음글
    var preQuestionNo = $('#preQuestion').attr('value');
    var nextQuestionNo = $('#nextQuestion').attr('value');

    // 게시물 번호
    var questionNo = $('#questionNo').val();

    $(document).on('click','#preBtn',function(){
        var url = "/faQuestion/questionInfo?questionNo="+preQuestionNo;
        $(location).attr('href',url)
    });

    $(document).on('click','#nextBtn',function(){
        var url = "/faQuestion/questionInfo?questionNo="+nextQuestionNo;
        $(location).attr('href',url)
    });

    // 삭제버튼 처리
    $(document).on('click','._deleteBtn', function(){
        var result = window.confirm("정말 삭제하시겠습니까?");
        if(result){
            $('#questionInfo').attr("action","/faQuestion/deleteQuestion?questionNo="+ questionNo);
            form.submit();
        }else {
            return false;
        }
    });

    // 수정버튼 처리
    $(document).on('click','._updateBtn', function(){
        var url = "/faQuestion/updateQuestion?questionNo="+questionNo;
        $(location).attr('href',url)
    });

    //전체목록 버튼
    $(document).on('click','._fullListBtn', function(){
        var url = "/faQuestion/list";
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