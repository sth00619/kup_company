var tdContent = document.getElementById('contents')
var contents = tdContent.innerText;

// Toast UI
const Editor = toastui.Editor;
const tableMergedCell = Editor.plugin.tableMergedCell;
const colorSyntaxPlugin = Editor.plugin.colorSyntax;


const editor = new Editor({
    el: document.querySelector('#editor'),
    height: '400px',
    initialEditType: 'wysiwyg',
    initialValue: contents,
    previewStyle: 'vertical',
    plugins: [tableMergedCell, colorSyntaxPlugin]
});

$(document).ready(function () {
    // Click event for employeeName to toggle checkbox
    $(document).on('click', '._clickRefEmployee', function() {
        var checkbox = $(this).siblings('input[name="referrerList"]');
        checkbox.prop('checked', !checkbox.prop('checked'));
    });

    /* not null 유효성 검사 */
    $(document).on('click', '._submitBtn', function () {
        var title = $('#title').val();

        if (isEmpty(title)) {
            alert('제목을 입력해주세요');
            return false;
        }

        var referrers = getSelectedReferrers();

        if (referrers.length === 0) {
            alert('참조자를 한 명 이상 선택해주세요.');
            return false;
        }

        var form = $('#updateCommand');
        var contents = editor.getHTML();
        $('#updateCommand').attr('action', '/command/updateCommand');
        form.append("<input type='text' name='contents' value='" + contents + "' hidden>");
        form.submit();
    });

    $(document).on('click', '._cancelBtn', function () {
        window.history.back();
    });

    // 널 체크 함수 값이 없을 때 true 반환
    function isEmpty(value) {
        return typeof value == 'undefined' || value === '' || value == null;
    }

    // Function: Get selected referrers
    function getSelectedReferrers() {
        var referrers = [];
        $('._clickRefEmployee:checked').each(function() {
            referrers.push($(this).val());
        });
        return referrers;
    }
});

// 전체 선택 옵션 클릭 이벤트 처리
$(document).on('change', 'input[name="referrerList"][value="전체"]', function() {
    var isChecked = $(this).prop('checked');
    if (isChecked) {
        $('input[name="referrerList"]').not(':disabled').prop('checked', true);
    } else {
        $('input[name="referrerList"]').not(':disabled').prop('checked', false);
    }
});

// 개별 사원 선택 이벤트 처리
$(document).on('change', 'input[name="referrerList"]:not([value="전체"])', function() {
    var allSelected = true;
    $('input[name="referrerList"]').not(':disabled').each(function() {
        if (!$(this).prop('checked')) {
            allSelected = false;
            return false; // break the loop
        }
    });
    $('input[name="referrerList"][value="전체"]').prop('checked', allSelected);
});

$(document).on('click', 'label:contains("전체")', function() {
    var checkbox = $('input[name="referrerList"][value="전체"]');
    var isChecked = checkbox.prop('checked');

    checkbox.prop('checked', !isChecked);
    $('input[name="referrerList"]').not(':disabled').prop('checked', !isChecked);
});

$(document).on('change', 'input[name="referrerList"]:not([value="전체"])', function() {
    var allSelected = true;
    $('input[name="referrerList"]').not(':disabled').not('[value="전체"]').each(function() {
        if (!$(this).prop('checked')) {
            allSelected = false;
            return false; // break the loop
        }
    });
    $('input[name="referrerList"][value="전체"]').prop('checked', allSelected);
});

