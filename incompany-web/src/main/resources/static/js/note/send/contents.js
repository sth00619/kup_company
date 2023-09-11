$(document).ready(function () {
  const noteNo = $("#noteNo").val();

  $(document).on("click", "#saveBtn", function () {
    $.ajax({
      type: "PUT",
      url: "/note/send/save",
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
          $(location).attr("href", "/note/send/list");
        },
      }).fail(function () {
        alert("삭제에 실패하셨습니다");
        return false;
      });
    }
  });

  $(document).on("click", "#cancelBtn", function () {
    var result = confirm("발송 취소 하시겠습니까??");

    if (result) {
      $.ajax({
        type: "DELETE",
        url: "/note/send/cancel",
        data: {
          noteNo: noteNo,
        },
        success: function (result) {
          if (result) {
            alert(result);
            return false;
          }
          $(location).attr("href", "/note/send/list");
        },
      }).fail(function () {
        alert("발송 취소에 실패하셨습니다");
        return false;
      });
    }
  });
});
