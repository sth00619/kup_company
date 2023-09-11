$(document).ready(function () {
  const noteNo = $("#noteNo").val();

  const sendEmployeeCode = $('#sendEmployeeCode').val();
  const sendEmployeeName = $('#sendEmployeeName').val();

  $(document).on("click", "#saveBtn", function () {
    $.ajax({
      type: "PUT",
      url: "/note/receive/save",
      data: {
        noteNo: noteNo,
      },
      success: function () {
        $(location).attr("href", "/note/save/list");
      },
    }).fail(function () {
      alert("보관에 실패하셨습니다");
      return false;
    });
  });

  $(document).on("click", "#deleteBtn", function () {
    var result = confirm("삭제하시겠습니까?");

    if (result) {
      $.ajax({
        type: "DELETE",
        url: "",
        data: {
          noteNo: noteNo,
        },
        success: function () {
          $(location).attr("href", "/note/receive/list");
        },
      }).fail(function () {
        alert("삭제에 실패하셨습니다");
        return false;
      });
    }
  });

  $(document).on("click", "#replyBtn", function () {
    $(location).attr("href", "/note/form?sendEmployeeCode=" + sendEmployeeCode + "&sendEmployeeName=" + sendEmployeeName);

  });


});
