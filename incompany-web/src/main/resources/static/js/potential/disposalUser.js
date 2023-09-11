$(document).ready(function() {

    var ENCRYPT_KEY_POTENTIAL_USER = "potential_mobile";

    // 검색바 엔터키 입력시 검색 실행
    $(document).on('keydown', '._searchValue', function(keyNum) {
        if (window.event.keyCode === 13) {
            searchDisposalUser();
        }
    });

    // 검색버튼 클릭시 검색 실행
    $(document).on('click', '._searchBtn', function() {
        searchDisposalUser();
    });

    function searchDisposalUser() {
        var searchValue = $('._searchValue').val();
        var searchKey = $(".select_box option:selected").val();

        if (searchKey === 'mobile') {
            searchValue = minusStr(searchValue);
            searchValue = insertHyphens(searchValue);
        }

        location.href = '/potential/disposalUser?searchKey=' + searchKey + "&searchValue=" + searchValue;
    }

    // '-' 삽입
    function insertHyphens(str) {
        if (str.length === 11) {
            var parts = str.match(/^(\d{3})(\d{4})(\d{4})$/);
            if (parts) {
                str = parts[1] + '-' + parts[2] + '-' + parts[3];
            }
        }
        return str;
    }

    // 문자 제거 Only 숫자
    function minusStr(value) {
        value = value.replace(/[^\d]+/g, "");
        return value;
    }

});
