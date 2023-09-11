$(document).ready(function () {

  const loginEmployeeCode = $('#commonLoginEmployeeCode').val();

  $('#textBox').on('keyup', function() {
    $('#txtCnt').html("("+$(this).val().length+" / 1000)");

    if($(this).val().length > 1000) {
        $(this).val($(this).val().substring(0, 100));
        $('#txtCnt').html("(1000 / 1000)");
    }
});
  
  // 내게 쓰기 버튼
  $(document).on("click", "#forMe", function () {
    if (this.checked) {
      $("#receiveEmployeeCode").hide();
      $("#comment").show();
    } else {
      $("#receiveEmployeeCode").show();
      $("#comment").hide();
    }
  });

  $(document).on("click", "._searchEmployee", function () {
    $(this).next().toggleClass("saved_on");
  });

  $(document).on("keyup", "._searchEmployee", function () {

    $('.saved_list').addClass('saved_on');

    var searchEmployee = $(this).val();
    var searchUrl;
    let searchEmployeeList = $(this).next().children();

    let savedList = $(this).next();
    var checkNumber = /^(?=.*?[0-9])/;
    if (!checkNumber.test(searchEmployee)) {
      searchUrl = "searchEmployeeByName";
    } else {
      searchUrl = "searchEmployeeByCode";
    }

    $.ajax({
      type: "GET",
      url: "/companyChart/" + searchUrl,
      async: false,
      data: {
        searchEmployee: searchEmployee,
      },
      success: function (data) {


        searchEmployeeList.remove();

        var str = "";
        $.each(data, function (index, item) {
          str += '<li class="_clickApproverEmployee">';

          str += '<div class="saved_icon">';
          if (item.imageUrl) {
            str += '<img src ="';
            str += item.imageUrl;
            str += '" class="_employeeImg">';
          } else {
            str += '<img src="/images/img/quick_my.png" class="_employeeImg">';
          }
          str += "</div>";

          str += '<div class="saved_namebox">';
          str += '<div class="saved_name">';
          str += item.employeeName;
          str += "</div>";
          str += '<div class="saved_number">';
          str += item.employeeCode;
          str += "</div>";
          str += "</div>";
          str += "</li>";
        });
        savedList.prepend(str);
      },
    }).fail(function () {
      alert("사원찾기에 실패하셨습니다");
      return false;
    });
  });

  $(document).on("click", "._clickApproverEmployee", function () {


    var selectEmployeeCode = $(this).find(".saved_number").text();
    var selectEmployeeName = $(this).find(".saved_name").text();

    var searchResult = true;

    if(selectEmployeeCode === loginEmployeeCode){
      alert("받는사람에 본인이 포함되었습니다. 내게 쓰기를 선택해주세요!");
      return false;
    }


    $("._selectEmployeecode").each(function () {
      if($(this).text()===selectEmployeeCode){
        alert("받는 사람에 이미 추가된 사원입니다!");
        searchResult = false;
        return false;
      }

  });

    $('.saved_list').removeClass('saved_on');


    if (searchResult) {
      var str = "";

      str +=
        ' <div class="_selectApprDiv" style="float : left; margin : 10px;">';
      str += '<div style="float : left ; margin-right: 5px;">';
      str +=
        ' <img src="/images/img/delete.png" class="_delEmployeeBtn" style="cursor: pointer">';

      str += "</div>";
      str += '<div class="_selectEmployeeTypeList" >';
      str += '<p class="_selectEmployeecode">';
      str += selectEmployeeCode;
      str += "</p>";
      str += "<p>";
      str += selectEmployeeName;
      str += "</p>";
      str += "</div>";
      str += " <br>";
      str += " </div>";

      $(this).closest("._selectEmployee").next().prepend(str);
    }
  });

  $(document).on("click", "._delEmployeeBtn", function () {
    $(this).closest("._selectApprDiv").remove();
  });
  
// 저장 버튼
  $(document).on("click", "#addBtn", function () {
    const receiver = [];
    let isToMe = true;

    if (!$("#forMe").is(":checked")) {
      isToMe = false;
      $("._selectEmployeecode").each(function () {
        receiver.push($(this).text());
      });

      if (receiver.length === 0) {
        alert("받는 사람을 입력해주세요.");
        return false;
      }
    }

    if (isToMe) {
      $.ajax({
        url: "/note/toMe",
        method: "POST",
        data: {
          contents: $("#textBox").val(),
        },
        success: () => {
          location.href = "/note/toMe/list";
        },
      });
    } else {
      $.ajax({
        url: "",
        method: "POST",
        data: {
          contents: $("#textBox").val(),
          receiveEmployeeList: receiver,
        },
        success: () => {
          location.href = "/note/send/list";
        },
      });
    }
  });
});
