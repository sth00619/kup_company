$(document).ready(function () {
  const noteNo = $("#noteNo").val();

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
          $(location).attr("href", "/note/toMe/list");
        },
      }).fail(function () {
        alert("삭제에 실패하셨습니다");
        return false;
      });
    }
  });
});
