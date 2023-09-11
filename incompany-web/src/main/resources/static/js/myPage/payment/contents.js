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

    const firstOrdering = $('._paymentApprCode').first().text();

    const lastOrdering = $('._paymentApprCode').last().text();

    const loginEmployeeCode = $('#loginEmployeeCode').val();

    const boardType = $('#boardType').val();

    const cloudUrl = $('#cloudUrl').val();

    var no = $('#_no').val();
    var paymentTitle = $('#_paymentTitle').val();
    var form = $('#form');


    // 삭제
    $(document).on('click', '#deleteBtn', function () {
        var ans = confirm("삭제하시겠습니까?")
        if (ans) {
            form.attr("action", "contents");
            form.append("<input type='hidden' name ='paymentNo' value='" + no + "'>");
            form.append("<input type='hidden' name='_method' value='delete'>");
            form.submit();

        }
    })

    // 파일 토글
    $('.file_click').on('click', function () {

        $('.file_viewbox').toggleClass('file_on');
    });

    $(document).on('click', '#updateBtn', function () {
        location.href = '/worksheet/request/edit?no=' + no;
    });

    $(document).on('click', '#goList', function () {
        history.back();

    });

    $(document).on('click', '._downFile', function () {
        var fileName = $(this).text();
        location.href = cloudUrl + fileName;

    });

    $(document).on('click', '._paymentBtn', function () {

        var paymentVal = $(this).val();
        var paymentText = $(this).text();
        var draftEmployeeCode = $('#_draftEmployeeCode').val();
        var step;
        var status;
        var nextApprover;

        // 다음 결재자 찾기
        $('._paymentApprCode').each(function (index, value) {
            if ($(this).text() === loginEmployeeCode) { //값 비교 

                nextApprover = $('._paymentApprCode').eq(index + 1).text();
                return;
            }
        });

        // 반려버튼일때
        if (paymentVal == 3) {
            step = 3;
            status = 3
        }

        // 결재했을때
        if (paymentVal == 1) {

            status = 1;
            step = 2;

            // 결재자가 마지막 결재자일때
            if (lastOrdering == loginEmployeeCode) {
                status = 2;
            }


        }

        var data = {
            "nextApprover": nextApprover,
            "boardType": boardType,
            "status": status,
            "no": no,
            "paymentTitle": paymentTitle,
            "step": step,
            "draftEmployeeCode": draftEmployeeCode,
        }

        console.log('contents.js / line:122 - data : ', data);

        $.ajax({
            type: "PUT",
            url: "/myPage/payment/step",
            data: data,
            success: function () {
                alert(paymentText + "가 완료되었습니다");
                location.href = "/myPage/payment/received?type=0&step=1";
            }

        }).fail(function () {
            alert("결재에 실패하셨습니다");
            return false;
        });



    });





});