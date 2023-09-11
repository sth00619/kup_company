package com.kupstudio.incompany.controller.contractStatus;

import com.kupstudio.incompany.cacheService.contranctStatus.ContractStatusCacheService;
import com.kupstudio.incompany.dto.contractStatus.ContractStatusDto;
import com.kupstudio.incompany.dto.contractStatus.TeamStatusDto;
import com.kupstudio.incompany.enumClass.AuthNameEnum;
import com.kupstudio.incompany.service.DepartmentSelectService;
import com.kupstudio.incompany.service.auth.AuthService;
import com.kupstudio.incompany.service.contractStatus.ContractStatusService;
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

import java.text.ParseException;
import java.util.List;
import java.util.Map;

@Slf4j
@Controller
@RequestMapping("contractStatus")
@RequiredArgsConstructor
public class ContractStatusController {

    private static final String CONTENT_NAME = "순위조회";
    private static final String IS_NOT_AUTH_MESSAGE = "권한이 없습니다. \n담당자에게 문의하세요.";
    private final ContractStatusCacheService contractStatusCacheService;
    private final ContractStatusService contractStatusService;
    private final DepartmentSelectService departmentSelectService;
    private final AuthService authService;

    /**
     * 계약현황 > 팀 순위
     * @param model
     * @param redirectAttributes
     * @param departmentCode
     * @param employeeCode
     * @param requestDate
     * @param dateType
     * @return
     * @throws ParseException
     */
    @GetMapping("teamStatusList")
    public String getTeamStatusList (Model model, RedirectAttributes redirectAttributes,
                                     @RequestParam(value = "departmentCode", required = false) String departmentCode,
                                     @RequestParam(value = "employeeCode", required = false) String employeeCode,
                                     @RequestParam(value = "requestDate", required = false) String requestDate,
                                     @RequestParam(value = "dateType", required = false) Integer dateType) throws ParseException {

        // 계약 통계 접근 권한 체크
        if (!authService.hasAuth(AuthNameEnum.CONTRACT_STATISTICS)) {
            redirectAttributes.addAttribute("isSuccess", false);
            redirectAttributes.addAttribute("message", IS_NOT_AUTH_MESSAGE);
            return "redirect:/contractFortune/contractFortune";
        }

        // 기간 조회 데이터
        Map<String, Object> dateMap = StringCustomUtil.getDateMapByPeriod(dateType, requestDate);
        if (StringUtils.isEmpty(requestDate)) requestDate = StringCustomUtil.getToday();
        String startDate = (String) dateMap.get("startDate");
        String endDate = (String) dateMap.get("endDate");
        dateType = 1;

        // 기간 조회 > 요청 날짜
        model.addAttribute("requestDate", requestDate);
        model.addAttribute("startDate", startDate);
        model.addAttribute("endDate", endDate);

        // 기간 조회 > 타입 번호 (1 = 월간, 2 = 주간)
        model.addAttribute("dateType", dateType);

        // 팀장 포함 리스트
        List<TeamStatusDto> teamStatusList = contractStatusService.getTeamStatusList(startDate, endDate, departmentCode, employeeCode);
        model.addAttribute("teamStatusList", teamStatusList);

        // 팀장 미포함 리스트
        List<TeamStatusDto> exTeamStatusList = contractStatusService.getExTeamStatusList(startDate, endDate, departmentCode, employeeCode);
        model.addAttribute("exTeamStatusList", exTeamStatusList);

        // 페이지 정보
        model.addAttribute("urlName", CONTENT_NAME);
        model.addAttribute("title", CONTENT_NAME);

        return "contractStatus/teamStatusList";
    }

    /**
     * 계약현황 > 관리자 순위
     * @param model
     * @param redirectAttributes
     * @param departmentCode
     * @param employeeCode
     * @param requestDate
     * @param dateType
     * @param orderBy
     * @return
     * @throws Exception
     */
    @GetMapping("statusList")
    public String getContractStatusList (Model model, RedirectAttributes redirectAttributes,
                                         @RequestParam(value = "departmentCode", required = false) String departmentCode,
                                         @RequestParam(value = "employeeCode", required = false) String employeeCode,
                                         @RequestParam(value = "requestDate", required = false) String requestDate,
                                         @RequestParam(value = "dateType", required = false) Integer dateType,
                                         @RequestParam(value = "orderBy", required = false) String orderBy) throws Exception {

        // 계약 통계 접근 권한 체크
        if (!authService.hasAuth(AuthNameEnum.CONTRACT_STATISTICS)) {
            redirectAttributes.addAttribute("isSuccess", false);
            redirectAttributes.addAttribute("message", IS_NOT_AUTH_MESSAGE);
            return "redirect:/contractFortune/contractFortune";
        }

        // 기간 조회 데이터
        Map<String, Object> dateMap = StringCustomUtil.getDateMapByPeriod(dateType, requestDate);
        if (StringUtils.isEmpty(requestDate)) requestDate = StringCustomUtil.getToday();
        String startDate = (String) dateMap.get("startDate");
        String endDate = (String) dateMap.get("endDate");
        dateType = 1;

        // 기간 조회 > 요청 날짜
        model.addAttribute("requestDate", requestDate);
        model.addAttribute("startDate", startDate);
        model.addAttribute("endDate", endDate);
        // 기간 조회 > 타입 번호 (1 = 월간, 2 = 주간)
        model.addAttribute("dateType", dateType);

        List<ContractStatusDto> contractStatusList =  contractStatusCacheService.getContractStatusList(startDate, endDate, departmentCode, employeeCode, orderBy);
        model.addAttribute("contractStatusList", contractStatusList);

        // 본부, 지점, 팀, 담당자 리스트 select box 영역 세팅
        Map<String, Object> selectDepartmentMap = departmentSelectService.getSelectDepartment(departmentCode);
        // 본부, 지점, 팀, 담당자 리스트 select box 세팅
        model.addAttribute("selectDepartmentMap", selectDepartmentMap);
        model.addAttribute("departmentCode", departmentCode);
        model.addAttribute("employeeCode", employeeCode);

        // 페이지 정보
        model.addAttribute("urlName", CONTENT_NAME);
        model.addAttribute("title", CONTENT_NAME);
        model.addAttribute("orderBy", orderBy);

        return "contractStatus/statusList";
    }

}