$(document).ready(function(){

    // AS-IS : 보험 계약 클릭 -> 보험 상세 페이지 진입 -> 뒤로가기 -> 계약확인 -> 계약확인 됨
    // TO-BE : 보험 계약 클릭 -> 보험 상세 페이지 진입 -> 뒤로가기 -> 계약확인 -> '보험 계약을 선택해 주세요' 얼럿떠야함
    // 해결방법 : 페이지 로드 시 아래 함수 호출하여 리스트 영역만 새로고침 - 새로고침 하면 checked 가 해제 됨
    // 상세 이슈 : feature/issue458
    reloadList();

    function reloadList() {
        $('.contract_sub_txt2').load(location.href+' .contract_sub_txt2');
    }
    
    //계약 선택 시 계약 상세 보기 이동
    $(document).on('click', '._insurance_sub > li', function(){
        const insuranceManageNo = $(this).parent().attr('value');
        if(!$(this).hasClass('_checkbox_li') && typeof insuranceManageNo != 'undefined' && insuranceManageNo !== '' && insuranceManageNo != null){
            var url = "/insurance/insuranceInfo?insuranceManageNo="+insuranceManageNo;
            $(location).attr('href',url);
        }
    });

    // 리로드 시 세팅되어 유지 시켜야 되는 파라미터들 - 리로드 시 한 번만 세팅
    const urlArray = [{urlKey: 'searchKey', urlVal: $('#searchKey').val()}
        , {urlKey: 'searchValue', urlVal: $('#searchValue').val()}];

    // url parameter 세팅
    function settingUrl(urlArray){
        let url = '';

        // 바뀔 수 있는 값들 -> 이벤트 발생 시 최신 값으로 세팅
        urlArray.push({ urlKey : 'employeeCode', urlVal : $('._employee_select').val() }
                    , { urlKey : 'departmentCode', urlVal : $('#getDepartmentCode').val() });

        // 값이 있는 parameter 들만 url 세팅
        $.each(urlArray, function(index, item){
            if(typeof item.urlVal != 'undefined' && item.urlVal !== '' && item.urlVal != null){
                url += "&"+item.urlKey+"="+item.urlVal;
            }
        })

        // 맨 앞 '&' 제거
        return url.substring(1);
    }

    // 계약 확인 버튼 구현
    $('._check_insurance').on('click', function(){
        const insuranceManageNoList = getCheckInsuranceManageNoList();
        if(typeof insuranceManageNoList != 'undefined' && insuranceManageNoList !== '' && insuranceManageNoList != null) {
            // url parameter 추가
            urlArray.push({ urlKey : 'pageNum', urlVal : $('#pageNum').val()});

            // url 문자열 세팅
            const url = settingUrl(urlArray);
            $(location).attr('href',"/insurance/updateCheckInsurance?"+url+insuranceManageNoList);
        } else {
            alert('보험 계약을 선택해 주세요.');
        }
    });

    function getCheckInsuranceManageNoList(){
        let insuranceManageNoList = '';
        $('._sub_check:checked').each(function() {
            insuranceManageNoList += "&insuranceManageNoList="+$(this).parents('._sub_ul').attr('value');
        });
        return insuranceManageNoList;
    }

    $('._top_left_menu').removeAttr('hidden');

    /*검색*//*검색*//*검색*//*검색*//*검색*//*검색*//*검색*//*검색*//*검색*//*검색*//*검색*/
    // 검색버튼 클릭시 검색 실행
    $(document).on('click', '._searchBtn', function () {
        searchContractFortune();
    });

    // 검색바 엔터키 입력시 검색 실행 및 스페이스바 공백 제거 + 알림
    $(document).on('keyup', '._searchValue', function () {
        if (window.event.keyCode === 13) {
            searchContractFortune();
        }else if(window.event.keyCode === 32){
            const searchStr = $(this).val().replace(' ', '');
            $(this).val(searchStr);
        }
    });

    // 검색 실행 함수
    function searchContractFortune(){
        let searchValue = $('._searchValue').val();
        let searchKey = $('._searchKey').val();

        if(searchKey === '연락처'){
            searchValue = minusStr(searchValue);
            // 하이픈 추가 정규식(000-0000-0000)
            searchValue = searchValue.replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3");
        }
        // 요청 parameter 값 변경
        $.each(urlArray, function(index, item){
            if(item.urlKey === 'searchKey') {
                item.urlVal = searchKey;
            }else if(item.urlKey === 'searchValue') {
                item.urlVal = searchValue;
            }
        });

        const startDate = $('._search_start_date').val();
        const endDate = $('._search_end_date').val();
        if(startDate !== '' ){
            if(endDate !== ''){
                urlArray.push({ urlKey : 'startDate', urlVal : startDate},
                    { urlKey : 'endDate', urlVal : endDate });
            }else{
                alert('마지막 날짜를 선택해 주세요.');
                return false;
            }
        }

        // url 문자열 세팅
        const url = settingUrl(urlArray);
        $(location).attr('href',"/insurance/checkInsurance?"+url);
    }

    // 문자 제거 Only 숫자
    function minusStr(value){
        value = value.replace(/[^\d]+/g, "");
        return value;
    }

    // 처리 실패 메세지
    if ($('#isSuccess').val() === 'false') {
        const message = $('#message').val();
        if(typeof message != 'undefined' && message != '' && message != null) alert(message);
    }
});