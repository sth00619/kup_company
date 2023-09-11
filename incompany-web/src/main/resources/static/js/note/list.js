$(document).ready(function () {
  // <li> 영역 클릭 시 하위 <a> 강제 클릭
  $("._page").on("click", function () {
    $(this).children("a").get(0).click();
  });

  // 다음 or 이전 페이지 없을 때 버튼 숨김 및 class 삭제
  $(".disabled").children("a").removeAttr("class");
  $(".disabled").attr("hidden", true);

  var page = $("._page").children("a");
  //    $('._a_first, ._a_pre, ._a_page, ._a_next, ._a_last').on('click', function(){

  page.on("click", function () {
    /*
     *  페이징에 필요한 값 세팅
     *  필수로 세팅 해야함
     */
    var nextPageNum = parseInt($("#nextPage").val()); // 다음 페이지
    var prePageNum = parseInt($("#prePage").val()); // 이전 페이지
    var pageNum = 1; // 페이지 default

    //pageNum setting
    if ($(this).hasClass("_a_page")) {
      pageNum = $(this).text();
    } else if ($(this).hasClass("_a_first")) {
      pageNum = 1;
    } else if ($(this).hasClass("_a_pre")) {
      if (prePageNum == 1) {
        pageNum = prePageNum;
      } else {
        pageNum = prePageNum - 1;
      }
    } else if ($(this).hasClass("_a_next")) {
      pageNum = nextPageNum + 1;
    } else if ($(this).hasClass("_a_last")) {
      pageNum = $("#pages").val();
    }



    const pathName = $(location).attr('pathname');

    $(location).attr(
      "href",
      pathName + "?pageNum=" + pageNum 
    );



  });



});
