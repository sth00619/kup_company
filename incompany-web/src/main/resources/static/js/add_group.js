$(document).ready(function () {
    const MAX_CODE = '99';
    const COMPANY_START_CODE = 'C';

    $(document).on('click', '#addGroupBtn', function () {
        var companyCode = $('#companyCode').val();

        if (typeof companyCode != 'undefined' && companyCode != '' && companyCode != 'null') {
            $('._companyCode').val(companyCode).prop('selected', true);
        } else {
            companyCode = $('select[name=companyCode] option:selected').val();

        }

        var request = $.ajax({
            url: '/getDepartmentDepth',
            method: 'GET',
            data: {
                companyCode: companyCode
            },
            dataType: 'json'
        })
        request.done(function (data) {

            $(data).each(function (index, item) {
                var D1Code = item.departmentCode;
                var D1Name = item.departmentName;

                $('._D1').append('<option class="_oneDepth" value="' + D1Code + '">' + D1Name + '</option>');


            })
        })


    })

    /*상위부서 별 하위부서*/
    $(document).on('change', '._companyCode', function () {

        var companyCode = this.value;

        $('._oneDepth').remove();
        $('._twoDepth').remove();
        $('._threeDepth').remove();

        $('#addCompany').val('');
        $('#addOneDepth').val('');
        $('#addOneDepth').show();

        $('#addTwoDepth').val('');
        $('#addTwoDepth').hide();

        $('#addThreeDepth').val('');
        $('#addThreeDepth').hide();


        var request = $.ajax({
            url: '/getDepartmentDepth',
            method: 'GET',
            data: {
                companyCode: companyCode
            },
            dataType: 'json'
        })
        request.done(function (data) {
            $(data).each(function (index, item) {
                var D1Code = item.departmentCode;
                var D1Name = item.departmentName;

                $('._D1').append('<option class="_oneDepth" value="' + D1Code + '">' + D1Name + '</option>');
            })
        })

    })


    $(document).on('change', '._D1', function () {


        var departmentCode = this.value;
        var lastCode = departmentCode.slice(1, 3);


        $('#addOneDepth').val('');
        $('#addTwoDepth').val('');
        $('#addTwoDepth').hide();

        $('#addThreeDepth').val('');
        $('#addThreeDepth').hide();

        $('#departmentCode').attr('value', departmentCode);
        $('._twoDepth').remove();
        $('._threeDepth').remove();

        if (departmentCode == 'D') {
            $('#addOneDepth').show();
        } else if (lastCode == MAX_CODE) {
            alert("더이상 지점을 생성할수 없습니다");
            $('#addOneDepth').hide();

        } else {
            $('#addOneDepth').hide();
        }



        if (departmentCode != 'D' && departmentCode != 'noWrite' && lastCode != MAX_CODE) {


            $('._D2').append('<option class="_twoDepth" value="write">직접입력</option>');
            $('._D2').val('write').prop('selected', true);
            $('#addTwoDepth').show();
            var request = $.ajax({
                url: '/departments/getChildDepartment',
                method: 'GET',
                data: {
                    departmentCode: departmentCode
                },
                dataType: 'json'
            })
            request.done(function (data) {
                $(data.childDepartmentList).each(function (index, item) {
                    var D2Code = item.departmentCode;
                    var D2Name = item.departmentName;
                    $('._D2').append('<option class="_twoDepth" value="' + D2Code + '">' + D2Name + '</option>');
                })
            })
        }


    });




    $(document).on('change', '._D2', function () {

        var departmentCode = this.value;
        var lastCode = departmentCode.slice(4, 5);

        $('#addTwoDepth').val('');
        $('#addThreeDepth').val('');
        $('#addThreeDepth').hide();


        $('#departmentCode').attr('value', departmentCode);
        $('._threeDepth').remove();

        if (departmentCode == 'write') {
            $('#addTwoDepth').show();
        } else {
            if (lastCode == MAX_CODE) {
                alert("더이상 지점을 팀을 생성할수 없습니다")

            }
            $('#addTwoDepth').hide();
        }


        if (departmentCode != 'write' && departmentCode != 'noWrite' && lastCode != MAX_CODE) {

            $('._D3').append('<option class="_threeDepth" value="write">직접입력</option>');
            $('._D3').val('write').prop('selected', true);
            $('#addThreeDepth').show();
        }



    });


    $(document).on('change', '._D3', function () {

        var departmentCode = this.value;

        $('#addThreeDepth').val('');

        if (departmentCode == 'write') {
            $('#addThreeDepth').show();
        } else {
            $('#addThreeDepth').hide();
        }
    });

    $(document).on('click', '.cbt , #close', function () {
        $('#form').load(location.href + ' #form');
        $('#modifForm').load(location.href + ' #modifForm');


    })

    //// 조직 추가
    $(document).on('click', '#saveBtn', function () {
        var companyCode = $('._companyCode').val();
        var departmentCode;
        var departmentName;



        var oneDepth = $('#addOneDepth').val();
        var twoDepth = $('#addTwoDepth').val();
        var threeDepth = $('#addThreeDepth').val();

        if (oneDepth != '') {
            departmentCode = $('._D1').val();
            departmentName = oneDepth;

        } else if (twoDepth != '') {
            departmentCode = $('._D1').val();


            departmentName = twoDepth;


        } else if (threeDepth != '') {
            departmentCode = $('._D2').val();

            departmentName = threeDepth;

        }



        if (typeof departmentName != 'undefined' && departmentName != '' && departmentName != null) {
            if (departmentName.trim() != "") {
                var data = {
                    "companyCode": companyCode,
                    "departmentCode": departmentCode,
                    "departmentName": departmentName.trim(),
                }
                $.ajax({
                    type: "POST",
                    url: "/departments/addSub",
                    data: data,
                    success: function (insertCode) {
                        location.href = "/companyChart?departmentCode=" + insertCode;
                    }

                }).fail(function () {
                    alert("저장에 실패하셨습니다");
                    return false;
                });

            } else {
                alert("추가하실 이름을 입력해 주세요");
                return false;
            }
        } else {
            alert("추가하실 이름을 입력해 주세요");
            return false;
        }





    })

    ////////////////////////////////////////////////////////////////////////////수정, 삭제

    // 수정 데이터
    $(document).on('click', '.deta2', function (e) {

        e.stopPropagation();

        var companyName = $(this).closest('.company,is_next').text();
        var companyCode = $(this).closest('.company,is_next').attr('value');
        var departmentCode = $(this).closest('.companyChartLi').attr('value');


        if (typeof companyCode != 'undefined' && companyCode != '' && companyCode != null) {} else {
            companyName = $(this).closest('.top_slide_sub').prev('.top_slide').find('.is_next').text();

            if (typeof departmentCode != 'undefined' && departmentCode != '' && departmentCode != null) {

            } else {
                departmentCode = $('#departmentCode').val();
            }
        }


        if (typeof departmentCode != 'undefined' && departmentCode != '' && departmentCode != null) {
            $.ajax({
                url: '/departments/getDepartmentName',
                method: 'GET',
                data: {
                    "departmentCode": departmentCode
                },
                dataType: 'json'
            }).done(function (data) {


                var oneDepth = data.oneDepthName;
                var twoDepth = data.twoDepthName;
                var threeDepth = data.threeDepthName;

                $('#oneDepth').text(oneDepth);
                $('#twoDepth').text(twoDepth);
                $('#threeDepth').text(threeDepth);

            });
        }




        $('#companyName').text(companyName);
        $('#companyName').attr('value', companyCode);


        var code = $(this).attr('value');
        var codeLength = code.length;

        if (codeLength == 3) {
            var hasChildren = $(this).closest('.companyChartLi,is_next').next().hasClass('top_slide_sub3_wrap');


            $('.updateData').remove();
            $('#oneDepthName').append('<input class="updateData" id="updateName" maxlength="20">');
            $('#oneDepthName').append('<input value="' + code + '"class="updateData" id="updateCode" hidden>');
            if (!hasChildren) {
                $('#oneDepthBox').append('<div class="close_button updateData" id="deleteBtn"><img src="/images/img/close.png"></div>');
            }
        } else if (codeLength == 5) {
            var hasChildren = $(this).closest('.top_slide_sub3').next().hasClass('top_slide_sub4');
            $('.updateData').remove();
            $('#twoDepthName').append('<input class="updateData" id="updateName" maxlength="20">');
            $('#twoDepthName').append('<input value="' + code + '"class="updateData" id="updateCode" hidden>');
            if (!hasChildren) {
                $('#twoDepthBox').append('<div class="close_button updateData" id="deleteBtn"><img src="/images/img/close.png"></div>');
            }

        } else if (codeLength == 7) {
            $('.updateData').remove();
            $('#threeDepthName').append('<input class="updateData" id="updateName" maxlength="20">');
            $('#threeDepthName').append('<input value="' + code + '"class="updateData" id="updateCode" hidden>');
            $('#threeDepthBox').append('<div class="close_button updateData" id="deleteBtn"><img src="/images/img/close.png"></div>');

        } else {
            $('.updateData').remove();
            $('#updateCompanyName').append('<input class="updateData" id="updateName" maxlength="20">');
            $('#updateCompanyName').append('<input value="' + code + '"class="updateData" id="updateCode" hidden>');

        }

        $('.black_screen').css({
            visibility: 'visible',
            opacity: '.3'
        });
        $('.pop7').css({
            visibility: 'visible',
            opacity: '1'
        });


    });

    // company, deparmtent 이름 수정
    $(document).on('click', '#updateBtn', function () {
        var updateName = $('#updateName').val().trim();
        var updateCode = $('#updateCode').val();

        if (updateName != "") {
            var data = {
                "updateCode": updateCode,
                "updateName": updateName,

            };

            $.ajax({
                type: "PUT",
                url: "/departments/update",
                data: data,
                success: function () {
                    if (updateCode.substr(0, 1) == COMPANY_START_CODE) {
                        location.reload(true);
                    } else {
                        location.href = "/companyChart?departmentCode=" + updateCode;
                    }
                }

            }).fail(function () {
                alert("error");
                return false;
            });
        } else {
            alert("수정하실 이름을 입력해 주세요");
            return false;
        }



    });

    $(document).on('click', '#deleteBtn', function () {
        var departmentCode = $('#updateCode').val();
        var data = {
            "departmentCode": departmentCode,
        }

        var result = confirm("삭제하시겠습니까?")
        if (result) {

            $.ajax({
                type: "DELETE",
                url: "/departments/delete",
                data: data,
                success: function (parentCode) {
                    location.href = "/companyChart?departmentCode=" + parentCode;
                }
            }).fail(function () {
                alert("error");
                return false;
            });


        } else {
            return false;
        }


    });



})
