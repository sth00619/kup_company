package com.kupstudio.incompany.controller.statistics;

import com.kupstudio.incompany.cacheService.statistics.RankingCacheService;
import com.kupstudio.incompany.cacheService.statistics.StatisticsCacheService;
import com.kupstudio.incompany.dto.statistics.StatisticsByCriteriaDto;
import com.kupstudio.incompany.dto.statistics.StatisticsDto;
import com.kupstudio.incompany.dto.statistics.StatisticsResultDto;
import com.kupstudio.incompany.enumClass.AuthNameEnum;
import com.kupstudio.incompany.enumClass.contractFortune.ContractFortuneSearchCateEnum;
import com.kupstudio.incompany.enumClass.contractFortune.InterestStateEnum;
import com.kupstudio.incompany.service.DepartmentSelectService;
import com.kupstudio.incompany.service.auth.AuthService;
import com.kupstudio.incompany.service.statistics.StatisticsService;
import com.kupstudio.incompany.util.StringCustomUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;
import java.util.Locale;
import java.util.Map;

@Slf4j
@RequestMapping(value = "/statistics")
@RequiredArgsConstructor
@Controller
public class StatisticsOfD3Controller {

    private static final String STATISTICS_NAME = "계약 통계 리스트";
    private static final String RANKING_NAME = "TOP 10";
    private static final String IS_NOT_AUTH_MESSAGE = "권한이 없습니다. \n담당자에게 문의하세요.";
    private static final String FAIL_MESSAGE = "처리 실패하였습니다.";

    // 통계 조회 할 부서 목록
    private static final String[] DEPARTMENT_CODE_LIST_FOR_STATISTICS = {"D0101", "D0201", "D0301", "D0401", "D0501", "D0502"};

    private final String DEFAULT_DEPARTMENT_CODE = "D";

    private final String DEFAULT_DEPARTMENT_LENGTH = "-1";
    private final int MIN_DEPARTMENT_LENGTH = 5;
    private final int LIST_COUNT = 10;

    // 기간 조회 타입 (월간 = monthly, 주간 = weekly, 둘다 = all)
    private final String DATE_SEARCH_TYPE = "all";

    private final StatisticsService statisticsService;
    private final StatisticsCacheService statisticsCacheService;
    private final DepartmentSelectService departmentSelectService;
    private final AuthService authService;
    private final RankingCacheService rankingCacheService;


    @GetMapping("/d3")
    public String contractFortune(@RequestParam(value = "dateType", required = false) Integer dateType,
                                  @RequestParam(value = "employeeCode", required = false) String employeeCode,
                                  @RequestParam(value = "searchValue", required = false) String searchValue,
                                  @RequestParam(value = "searchKey", required = false) String searchKey,
                                  @RequestParam(value = "requestDate", required = false) String requestDate,
                                  @RequestParam(value = "isSuccess", required = false) Boolean isSuccess,
                                  @RequestParam(value = "message", required = false) String message,
                                  @RequestParam(value = "locale", defaultValue = "KOREA") Locale locale,
                                  Model model, RedirectAttributes redirectAttributes) throws Exception {

        // 계약 통계 접근 권한 체크
        if (!authService.hasAuth(AuthNameEnum.CONTRACT_STATISTICS_BRANCH_MANAGER)) {
            redirectAttributes.addAttribute("isSuccess", false);
            redirectAttributes.addAttribute("message", IS_NOT_AUTH_MESSAGE);
            return "redirect:/contractFortune/contractFortune";
        }

        // 로그인한 사원에게 CONTRACT_LEADER 권한이 있을 경우 리더 부서 코드 세팅
        String leaderDepartmentCode = authService.getDepartmentCodeByIsAuth(AuthNameEnum.CONTRACT_STATISTICS);

        Map<String, Object> dateMap = StringCustomUtil.getDateMapByPeriodAndWeek(dateType, requestDate, locale);
        if (StringUtils.isEmpty(requestDate)) requestDate = StringCustomUtil.getToday();
        String startDate = (String) dateMap.get("startDate");
        String endDate = (String) dateMap.get("endDate");
        String chartYear = (String) dateMap.get("year");
        Integer week = (Integer) dateMap.get("week");


        String dCode = authService.getDepartmentCode();
        // 지점부터 노출시키도록 설정
        String defaultDepartmentCode = dCode;
        if (dCode.length() < MIN_DEPARTMENT_LENGTH) defaultDepartmentCode = DEFAULT_DEPARTMENT_LENGTH;

        // 부서 목록의 모든 통계 데이터 가공하여 반환
        StatisticsDto totalStatistics = statisticsCacheService.getTotalStatistics(startDate, endDate, DEPARTMENT_CODE_LIST_FOR_STATISTICS);
        model.addAttribute("totalStatistics", totalStatistics);

        // 목돈 그래프
        List<StatisticsByCriteriaDto> contractFortuneChartDataList = statisticsService.getChartOfContractFortune(dateType, chartYear, dCode);
        model.addAttribute("cfChartDataList", contractFortuneChartDataList);

        // 보험 그래프
        List<StatisticsByCriteriaDto> insuranceChartDataList = statisticsService.getChartOfInsurance(dateType, chartYear, dCode);
        model.addAttribute("iChartDataList", insuranceChartDataList);

        // 통계 데이터 조회
        StatisticsResultDto statistics = statisticsCacheService.getStatistics(startDate, endDate, dCode);

        // 영업 통계 데이터 조회
//        List<SalesManagerDto> statisticsList = statisticsCacheService.getTotalStatisticsByDepartmentCode(startDate, endDate, dCode, employeeCode, chartYear, week);
//        model.addAttribute("statisticsList", statisticsList);

        // 지점별 영업 합계 조회
        // StatisticsDto statisticsByTeamList = statisticsCacheService.getTotalStatisticsByTeam(startDate, endDate, dCode, employeeCode, chartYear, week);
        // model.addAttribute("statisticsByTeamList", statisticsByTeamList);

        // 본부, 지점, 팀, 담당자 리스트 select box 영역 세팅
        Map<String, Object> selectDepartmentMap = departmentSelectService.getSelectDepartment(dCode);

        // 검색 조건 리스트 조회
        List<ContractFortuneSearchCateEnum> searchCateList = ContractFortuneSearchCateEnum.getAllMeaning();
        model.addAttribute("searchCateList", searchCateList);

        // 이자구분 한글 명 세팅
        if (ContractFortuneSearchCateEnum.INTEREST_STATE.meaning.equals(searchKey))
            searchValue = InterestStateEnum.getMeaning(searchValue);

        // 리더권한의 사원이 담당자를 선택하지 않았을 경우 본인의 부서 코드로 세팅
        if (StringUtils.isEmpty(dCode) && StringUtils.isNotEmpty(leaderDepartmentCode))
            dCode = leaderDepartmentCode;

        // 본부, 지점, 팀, 담당자 리스트 select box 세팅
        model.addAttribute("selectDepartmentMap", selectDepartmentMap);
        model.addAttribute("departmentCode", dCode);
        model.addAttribute("employeeCode", employeeCode);

        // 목돈 계약 리스트
        model.addAttribute("statistics", statistics);

        // 검색
        model.addAttribute("searchValue", searchValue);
        model.addAttribute("searchKey", searchKey);
        model.addAttribute("startDate", startDate);
        model.addAttribute("endDate", endDate);

        // 처리 결과
        model.addAttribute("isSuccess", isSuccess);
        model.addAttribute("message", message);

        // 기간 조회 > 타입 번호 (1 = 월간, 2 = 주간)
        model.addAttribute("dateType", dateType);

        // 기간 조회 > 타입 선택 (월간 = monthly, 주간 = weekly, 둘다 = all)
        model.addAttribute("dateSearchType", DATE_SEARCH_TYPE);

        // 기간 조회 > 요청 날짜
        model.addAttribute("requestDate", requestDate);

        // 페이지 정보
        model.addAttribute("urlName", STATISTICS_NAME);    // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("title", STATISTICS_NAME);      // 타이틀 명
        return "statistics/d3";
    }
}
