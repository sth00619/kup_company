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

$(document).ready(function () {
    var cafeScheduleNo = $('#cafeScheduleNo').val();

    //삭제버튼 처리
    $(document).on('click', '._deleteBtn', function () {
        var result = window.confirm("정말 삭제하시겠습니까?");
        if (result) {
            var form = $('#cafeSchedule').attr("action", "/worksheet/cafe/deleteCafeSchedule?cafeScheduleNo=" + cafeScheduleNo);
            form.submit();
        } else {
            return false;
        }
    });

    //수정버튼 처리
    $(document).on('click', '._updateBtn', function () {
        var url = "/worksheet/cafe/updateCafeSchedule?cafeScheduleNo=" + cafeScheduleNo;
        $(location).attr('href', url)
    });

    //글쓰기 버튼 처리
    $(document).on('click', '._addCafeScheduleBtn', function () {
            var url = "/worksheet/cafe/addCafeSchedule";
            $(location).attr('href', url)
        });

    //이전글 다음글
    var preCafeScheduleNo = $('#preNo').attr('value');
    var nextCafeScheduleNo = $('#nextNo').attr('value');

    $(document).on('click', '#prePage', function () {
        var url = "/worksheet/cafe/cafeSchedule?cafeScheduleNo=" + preCafeScheduleNo;
        $(location).attr('href', url)
    });

    $(document).on('click', '#nextPage', function () {
        var url = "/worksheet/cafe/cafeSchedule?cafeScheduleNo=" + nextCafeScheduleNo;
        $(location).attr('href', url)
    });
})