const Editor = toastui.Editor;
const tableMergedCell = Editor.plugin.tableMergedCell;
const colorSyntaxPlugin = Editor.plugin.colorSyntax;

const editor = new Editor({
    el: document.getElementById('editor'),
    height: '450px',
    initialEditType: 'wysiwyg',
    previewStyle: 'vertical',
    plugins: [tableMergedCell, colorSyntaxPlugin]
});



$(document).ready(function () {

    const notExistAlert = "는 없는 코드입니다.";

    // // 양식 radio 타입에 id 생성
    var i = 0;
    $.each($('._writeForm'), function () {
        $(this).attr('id', i);
        $(this).next().attr('for', i);
        i++;
    });

    $(document).on('change', '._companyCode', function () {

        $('._departmentCode').val('');

    })

    $(document).on('change', '._departmentCode', function () {
        $('._companyCode').val('');

    })


    $(document).on('click', '._delPaymentForm', function () {


        var formText = $(this).next().next().text();

        var ans = confirm(formText + ' 양식을 삭제하시겠습니까?');

        var paymentFormNo = $(this).next().val();

        if (ans) {

            $.ajax({
                type: "DELETE",
                url: "paymentForm",
                data: {
                    "paymentFormNo": paymentFormNo
                },
                success: function (result) {
                    if (result) {
                        alert("양식을 사용하는 상신이 " + result + "개 있어 삭제가 불가능합니다");
                        return false;
                    }
                    location.reload();
                }

            }).fail(function () {
                alert("삭제에 실패하셨습니다");
                return false;
            });


        }


    })


    $(document).on('click', '#cancelRadio', function () {

        $('input:radio[name=writeFormat]:checked').prop('checked', false);
        $('#title').val('');
        $('._companyCode').val('');
        $('._departmentCode').val('');
        editor.setHTML('');


    })

    // // 양식 라디오 버튼 클릭 시 해당 양식 contents에 출력
    $(document).on('change', '._writeForm', function () {


        var paymentFormNo = $(this).val()

        $.ajax({
            type: "GET",
            url: "/myPage/payment/paymentFormInfo",
            data: {
                "paymentFormNo": paymentFormNo
            },
            success: function (data) {

                $('#formTitle').val(data.formTitle);
                $('#title').val(data.title);
                $('._companyCode').val(data.companyCode);
                $('._departmentCode').val(data.departmentCode);
                editor.setHTML(data.contents);

            }
        }).fail(function () {
            alert("error");
            return false;
        });




    });


    $(document).on('click', '#addBtn', function () {


        var title = $('#title').val();
        var formTitle = $('#formTitle').val();

        var contents = editor.getHTML();

        var companyCode = $('._companyCode').val();
        var departmentCode = $('._departmentCode').val();

        var paymentFormNo = $('input:radio[name=writeFormat]:checked').val();

        var data = {
            "title": title,
            "formTitle": formTitle,
            "contents": contents,
            "companyCode": companyCode,
            "departmentCode": departmentCode,
            "paymentFormNo": paymentFormNo
        }

        if (!title) {
            alert("제목을 입력해주세요");
            return false;
        }

        if (!formTitle) {
            alert("양식 제목을 입력해주세요");
            return false;
        }

        $.ajax({
            type: "POST",
            url: "paymentForm",
            contentType: "application/json; charset=UTF-8",
            data: JSON.stringify(data),
            success: function (result) {
                if (typeof result != 'undefined' && result != '' && result != 'null') {
                    alert(result + notExistAlert);
                    return false;
                }

                location.reload();
            }

        }).fail(function () {
            alert("저장에 실패하셨습니다");
            return false;
        });


    });


});