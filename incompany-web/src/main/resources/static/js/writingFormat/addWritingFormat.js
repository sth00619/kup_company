//toast UI
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

$(document).ready(function(){

    // board type 별 추가 된 양식 불러오기
    var savedWritingFormat = $('._savedWritingFormat');
    $('._boardTypeSelect').on('change',function(){
        var boardType = $(this).val();
        savedWritingFormat.children().remove();
        if(boardType != 'non'){
            addedFormatOfBoardType(boardType);
        }
    });

    // board type 별 추가 된 양식 불러오기 Ajax
    function addedFormatOfBoardType(boardType){

        var request = $.ajax({
            url : '/writingFormat/callWritingFormat',
            method : 'GET',
            data : {boardType : boardType},
            dataType : 'json'
        });

        request.done(function(data){
            $.each(data, function(index, item){
                savedWritingFormat.append('<div class="_addedFormat" id="_'+ item.formatNo +'" role="button" value="'+ item.formatNo +'">'+ item.title +
                                            '</div><button class="_deleteBtn" value="'+ item.formatNo +'" type="button">X</button>');
            })
        });

        request.fail(function (jqXHR, textStatus) {
            alert('☢ Ajax ERROR : ', jqXHR, textStatus, '\n 담당자에게 문의 하세요.');
        });
    }


    // X버튼 클릭 시 삭제 함수 실행
    $(document).on('click', '._deleteBtn', function(){
        var formatNo = $(this).attr('value');
        var result = confirm("정말 삭제하시겠습니까?");
        if(result){
            deleteWritingFormatOfFormatNo(formatNo);
        }
    });

    // 선택한 양식 삭제
    function deleteWritingFormatOfFormatNo(formatNo){

        var request = $.ajax({
            url : '/writingFormat/deleteWritingFormatOfFormatNo',
            method : 'GET',
            data : {formatNo : formatNo},
            dataType : 'json'
        });

        request.done(function(data){
            var url = '/writingFormat/addWritingFormat?boardType='+data;
            console.log("url", url);
            location.href = url;
        });

        request.fail(function (jqXHR, textStatus) {
            alert('☢ Ajax ERROR : ', jqXHR, textStatus, '\n 담당자에게 문의 하세요.');
        });
    }

    // 삭제 후 리로드 시 addedFormatOfBoardType 함수 실행
    const checkBoardType = $('#checkBoardType').val();
    if(typeof checkBoardType != 'undefined' && checkBoardType !== '' && checkBoardType != null){
        addedFormatOfBoardType(checkBoardType);
    }

    // 양식 제목 클릭 시 함수 실행
    $(document).on('click','._addedFormat', function(){
        var formatNo = $(this).attr('value');
        contentsOfFormatNo(formatNo);
    });

    // 저장된 양식 제목 클릭 시 해당 내용 불러오기 Ajax
    function contentsOfFormatNo(formatNo){

        var request = $.ajax({
            url : '/writingFormat/getContentsOfWritingFormat',
            method : 'GET',
            data : {formatNo : formatNo},
            dataType : 'json'
        });

        request.done(function(data){
            $('#title').attr('value',data.title)
            editor.setHTML(data.contents);
        });

        request.fail(function (jqXHR, textStatus) {
            alert('☢ Ajax ERROR : ', jqXHR, textStatus, '\n 담당자에게 문의 하세요.');
        });
    }

    //유효성 검사
    $(document).on('click', '._submitBtn', function () {
        var form = $('#addWritingFormat');
        var contents = editor.getHTML();
        if($('._boardTypeSelect').val() == 'non' ){
            alert("게시판 종류를 선택해주세요.");
            return false;
        }else if($('#title').val() == ''){
            alert("제목을 입력해주세요.");
            $(this).focus();
            return false;
        }else if(contents == '<p><br></p>'){
            alert("내용을 입력해주세요.")
            $(this).focus();
            return false;
        }
        //toast UI 에디터의 contents 부분 form 태그와 함께 전송
        form.append("<input type='text' name='contents' value='" + contents + "' hidden>");
        form.submit();
    });

    //취소버튼 경로설정
    $(document).on('click','._cancelBtn', function(){
        var url = "/worksheet/document/addDocument";
        $(location).attr('href', url);
    });


});