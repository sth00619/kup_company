$(document).ready(function () {
    let departmentCode = $('#departmentCode').attr('value');
    const companyChart = $('.companyChart');
    const companyLength = 13;
    const oneDepthLength = 3;
    const twoDepthLength = 5;
    const isAuth = $('#_isAuth').hasClass('_authTrue');

    // 왼쪽 조직도 - 회사 구현
    company(companyChart);

    // 왼쪽 조직도 - 1뎁스 구현
    oneDepth();

    // 왼쪽 조직도 - 2뎁스 구현
    twoDepth();

    // 왼쪽 조직도 - 3뎁스 구현
    threeDepth();

    // 회사 및 부서의 하위 부서가 있을 때만 다운 표시 노출
    drop_down();

    // 넘겨받은 부서코드가 있을 때 상위 부서 및 하위 부서 펼침
    showDepartment(departmentCode);

    // 왼쪽 조직도에서 현재 부서는 경로 이동이 안되도록 value 제거
    // (수정요망) 주석처리(Feature/issue422)
    /*removeThisValue(departmentCode);*/

    $("#_companyChartUl").removeAttr('hidden');

    // 회사 클릭
    $(document).on('click', '.top_slide', function () {
        const nextVal = $(this).next().attr('value');
        if (nextVal === undefined) {
            $(this).next().slideToggle('fast');
        }
    });

    // 1뎁스 클릭
    $(document).on('click', '.top_slide_sub > li', function (e) {
        const next_class = $(this).next().attr('class');
        if (next_class === 'top_slide_sub3_wrap') {
            if (!$(e.target).hasClass("companyChart")) {
                $(this).next().slideToggle('fast');
            }
        }
    });

    // 2뎁스 클릭
    $(document).on('click', '.top_slide_sub3', function (e) {
        const next_class = $(this).next().attr('class');
        if (next_class === 'top_slide_sub4') {
            if (!$(e.target).hasClass("companyChart")) {
                $(this).next().slideToggle('fast');
            }
        }
    });

    // 왼쪽 조직도 - 부서 클릭 시
    $(document).on('click', 'a.companyChart', function () {
        // 부서 별 사원 리스트 조회
        departmentCode = $(this).attr('value');
        if (typeof departmentCode != 'undefined' && departmentCode !== '' && departmentCode != null) {
            const url = "/companyChart?departmentCode=" + departmentCode;
            $(location).attr('href', url);
        }
    });

    // 2뎁스 부서명 앞 문자열 결합
    $.each($('.top_slide_sub3').find('a'), function () {
        const thisText = $(this).text();
        const modifyText = "· " + thisText;
        $(this).text(modifyText);
    });

    // 회사 구현 메소드
    function company(companyChart) {
        $.each(companyChart, function () {
            const companyChartCode = $(this).attr('value');
            const codeLength = companyChartCode.length;

            // 회사 코드 일 때
            if (codeLength >= companyLength) {
                const companyCode = companyChartCode;
                $(this).attr('data-company-code', companyCode);
                $(this).contents().unwrap().wrap('<h2 class="company arrowon" value="' + companyCode + '" data-company-code="' + companyCode + '"></h2>');
                $('h2').parent('li.companyChartLi').contents('h2').unwrap().wrap('<div class="top_slide" value="' + companyCode + '"></div>');
            }
        });
    }

    // 1뎁스 구현 메소드
    function oneDepth() {
        const companyUlChild = $('#_companyChartUl').children();
        $.each(companyUlChild, function (index) {
            const thisLength = $(this).attr('value').length;
            const thisIndex = index;
            const oneDepthArray = [];
            if (thisLength >= companyLength) {
                $.each(companyUlChild, function (index) {
                    const companyChartLength = $(this).attr('value').length;
                    if (thisIndex < index && thisLength > companyChartLength) {
                        oneDepthArray.push(index);
                    } else if (index > thisIndex && companyChartLength === thisLength) {
                        return false;
                    }
                });
            }
            const firstChild = oneDepthArray[0];

            companyUlChild.eq(firstChild).before('<ul class="top_slide_sub"></ul>');

            $.each(oneDepthArray, function (index, item) {
                companyUlChild.eq(item).prev('.top_slide_sub').append(companyUlChild.eq(item));
            });
        });
    }

    // 2뎁스 구현 메소드
    function twoDepth() {
        const companySubChild = $('.top_slide_sub').children();
        $.each(companySubChild, function (index) {
            const thisLength = $(this).attr('value').length;
            const thisIndex = index;
            const twoDepthArray = [];
            if (thisLength <= oneDepthLength) {
                $.each(companySubChild, function (index) {
                    const companyChartLength = $(this).attr('value').length;
                    if (thisIndex < index && thisLength < companyChartLength) {
                        twoDepthArray.push(index);
                    } else if (index > thisIndex && companyChartLength <= thisLength) {
                        return false;
                    }
                });
            }

            // 배열 첫 번째 요소의 인덱스
            const firstChild = twoDepthArray[0];

            // 하위 부서 Li 들 맨 앞에 하위 부서 들을 담을 요소 생성
            companySubChild.eq(firstChild).before('<div class="top_slide_sub3_wrap"></div>');

            // 하위 부서 배열 풀어서 위에 생성한 요소에 삽입
            $.each(twoDepthArray, function (index, item) {
                companySubChild.eq(item).prev('.top_slide_sub3_wrap').append(companySubChild.eq(item));
                if (companySubChild.eq(item).attr('value').length === twoDepthLength) {
                    companySubChild.eq(item).wrap('<ul class="top_slide_sub3"></ul>');
                }
            });
        });
    }

    // 3뎁스 구현
    function threeDepth() {
        const sub3_wrap = $('.top_slide_sub3_wrap');
        $.each(sub3_wrap, function () {
            const sub3_children = $(this).children();
            let threeDepthArray = [];
            $.each(sub3_children, function (childrenIndex) {
                let firstChild;
                const this_children = $(this);
                const next_children = sub3_children.eq(childrenIndex + 1);
                const next_tagName = next_children.prop('tagName');

                if (this_children.attr('value') !== undefined && next_children.attr('value') !== undefined) {
                    // 하위부서 배열에 추가
                    threeDepthArray.push(childrenIndex);
                } else if (this_children.attr('value') !== undefined && next_children.attr('value') === undefined && next_tagName !== undefined) {
                    threeDepthArray.push(childrenIndex);
                } else if (this_children.attr('value') !== undefined && next_children.attr('value') === undefined && next_tagName === undefined) {
                    // 다음 요소가 다음 회사이거나 없을 때
                    threeDepthArray.push(childrenIndex);

                    // 하위 부서 Li 들 맨 앞에 하위 부서 Li 들을 담을 ul 생성
                    firstChild = threeDepthArray[0];
                    sub3_children.eq(firstChild).before('<ul class="top_slide_sub4"></ul>');

                    // 하위부서가 담겨있는 배열을 위에 생성한 ul 로 삽입
                    $.each(threeDepthArray, function (index, item) {
                        sub3_children.eq(item).prev('.top_slide_sub4').append(sub3_children.eq(item));
                    });

                    // 다음 부서의 하위부서를 담기 위한 배열 비우기
                    threeDepthArray = [];
                } else {
                    firstChild = threeDepthArray[0];
                    sub3_children.eq(firstChild).before('<ul class="top_slide_sub4"></ul>');

                    $.each(threeDepthArray, function (index, item) {
                        sub3_children.eq(item).prev('.top_slide_sub4').append(sub3_children.eq(item));
                    });

                    threeDepthArray = [];
                }
            });
        });
    }

    // 회사 및 부서의 하위 부서가 있을 때만 다운 표시 노출
    function drop_down() {

        const company = $('.top_slide');
        const companyChartLi = $('.companyChartLi');

        $.each(company, function () {
            const next_company_tagName = $(this).next().prop('tagName');
            const companyCode = $(this).attr('value');
            // 해당 회사의 하위 요소롤 감싸는 UL이 있을 때 다운 표시 노출
            if (next_company_tagName === 'UL') {
                $(this).children('h2').addClass('is_next');
                $(this).addClass('arrowOn');
            }

            if (isAuth) {
                $(this).children('h2').append('<div value="' + companyCode + '" class="amend_button deta2"><img src="/images/img/amend.png" alt="조직수정"></div>');
            }
        });

        $.each(companyChartLi, function () {
            const next_companyChart_tagName = $(this).next().prop('tagName');
            const departmentCode = $(this).attr('value');
            // 부서 하위에 하위 부서가 있을 때만 다운 표시 노출
            if (next_companyChart_tagName === 'DIV') {
                $(this).addClass('sub_arrowOn arrowon');
                $(this).addClass('is_next');
                $(this).parent().addClass('arrowOn arrowOff');
            }
            if (isAuth) {
                $(this).append('<div value="' + departmentCode + '" class="amend_button deta2"><img src="/images/img/amend.png" alt="조직수정"></div>');
            }
        });
    }

    // 넘겨받은 부서코드가 있을 때 상위 부서 펼침
    function showDepartment(departmentCode) {
        if (typeof departmentCode != 'undefined' && departmentCode !== '' && departmentCode != null) {
            $.each($('.companyChartLi'), function () {
                if ($(this).attr('value') === departmentCode) {
                    // 상위 부서 펼침 (+ 화살표 방향 변경)
                    $(this).parents('[class*="top_slide"]').show();

                    // arrowon 클래스가 있으면 아래방향 없으면 위방향
                    // 즉, 펼침일 땐 화살표가 아래여야 하기 때문에 arrowon 클래스를 제거
                    $(this).closest('.top_slide_sub').prev().children('h2').removeClass('arrowon');

                    if (departmentCode.length >= 5) {
                        $(this).parent().parent().prev().addClass('sub_arrowOn');
                        $(this).parent().parent().prev().removeClass('arrowon');
                    } else {
                        $(this).addClass('sub_arrowOn');
                        $(this).removeClass('arrowon');
                    }

                    // 하위 부서 펼침
                    const next_sub_class = $(this).parent().next();
                    const next_top_class = $(this).next();

                    if (next_sub_class.hasClass('top_slide_sub4')) {
                        next_sub_class.show();
                    } else if (next_top_class.hasClass('top_slide_sub3_wrap')) {
                        next_top_class.show();
                    }
                }
            });
        }
    }

    // 왼쪽 조직도에서 현재 부서는 경로 이동이 안되도록 value 제거
    function removeThisValue(departmentCode) {
        $('.companyChartLi').each(function () {
            if ($(this).attr('value') === departmentCode) {
                $(this).removeAttr('value');
                $(this).children('a.companyChart').removeAttr('value');
            }
        });
    }
});