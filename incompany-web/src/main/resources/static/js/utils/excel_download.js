// 다운로드 함수 (예시 : repaymentContractFortune.js > '엑셀 다운로드' 문자열 찾기)
// 다운로드 파일 명 = 파일명 + 오늘날짜(yyyyMMdd) + .xls
// 파일 명 예시 = excelDownload(테이블아이디, 상환_은행용) -> '상환_은행용_20220701.xls'
function excelDownload(table_id, file_name){

    // 다운로드 링크 생성용 태그 임시 생성
    const link = document.createElement('a');

    const today = getTodayForExcelName();

    // 타입 및 인코딩 설정
    const data_type = 'data:application/vnd.ms-excel;charset=utf-8';

    // 테이블 소스 추출
    const table_div = document.getElementById(table_id);
    const table_html = encodeURIComponent(table_div.outerHTML);

    // 파일 명 및 링크 강제 클릭 하여 다운로드 실행
    link.href = data_type + ',%EF%BB%BF' + table_html;
    link.download = file_name + '_' + today + '.xls';
    link.click();
}

// 오늘 날짜 yyyyMMdd
function getTodayForExcelName(){
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (1 + date.getMonth())).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    return year + month + day;
}