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

    var searchTitle = $('#searchTitle').val();
    var type = $('#type').val();
    var pageNum = $('#pageNum').val();
    
    var noticeNo = $('#noticeNo').val();
    var form =$('#form');




    $("#listBtn").on("click",function(){
        location.href="/notice/list?type="+type+"&pageNum="+pageNum+"&title="+searchTitle;
    });

    $(document).on('click','._deleteBtn', function(){
        var ans =confirm("삭제하시겠습니까?")
        if(ans){
        $('#form').attr("action","deleteNotice");
        form.append("<input type='hidden' name ='noticeNo' value='"+noticeNo+"'>");
        form.append("<input type='hidden' name='_method' value='delete'>");
        form.submit();
        }
    })

    $(document).on('click','#downFile',function(){
        var fileName = $(this).text();
        var downloadFile = cloudUrl+fileName;
        location.href=downloadFile;

    })
    $(document).on('click','._updateBtn',function(){
        location.href="/notice/updateNotice?type="+type+"&noticeNo="+noticeNo;

    })


    //첨부파일 클릭
    $('.file_click').on('click',function(){
        $('.file_viewbox').toggleClass('file_on');
    });
    
    
})