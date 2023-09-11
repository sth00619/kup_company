package com.kupstudio.incompany.controller.contractFortune;

import com.github.pagehelper.PageInfo;
import com.kupstudio.incompany.cacheService.employee.EmployeeCacheService;
import com.kupstudio.incompany.dto.EmployeeDto;
import com.kupstudio.incompany.dto.contractFortune.*;
import com.kupstudio.incompany.dto.partialSelectBox.PartialSelectBoxConditionDto;
import com.kupstudio.incompany.dto.potential.PotentialUserDto;
import com.kupstudio.incompany.enumClass.AuthNameEnum;
import com.kupstudio.incompany.enumClass.BankEnum;
import com.kupstudio.incompany.enumClass.contractFortune.ContractFortuneSearchCateEnum;
import com.kupstudio.incompany.enumClass.contractFortune.ContractFortuneStateEnum;
import com.kupstudio.incompany.enumClass.contractFortune.InterestStateEnum;
import com.kupstudio.incompany.enumClass.contractFortune.RepaymentTypeEnum;
import com.kupstudio.incompany.service.*;
import com.kupstudio.incompany.service.auth.AuthService;
import com.kupstudio.incompany.service.contractFortune.ContractFortuneService;
import com.kupstudio.incompany.service.partialSelectBox.PartialSelectBoxConditionService;
import com.kupstudio.incompany.service.potential.PotentialManageService;
import com.kupstudio.incompany.service.potential.PotentialUserService;
import com.kupstudio.incompany.util.PageInfoUtil;
import com.kupstudio.incompany.util.StringCustomUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RequestMapping(value = "/contractFortune")
@Controller
public class ContractFortuneController {

    private static final String UPDATE_CONTENT_NAME = "목돈 계약 수정";
    private static final String REPAYMENT_NAME = "목돈 상환 리스트";
    private static final String REAL_ESTATE_REPAYMENT_NAME = "부동산 상환 리스트";
    private static final String MONTHLY_INTEREST_NAME = "목돈 월 이자 리스트";
    private static final String INFO_CONTENT_NAME = "목돈 계약 상세 정보";
    private static final String ADD_CONTENT_NAME = "목돈 계약 추가";
    private static final String CONTENT_NAME = "목돈 계약 리스트";
    private static final String CHECK_CONTENT_NAME = "목돈 계약 확인";
    private static final String IS_NOT_AUTH_MESSAGE = "권한이 없습니다. \n담당자에게 문의하세요.";
    private static final String IS_NOT_PRIVATE_AUTH_MESSAGE = "비공개 계약 관리 권한이 없습니다. \n담당자에게 문의하세요.";
    private static final String FAIL_MESSAGE = "처리 실패하였습니다.";

    // 화면에 노출시킬 리스트 개수 (페이지 개수x)
    private final int COUNT_PER_PAGE = 10;
    private final String DEFAULT_PAGE_STR = "1";

    // 계약확인 여부
    private final String CHECK_CONTRACT_Y = "Y";
    private final String CHECK_CONTRACT_N = "N";

    // 기간 조회 타입 (월간 = monthly, 주간 = weekly, 둘다 = all)
    private final String MONTHLY_SEARCH_TYPE = "monthly";

    // 0 = 근무자, 1 = 퇴사자, 2 = 전체 조회
    private final Integer RESIGN_NUM = 2;

    private final int SALE_DEPARTMENT_LENGTH = 5;

    @Autowired
    private ContractFortuneService contractFortuneService;

    @Autowired
    private DepartmentService departmentService;

    @Autowired
    private CompanyPositionService companyPositionService;

    @Autowired
    private PotentialManageService potentialManageService;

    @Autowired
    private PotentialUserService potentialUserService;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private DepartmentSelectService departmentSelectService;

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    @Autowired
    private EmployeeCacheService employeeCacheService;

    @Autowired
    private PartialSelectBoxConditionService partialSelectBoxConditionService;


    @GetMapping("/contractFortune")
    public String contractFortune(@RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum, @RequestParam(value = "departmentCode", required = false) String departmentCode, @RequestParam(value = "employeeCode", required = false) String employeeCode, @RequestParam(value = "searchValue", required = false) String searchValue, @RequestParam(value = "searchKey", required = false) String searchKey, @RequestParam(value = "startDate", required = false) String startDate, @RequestParam(value = "endDate", required = false) String endDate, @RequestParam(value = "isSuccess", required = false) Boolean isSuccess, @RequestParam(value = "message", required = false) String message, @RequestParam(value = "orderBy", required = false) String orderBy, Model model, RedirectAttributes reAttr) throws Exception {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String employeeLoginCode = auth.getName();

        if (authService.hasAuth(AuthNameEnum.PARTIAL_SELECT_BOX)) {
            PartialSelectBoxConditionDto partialSelectBoxConditionDto = partialSelectBoxConditionService.getPartialSelectBoxCondition(employeeLoginCode);
            model.addAttribute("partialSelectBoxCondition", partialSelectBoxConditionDto);

            if (!ObjectUtils.isEmpty(partialSelectBoxConditionDto) && !CollectionUtils.isEmpty(partialSelectBoxConditionDto.getPartDepartmentInfoList())) {
                Optional<String> optionalDepartmentCode = Optional.ofNullable(departmentCode);
                departmentCode = optionalDepartmentCode.orElse(partialSelectBoxConditionDto.getPartDepartmentInfoList().get(0).getDepartmentCode());


            }


            if (!partialSelectBoxConditionDto.getPartDepartmentCodes().contains(departmentCode.substring(0, SALE_DEPARTMENT_LENGTH))) {

                reAttr.addAttribute("isSuccess", false);
                reAttr.addAttribute("message", IS_NOT_AUTH_MESSAGE);
                return "redirect:/contractFortune/contractFortune";
            }


        }

        // 로그인한 사원에게 CONTRACT_LEADER 권한이 있을 경우 리더 부서 코드 세팅
        String leaderDepartmentCode = authService.getDepartmentCodeByIsAuth(AuthNameEnum.CONTRACT_LEADER);

        // 목돈 리스트 조회
        PageInfo<ContractFortuneDto> contractFortuneList;

        contractFortuneList = PageInfo.of(contractFortuneService.getContractFortuneList(startDate, endDate, CHECK_CONTRACT_Y, pageNum, searchKey, searchValue, departmentCode, employeeCode, COUNT_PER_PAGE, orderBy), COUNT_PER_PAGE);

        // 본부, 지점, 팀, 담당자 리스트 select box 영역 세팅
        Map<String, Object> selectDepartmentMap = departmentSelectService.getSelectDepartment(departmentCode, RESIGN_NUM);

        // 검색 조건 리스트 조회
        List<ContractFortuneSearchCateEnum> searchCateList = ContractFortuneSearchCateEnum.getAllMeaning();
        model.addAttribute("searchCateList", searchCateList);

        // 리더권한의 사원이 담당자를 선택하지 않았을 경우 본인의 부서 코드로 세팅
        if (StringUtils.isEmpty(departmentCode) && StringUtils.isNotEmpty(leaderDepartmentCode))
            departmentCode = leaderDepartmentCode;

        // 이자구분 한글 명 세팅
        if (ContractFortuneSearchCateEnum.INTEREST_STATE.meaning.equals(searchKey)) {
            model.addAttribute("searchMean", InterestStateEnum.getMeaning(searchValue));
        }

        /* 페이징 start, end 세팅 */
        contractFortuneList = PageInfoUtil.setPageNation(contractFortuneList, pageNum, COUNT_PER_PAGE);

        // 본부, 지점, 팀, 담당자 리스트 select box 세팅
        model.addAttribute("selectDepartmentMap", selectDepartmentMap);
        model.addAttribute("departmentCode", departmentCode);
        model.addAttribute("employeeCode", employeeCode);

        // 계약 현황 관련 사원코드 (선택한 담당자가 없을 때 본인의 계약 현황 조회)
        model.addAttribute("reportEmployeeCode", authService.getEmployeeCode());

        // 목돈 계약 리스트
        model.addAttribute("contractFortuneList", contractFortuneList);

        // 페이징에서 사용할 리스트 세팅
        model.addAttribute("pageList", contractFortuneList);
        model.addAttribute("pageNum", pageNum);


        // 검색
        model.addAttribute("searchValue", searchValue);
        model.addAttribute("searchKey", searchKey);
        model.addAttribute("startDate", startDate);
        model.addAttribute("endDate", endDate);

        model.addAttribute("orderBy", orderBy);

        // 처리 결과
        model.addAttribute("isSuccess", isSuccess);
        model.addAttribute("message", message);

        // 페이지 정보
        model.addAttribute("urlName", CONTENT_NAME);    // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("title", CONTENT_NAME);      // 타이틀 명


        return "contractFortune/contractFortune";
    }

    /**
     * 비공개 계약 리스트
     *
     * @param pageNum
     * @param departmentCode
     * @param employeeCode
     * @param searchValue
     * @param searchKey
     * @param startDate
     * @param endDate
     * @param isSuccess
     * @param message
     * @param orderBy
     * @param model
     * @return
     * @throws Exception
     */
    @GetMapping("/privateContractFortune")
    public String privateContractFortune(@RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum, @RequestParam(value = "departmentCode", required = false) String departmentCode, @RequestParam(value = "employeeCode", required = false) String employeeCode, @RequestParam(value = "searchValue", required = false) String searchValue, @RequestParam(value = "searchKey", required = false) String searchKey, @RequestParam(value = "startDate", required = false) String startDate, @RequestParam(value = "endDate", required = false) String endDate, @RequestParam(value = "isSuccess", required = false) Boolean isSuccess, @RequestParam(value = "message", required = false) String message, @RequestParam(value = "orderBy", required = false) String orderBy, Model model, RedirectAttributes reAttr) throws Exception {

        if (!authService.hasAuth(AuthNameEnum.CONTRACT_PRIVATE)) {
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", IS_NOT_PRIVATE_AUTH_MESSAGE);
            return "redirect:/contractFortune/contractFortune";
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String employeeLoginCode = auth.getName();

        // 전체권한 없을경우 본인 아이디로 셋팅
        if (!authService.hasAuth(AuthNameEnum.CONTRACT_PRIVATE_ALL)) {
            employeeCode = employeeLoginCode;
            departmentCode = StringUtils.EMPTY;
        }

        // 총무인데 부분만 리스트 조회만되는 경우
        if (authService.hasAuth(AuthNameEnum.PARTIAL_SELECT_BOX)) {
            PartialSelectBoxConditionDto partialSelectBoxConditionDto = partialSelectBoxConditionService.getPartialSelectBoxCondition(employeeLoginCode);
            model.addAttribute("partialSelectBoxCondition", partialSelectBoxConditionDto);

            if (!ObjectUtils.isEmpty(partialSelectBoxConditionDto) && !CollectionUtils.isEmpty(partialSelectBoxConditionDto.getPartDepartmentInfoList())) {
                Optional<String> optionalDepartmentCode = Optional.ofNullable(departmentCode);
                departmentCode = optionalDepartmentCode.orElse(partialSelectBoxConditionDto.getPartDepartmentInfoList().get(0).getDepartmentCode());


            }
            if (!partialSelectBoxConditionDto.getPartDepartmentCodes().contains(departmentCode.substring(0, SALE_DEPARTMENT_LENGTH))) {

                reAttr.addAttribute("isSuccess", false);
                reAttr.addAttribute("message", IS_NOT_AUTH_MESSAGE);
                return "redirect:/contractFortune/privateContractFortune";
            }
        }


        // 로그인한 사원에게 CONTRACT_LEADER 권한이 있을 경우 리더 부서 코드 세팅
        String leaderDepartmentCode = authService.getDepartmentCodeByIsAuth(AuthNameEnum.CONTRACT_LEADER);

        // 목돈 리스트 조회
        PageInfo<ContractFortuneDto> contractFortuneList;

        contractFortuneList = PageInfo.of(contractFortuneService.getPrivateContractFortuneList(startDate, endDate, CHECK_CONTRACT_Y, pageNum, searchKey, searchValue, departmentCode, employeeCode, COUNT_PER_PAGE, orderBy), COUNT_PER_PAGE);

        // 본부, 지점, 팀, 담당자 리스트 select box 영역 세팅
        Map<String, Object> selectDepartmentMap = departmentSelectService.getSelectDepartment(departmentCode, RESIGN_NUM);

        // 검색 조건 리스트 조회
        List<ContractFortuneSearchCateEnum> searchCateList = ContractFortuneSearchCateEnum.getAllMeaning();
        model.addAttribute("searchCateList", searchCateList);

        // 이자구분 한글 명 세팅
        if (ContractFortuneSearchCateEnum.INTEREST_STATE.meaning.equals(searchKey))
            searchValue = InterestStateEnum.getMeaning(searchValue);

        // 리더권한의 사원이 담당자를 선택하지 않았을 경우 본인의 부서 코드로 세팅
        if (StringUtils.isEmpty(departmentCode) && StringUtils.isNotEmpty(leaderDepartmentCode))
            departmentCode = leaderDepartmentCode;

        /* 페이징 start, end 세팅 */
        contractFortuneList = PageInfoUtil.setPageNation(contractFortuneList, pageNum, COUNT_PER_PAGE);

        // 본부, 지점, 팀, 담당자 리스트 select box 세팅
        model.addAttribute("selectDepartmentMap", selectDepartmentMap);
        model.addAttribute("departmentCode", departmentCode);
        model.addAttribute("employeeCode", employeeCode);

        // 계약 현황 관련 사원코드 (선택한 담당자가 없을 때 본인의 계약 현황 조회)
        model.addAttribute("reportEmployeeCode", authService.getEmployeeCode());

        // 목돈 계약 리스트
        model.addAttribute("contractFortuneList", contractFortuneList);

        // 페이징에서 사용할 리스트 세팅
        model.addAttribute("pageList", contractFortuneList);
        model.addAttribute("pageNum", pageNum);

        // 검색
        model.addAttribute("searchValue", searchValue);
        model.addAttribute("searchKey", searchKey);
        model.addAttribute("startDate", startDate);
        model.addAttribute("endDate", endDate);

        model.addAttribute("orderBy", orderBy);

        // 처리 결과
        model.addAttribute("isSuccess", isSuccess);
        model.addAttribute("message", message);

        // 페이지 정보
        model.addAttribute("urlName", CONTENT_NAME);    // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("title", CONTENT_NAME);      // 타이틀 명


        return "contractFortune/privateContractFortune";
    }

    /**
     * 상환 리스트
     *
     * @param departmentCode
     * @param employeeCode
     * @param requestDate
     * @param dateType
     * @param message
     * @param model
     * @return
     * @throws Exception
     */
    @GetMapping("/repaymentContractFortune")
    public String repaymentContractFortune(@RequestParam(value = "departmentCode", required = false) String departmentCode, @RequestParam(value = "employeeCode", required = false) String employeeCode, @RequestParam(value = "requestDate", required = false) String requestDate, @RequestParam(value = "dateType", required = false) Integer dateType, @RequestParam(value = "message", required = false) String message, Model model) throws Exception {
        // 로그인한 사원에게 CONTRACT_LEADER 권한이 있을 경우 리더 부서 코드 세팅
        String leaderDepartmentCode = authService.getDepartmentCodeByIsAuth(AuthNameEnum.CONTRACT_LEADER);

        Map<String, Object> dateMap = StringCustomUtil.getDateMapByPeriod(dateType, requestDate);
        requestDate = StringUtils.isEmpty(requestDate) ? StringCustomUtil.getLastDateOfThisMonth() : StringCustomUtil.getLastDateOfMonth(requestDate);

        String startDate = (String) dateMap.get("startDate");
        String endDate = (String) dateMap.get("endDate");
        dateType = (int) dateMap.get("dateType");

        // 상환일 세팅
        String repaymentDate = endDate;
        ContractRepaymentDateDto contractRepaymentDate = contractFortuneService.getContractRepaymentDate(requestDate);
        if (contractRepaymentDate != null) repaymentDate = contractRepaymentDate.getRepaymentDate();

        boolean isRealEstate = false;

        // 목돈 리스트 조회
        List<ContractFortuneDto> contractFortuneList = contractFortuneService.getRepaymentList(startDate, endDate, CHECK_CONTRACT_Y, departmentCode, employeeCode, isRealEstate);

        // 본부, 지점, 팀, 담당자 리스트 select box 영역 세팅
        Map<String, Object> selectDepartmentMap = departmentSelectService.getSelectDepartment(departmentCode);

        // 리더권한의 사원이 담당자를 선택하지 않았을 경우 본인의 부서 코드로 세팅
        if (StringUtils.isEmpty(departmentCode) && StringUtils.isNotEmpty(leaderDepartmentCode))
            departmentCode = leaderDepartmentCode;

        // 계약확인(상환,증액,특이사항)이넘 리스트
        List<RepaymentTypeEnum> repaymentTypeEnumList = RepaymentTypeEnum.getRepaymentTypeEnumList();
        model.addAttribute("repaymentTypeEnumList", repaymentTypeEnumList);

        // 본부, 지점, 팀, 담당자 리스트 select box 세팅
        model.addAttribute("selectDepartmentMap", selectDepartmentMap);
        model.addAttribute("departmentCode", departmentCode);
        model.addAttribute("employeeCode", employeeCode);

        // 목돈 계약 리스트
        model.addAttribute("contractFortuneList", contractFortuneList);

        model.addAttribute("startDate", startDate);
        model.addAttribute("endDate", endDate);

        // 처리 결과
        model.addAttribute("message", message);

        // 기간 조회 > 타입 번호 (1 = 월간, 2 = 주간)
        model.addAttribute("dateType", dateType);

        // 기간 조회 > 타입 선택 (월간 = monthly, 주간 = weekly, 둘다 = all)
        model.addAttribute("dateSearchType", MONTHLY_SEARCH_TYPE);

        // 기간 조회 > 요청 날짜
        model.addAttribute("requestDate", requestDate);

        // 상환일
        model.addAttribute("repaymentDate", repaymentDate);

        // 페이지 정보
        model.addAttribute("urlName", REPAYMENT_NAME);    // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("title", REPAYMENT_NAME);      // 타이틀 명
        return "contractFortune/repaymentContractFortune";
    }

    /**
     * 부동산 상환 리스트
     *
     * @param departmentCode
     * @param employeeCode
     * @param requestDate
     * @param dateType
     * @param message
     * @param model
     * @return
     * @throws Exception
     */
    @GetMapping("/repaymentRealEstateContractFortune")
    public String repaymentRealEstateContractFortune(@RequestParam(value = "departmentCode", required = false) String departmentCode,
                                                     @RequestParam(value = "employeeCode", required = false) String employeeCode,
                                                     @RequestParam(value = "requestDate", required = false) String requestDate,
                                                     @RequestParam(value = "dateType", required = false) Integer dateType,
                                                     @RequestParam(value = "message", required = false) String message,
                                                     Model model) throws Exception {

        // 로그인한 사원에게 CONTRACT_LEADER 권한이 있을 경우 리더 부서 코드 세팅
        String leaderDepartmentCode = authService.getDepartmentCodeByIsAuth(AuthNameEnum.CONTRACT_LEADER);

        Map<String, Object> dateMap = StringCustomUtil.getDateMapByPeriod(dateType, requestDate);
        requestDate = StringUtils.isEmpty(requestDate) ? StringCustomUtil.getLastDateOfThisMonth() : StringCustomUtil.getLastDateOfMonth(requestDate);

        String startDate = (String) dateMap.get("startDate");
        String endDate = (String) dateMap.get("endDate");
        dateType = (int) dateMap.get("dateType");

        // 상환일 세팅
        String repaymentDate = endDate;
        ContractRepaymentDateDto contractRepaymentDate = contractFortuneService.getContractRepaymentDate(requestDate);
        if (contractRepaymentDate != null) repaymentDate = contractRepaymentDate.getRepaymentDate();

        boolean isRealEstate = true;

        // 목돈 리스트 조회
        List<ContractFortuneDto> contractFortuneList = contractFortuneService.getRepaymentList(startDate, endDate, CHECK_CONTRACT_Y, departmentCode, employeeCode, isRealEstate);

        // 본부, 지점, 팀, 담당자 리스트 select box 영역 세팅
        Map<String, Object> selectDepartmentMap = departmentSelectService.getSelectDepartment(departmentCode);

        // 리더권한의 사원이 담당자를 선택하지 않았을 경우 본인의 부서 코드로 세팅
        if (StringUtils.isEmpty(departmentCode) && StringUtils.isNotEmpty(leaderDepartmentCode))
            departmentCode = leaderDepartmentCode;

        // 계약확인(상환,증액,특이사항)이넘 리스트
        List<RepaymentTypeEnum> repaymentTypeEnumList = RepaymentTypeEnum.getRepaymentTypeEnumList();
        model.addAttribute("repaymentTypeEnumList", repaymentTypeEnumList);

        // 본부, 지점, 팀, 담당자 리스트 select box 세팅
        model.addAttribute("selectDepartmentMap", selectDepartmentMap);
        model.addAttribute("departmentCode", departmentCode);
        model.addAttribute("employeeCode", employeeCode);

        // 목돈 계약 리스트
        model.addAttribute("contractFortuneList", contractFortuneList);

        model.addAttribute("startDate", startDate);
        model.addAttribute("endDate", endDate);

        // 처리 결과
        model.addAttribute("message", message);

        // 기간 조회 > 타입 번호 (1 = 월간, 2 = 주간)
        model.addAttribute("dateType", dateType);

        // 기간 조회 > 타입 선택 (월간 = monthly, 주간 = weekly, 둘다 = all)
        model.addAttribute("dateSearchType", MONTHLY_SEARCH_TYPE);

        // 기간 조회 > 요청 날짜
        model.addAttribute("requestDate", requestDate);

        // 상환일
        model.addAttribute("repaymentDate", repaymentDate);

        // 페이지 정보
        model.addAttribute("urlName", REAL_ESTATE_REPAYMENT_NAME);    // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("title", REAL_ESTATE_REPAYMENT_NAME);      // 타이틀 명
        return "contractFortune/repaymentRealEstateContractFortune";
    }

    /**
     * 목돈 월 이자 리스트 조회
     *
     * @param pageNum
     * @param departmentCode
     * @param employeeCode
     * @param requestDate
     * @param dateType
     * @param model
     * @return
     * @throws Exception
     */
    @GetMapping("/monthlyInterestContractFortune")
    public String monthlyInterestContractFortune(@RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum, @RequestParam(value = "departmentCode", required = false) String departmentCode, @RequestParam(value = "employeeCode", required = false) String employeeCode, @RequestParam(value = "requestDate", required = false) String requestDate, @RequestParam(value = "dateType", required = false) Integer dateType, Model model) throws Exception {

        // 로그인한 사원에게 CONTRACT_LEADER 권한이 있을 경우 리더 부서 코드 세팅
        String leaderDepartmentCode = authService.getDepartmentCodeByIsAuth(AuthNameEnum.CONTRACT_LEADER);

        // 날짜 세팅
        Map<String, Object> dateMap = StringCustomUtil.getDateMapByPeriod(dateType, requestDate);
        if (StringUtils.isEmpty(requestDate)) requestDate = StringCustomUtil.getToday();
        String startDate = StringCustomUtil.getFirstDateOfMonth(requestDate);
        String endDate = StringCustomUtil.getLastDateOfThisMonth();
        dateType = (int) dateMap.get("dateType");

        int dateDiff = StringCustomUtil.getMonthDiff(startDate, endDate);

        if (dateDiff > 12) {
            startDate = StringCustomUtil.dateMinus(endDate, -1, 0, 0);
        }

        // 목돈 월 이자 리스트 조회
        PageInfo<ContractFortuneDto> contractFortuneList;
        contractFortuneList = PageInfo.of(contractFortuneService.getMonthlyInterestContractFortuneList(startDate, endDate, CHECK_CONTRACT_Y, pageNum, null, null, departmentCode, employeeCode, COUNT_PER_PAGE), COUNT_PER_PAGE);

        // 계약 별 납입 정보 세팅
        contractFortuneService.setPaymentCheck(contractFortuneList.getList());

        // 본부, 지점, 팀, 담당자 리스트 select box 영역 세팅
        Map<String, Object> selectDepartmentMap = departmentSelectService.getSelectDepartment(departmentCode);

        // 리더권한의 사원이 담당자를 선택하지 않았을 경우 본인의 부서 코드로 세팅
        if (StringUtils.isEmpty(departmentCode) && StringUtils.isNotEmpty(leaderDepartmentCode))
            departmentCode = leaderDepartmentCode;

        /* 페이징 start, end 세팅 */
        contractFortuneList = PageInfoUtil.setPageNation(contractFortuneList, pageNum, COUNT_PER_PAGE);

        // 본부, 지점, 팀, 담당자 리스트 select box 세팅
        model.addAttribute("selectDepartmentMap", selectDepartmentMap);
        model.addAttribute("departmentCode", departmentCode);
        model.addAttribute("employeeCode", employeeCode);

        // 목돈 계약 리스트
        model.addAttribute("contractFortuneList", contractFortuneList);

        // 페이징에서 사용할 리스트 세팅
        model.addAttribute("pageList", contractFortuneList);
        model.addAttribute("pageNum", pageNum);

        model.addAttribute("startDate", startDate);
        model.addAttribute("endDate", endDate);

        // 기간 조회 > 타입 번호 (1 = 월간, 2 = 주간)
        model.addAttribute("dateType", dateType);

        // 기간 조회 > 타입 선택 (월간 = monthly, 주간 = weekly, 둘다 = all)
        model.addAttribute("dateSearchType", MONTHLY_SEARCH_TYPE);

        // 기간 조회 > 요청 날짜
        model.addAttribute("requestDate", requestDate);

        // 페이지 정보
        model.addAttribute("urlName", MONTHLY_INTEREST_NAME);    // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("title", MONTHLY_INTEREST_NAME);      // 타이틀 명
        return "contractFortune/monthlyInterestContractFortune";
    }

    /**
     * 계약 확인 리스트
     *
     * @param pageNum
     * @param departmentCode
     * @param employeeCode
     * @param searchValue
     * @param searchKey
     * @param startDate
     * @param endDate
     * @param isSuccess
     * @param message
     * @param model
     * @return
     */
    @GetMapping("/checkContractFortune")
    public String checkContractFortune(@RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum, @RequestParam(value = "departmentCode", required = false) String departmentCode, @RequestParam(value = "employeeCode", required = false) String employeeCode, @RequestParam(value = "searchValue", required = false) String searchValue, @RequestParam(value = "searchKey", required = false) String searchKey, @RequestParam(value = "startDate", required = false) String startDate, @RequestParam(value = "endDate", required = false) String endDate, @RequestParam(value = "isSuccess", required = false) Boolean isSuccess, @RequestParam(value = "message", required = false) String message, Model model, RedirectAttributes reAttr) throws Exception {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String employeeLoginCode = auth.getName();

        // 총무인데 부분만 리스트 조회만되는 경우
        if (authService.hasAuth(AuthNameEnum.PARTIAL_SELECT_BOX)) {
            PartialSelectBoxConditionDto partialSelectBoxConditionDto = partialSelectBoxConditionService.getPartialSelectBoxCondition(employeeLoginCode);
            model.addAttribute("partialSelectBoxCondition", partialSelectBoxConditionDto);

            if (!ObjectUtils.isEmpty(partialSelectBoxConditionDto) && !CollectionUtils.isEmpty(partialSelectBoxConditionDto.getPartDepartmentInfoList())) {
                Optional<String> optionalDepartmentCode = Optional.ofNullable(departmentCode);
                departmentCode = optionalDepartmentCode.orElse(partialSelectBoxConditionDto.getPartDepartmentInfoList().get(0).getDepartmentCode());


            }

            if (!partialSelectBoxConditionDto.getPartDepartmentCodes().contains(departmentCode.substring(0, SALE_DEPARTMENT_LENGTH))) {

                reAttr.addAttribute("isSuccess", false);
                reAttr.addAttribute("message", IS_NOT_AUTH_MESSAGE);
                return "redirect:/contractFortune/checkContractFortune";
            }

        }

        // 로그인한 사원에게 CONTRACT_LEADER 권한이 있을 경우 리더 부서 코드 세팅
        String leaderDepartmentCode = authService.getDepartmentCodeByIsAuth(AuthNameEnum.CONTRACT_LEADER);

        // 목돈 리스트 조회
        PageInfo<ContractFortuneDto> contractFortuneList;
        contractFortuneList = PageInfo.of(contractFortuneService.getContractFortuneList(startDate, endDate, CHECK_CONTRACT_N, pageNum, searchKey, searchValue, departmentCode, employeeCode, COUNT_PER_PAGE, null), COUNT_PER_PAGE);

        // 본부, 지점, 팀, 담당자 리스트 select box 영역 세팅
        Map<String, Object> selectDepartmentMap = departmentSelectService.getSelectDepartment(departmentCode, RESIGN_NUM);

        // 리더권한의 사원이 담당자를 선택하지 않았을 경우 본인의 부서 코드로 세팅
        if (StringUtils.isEmpty(departmentCode) && StringUtils.isNotEmpty(leaderDepartmentCode))
            departmentCode = leaderDepartmentCode;

        // 검색 조건 리스트 조회
        List<ContractFortuneSearchCateEnum> searchCateList = ContractFortuneSearchCateEnum.getAllMeaning();
        model.addAttribute("searchCateList", searchCateList);

        // 이자구분 한글 명 세팅
        if (ContractFortuneSearchCateEnum.INTEREST_STATE.meaning.equals(searchKey)) {
            searchValue = InterestStateEnum.getMeaning(searchValue);
        }

        /* 페이징 start, end 세팅 */
        contractFortuneList = PageInfoUtil.setPageNation(contractFortuneList, pageNum, COUNT_PER_PAGE);

        // 본부, 지점, 팀, 담당자 리스트 select box 영역 세팅
        model.addAttribute("selectDepartmentMap", selectDepartmentMap);
        model.addAttribute("departmentCode", departmentCode);
        model.addAttribute("employeeCode", employeeCode);

        // 목돈 계약 리스트
        model.addAttribute("contractFortuneList", contractFortuneList);

        // 페이징에서 사용할 리스트 세팅
        model.addAttribute("pageList", contractFortuneList);
        model.addAttribute("pageNum", pageNum);

        // 검색
        model.addAttribute("searchValue", searchValue);
        model.addAttribute("searchKey", searchKey);
        model.addAttribute("startDate", startDate);
        model.addAttribute("endDate", endDate);

        model.addAttribute("loginEmployeeCode", authService.getEmployeeCode());

        // 처리 결과
        model.addAttribute("isSuccess", isSuccess);
        model.addAttribute("message", message);

        // 페이지 정보
        model.addAttribute("urlName", CHECK_CONTENT_NAME);    // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("title", CHECK_CONTENT_NAME);      // 타이틀 명
        return "contractFortune/checkContractFortune";
    }

    /**
     * 목돈 계약 이관
     */
    @GetMapping("/transferEmployeeContract")
    public String transferEmployeeContract(@RequestParam(value = "pageNum", required = false, defaultValue = "1") int pageNum, @RequestParam(value = "transferEmployeeCode") String transferEmployeeCode, @RequestParam(value = "contractCodeList") List<Integer> contractCodeList, @RequestParam(value = "departmentCode", required = false) String selectDepartmentCode, @RequestParam(value = "selectEmployeeCode", required = false) String selectEmployeeCode, @RequestParam(value = "searchValue", required = false) String searchValue, @RequestParam(value = "searchKey", required = false) String searchKey, @RequestParam(value = "startDate", required = false) String startDate, @RequestParam(value = "endDate", required = false) String endDate, RedirectAttributes reAttr) {
        boolean isSuccess;
        String message = null;

        if (authService.hasAuth(AuthNameEnum.CONTRACT_TRANSFER)) {
            try {
                contractFortuneService.transferEmployeeContract(contractCodeList, transferEmployeeCode);
                isSuccess = true;
            } catch (Exception e) {
                isSuccess = false;
                message = FAIL_MESSAGE + " \n " + e.getMessage();
            }
        } else {
            isSuccess = false;
            message = IS_NOT_AUTH_MESSAGE;
        }
        reAttr.addAttribute("isSuccess", isSuccess);
        reAttr.addAttribute("message", message);
        reAttr.addAttribute("searchValue", searchValue);
        reAttr.addAttribute("searchKey", searchKey);
        reAttr.addAttribute("startDate", startDate);
        reAttr.addAttribute("endDate", endDate);
        reAttr.addAttribute("pageNum", pageNum);
        reAttr.addAttribute("departmentCode", selectDepartmentCode);
        reAttr.addAttribute("employeeCode", selectEmployeeCode);

        return "redirect:/contractFortune/contractFortune";
    }

    /**
     * 목돈 계약 추가 화면 이동
     *
     * @param potentialUserNo
     * @param model
     * @return
     */
    @GetMapping("/addContractFortune")
    public String addContractFortune(@RequestParam(value = "potentialUserNo", required = false) Integer potentialUserNo, @RequestParam(value = "isSuccess", required = false) Boolean isSuccess, @RequestParam(value = "message", required = false) String message, @RequestParam(value = "departmentCode", required = false) String departmentCode, @RequestParam(value = "employeeCode", required = false) String employeeCode, @RequestParam(value = "contractCode", required = false) Integer contractCode, @RequestParam(value = "isPublic", defaultValue = "true") boolean isPublic, @RequestParam(value = "contractState", required = false) Integer contractState, Model model, RedirectAttributes reAttr) throws Exception {

        // 총무만 가능 + FA 사원 전체(상급자, 일반 사원) 가능
        if (!authService.hasAuth(AuthNameEnum.CONTRACT_MANAGER) &&
                !(authService.hasAuth(AuthNameEnum.CONTRACT_MANAGER) && authService.hasAuth(AuthNameEnum.FA_COMPANY)) &&
                !authService.hasAuth(AuthNameEnum.FA_COMPANY)) {
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", IS_NOT_AUTH_MESSAGE);
            return "redirect:/contractFortune/contractFortune";
        }

        model.addAttribute("departmentCode", departmentCode);
        model.addAttribute("employeeCode", employeeCode);

        // 목돈 계약 정보 by contractCode
        List<ContractFortuneDto> contractFortuneList = new ArrayList<>();
        ContractFortuneDto contractFortuneDto = new ContractFortuneDto();
        if (contractCode != null) {
            contractFortuneDto = contractFortuneService.getContractFortune(contractCode, isPublic);
            if (contractFortuneDto != null)
                contractFortuneList = contractFortuneService.getContractFortuneInfoList(contractFortuneDto, isPublic);
        }


        model.addAttribute("contractFortuneDto", contractFortuneDto);
        model.addAttribute("contractFortuneList", contractFortuneList);
        model.addAttribute("contractState", contractState);
        model.addAttribute("isPublic", isPublic);

        // 담당자 정보
        EmployeeDto employeeDto = new EmployeeDto();
        if (StringUtils.isNotEmpty(employeeCode))
            employeeDto = employeeService.getEmployeeInfoForAddContract(employeeCode, null);
        model.addAttribute("employeeDto", employeeDto);

        // 담당자 검색 리스트
        List<EmployeeDto> allEmployeeList = employeeCacheService.getEmployeeByWorkingStatus(0);
        employeeService.setDepartmentNameByDepthForEmployeeInfo(allEmployeeList);
        model.addAttribute("allEmployee", allEmployeeList);

        // 계약 구분 리스트
        List<ContractFortuneStateEnum> contractStateEnumList = ContractFortuneStateEnum.getAllStateEnum();
        model.addAttribute("contractStateEnumList", contractStateEnumList);

        /*입력받은 사원코드의 잠재고객 리스트 가져오기*/
        List<PotentialUserDto> potentialUserList = potentialUserService.getPotentialUserListByEmployeeCode(employeeCode);
        model.addAttribute("potentialUserList", potentialUserList);

        // 고객 코드
        if (potentialUserNo != null) model.addAttribute("potentialUserNo", potentialUserNo);

        // 은행 리스트
        List<BankEnum> bankEnumList = BankEnum.getBankEnumList();
        model.addAttribute("bankEnumList", bankEnumList);

        // 처리 결과
        model.addAttribute("isSuccess", isSuccess);
        model.addAttribute("message", message);

        // 페이지 정보
        model.addAttribute("urlName", ADD_CONTENT_NAME);    // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("title", ADD_CONTENT_NAME);      // 타이틀 명
        return "contractFortune/addContractFortune";
    }

    /**
     * 목돈 계약 추가 처리
     *
     * @param contractFortuneDto
     * @param reAttr
     * @return
     */
    @PostMapping("/addContractFortune")
    public String addContractFortune(@ModelAttribute(value = "contractFortuneDto") ContractFortuneDto contractFortuneDto, RedirectAttributes reAttr) throws Exception {

        // 총무만 가능
        if (!authService.hasAuth(AuthNameEnum.CONTRACT_MANAGER) && !authService.hasAuth(AuthNameEnum.FA_COMPANY)) {
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", IS_NOT_AUTH_MESSAGE);
            return "redirect:/contractFortune/contractFortune";
        }

        Integer contractCode = contractFortuneService.addContractFortune(contractFortuneDto);
        boolean isPublic = contractFortuneDto.getIsPublic().equals("true");
        if (contractCode != null) {
            // 비공개 조회 권한이 없을 경우 목돈 계약 리스트로 이동
            if (!isPublic && !authService.hasAuth(AuthNameEnum.CONTRACT_PRIVATE))
                return "redirect:/contractFortune/contractFortune";

            return "redirect:/contractFortune/contractFortuneInfo?contractCode=" + contractCode + "&isPublic=" + isPublic;
        }

        reAttr.addAttribute("isSuccess", false);
        reAttr.addAttribute("message", FAIL_MESSAGE);
        return "redirect:/contractFortune/addContractFortune";
    }

    /**
     * 목돈 계약 상세 정보 보기
     *
     * @param model
     * @param contractCode
     * @return
     */
    @GetMapping("/contractFortuneInfo")
    public String contractFortuneInfo(Model model, RedirectAttributes reAttr, @RequestParam(value = "contractCode", required = false) Integer contractCode, @RequestParam(value = "isPublic", defaultValue = "true") boolean isPublic) throws Exception {

        if (!isPublic && !authService.hasAuth(AuthNameEnum.CONTRACT_PRIVATE)) {
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", IS_NOT_PRIVATE_AUTH_MESSAGE);
            return "redirect:/contractFortune/contractFortune";
        }

        // 목돈 계약 정보 by contractCode
        ContractFortuneDto contractFortuneDto = contractFortuneService.getContractFortune(contractCode, isPublic);
        if (contractFortuneDto == null) {
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", FAIL_MESSAGE);
            return "redirect:/contractFortune/contractFortune";
        }

        List<ContractFortuneDto> contractFortuneList = contractFortuneService.getContractFortuneInfoList(contractFortuneDto, isPublic);
        model.addAttribute("contractFortuneDto", contractFortuneDto);
        model.addAttribute("contractFortuneList", contractFortuneList);

        // 하나라도 계약 확인이 안된게 있다면 댓글 노출
        String checkContract = CHECK_CONTRACT_Y;
        for (ContractFortuneDto contractFortune : contractFortuneList) {
            if (contractFortune.getCheckContract().equals(CHECK_CONTRACT_N)) {
                checkContract = CHECK_CONTRACT_N;
                break;
            }
        }

        // 댓글은 제일 처음에 등록된 계약 기준으로 댓글 구현 (※ 처음 등록된 계약이 삭제 되는 경우 작성 된 댓글도 사라짐)
        int currentBoardNo = 0;
        if (contractFortuneList.size() > 0) {
            ContractFortuneDto contractFortune = contractFortuneList.get(contractFortuneList.size() - 1);
            currentBoardNo = contractFortune.getContractCode();
        }

        // 댓글 조회를 위한 게시물 번호, 확인 여부
        model.addAttribute("currentBoardNo", currentBoardNo);
        model.addAttribute("checkContract", checkContract);

        model.addAttribute("isPublic", isPublic);

        // 페이지 정보
        model.addAttribute("urlName", INFO_CONTENT_NAME);    // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("title", INFO_CONTENT_NAME);      // 타이틀 명
        return "contractFortune/contractFortuneInfo";
    }

    /**
     * 목돈 계약 수정 화면 이동
     *
     * @param model
     * @param contractCode
     * @return
     */
    @GetMapping("/updateContractFortune")
    public String updateContractFortune(Model model, RedirectAttributes reAttr, @RequestParam(value = "contractCode") Integer contractCode, @RequestParam(value = "isSuccess", required = false) Boolean isSuccess,
                                        @RequestParam(value = "message", required = false) String message, @RequestParam(value = "isPublic", defaultValue = "true") boolean isPublic) throws Exception {

        if (!isPublic && !authService.hasAuth(AuthNameEnum.CONTRACT_PRIVATE)) {
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", IS_NOT_PRIVATE_AUTH_MESSAGE);
            return "redirect:/contractFortune/contractFortune";
        }

        // 목돈 계약 정보 by contractCode
        ContractFortuneDto contractFortuneDto = contractFortuneService.getContractFortune(contractCode, isPublic);
        model.addAttribute("contractFortuneDto", contractFortuneDto);

        // 부서 코드, 직급 조회
        EmployeeDto employeeInfoForContractFortune = employeeService.getEmployeeInfoForContractFortune(contractFortuneDto.getEmployeeCode());
        String departmentCode = employeeInfoForContractFortune.getDepartmentCode();
        model.addAttribute("employeeInfoForContractFortune", employeeInfoForContractFortune);

        // 계약 구분 리스트
        List<ContractFortuneStateEnum> contractStateEnumList = ContractFortuneStateEnum.getAllStateEnum();
        model.addAttribute("contractStateEnumList", contractStateEnumList);

        // 은행 리스트
        List<BankEnum> bankEnumList = BankEnum.getBankEnumList();
        model.addAttribute("bankEnumList", bankEnumList);

        // 처리 결과
        model.addAttribute("isSuccess", isSuccess);
        model.addAttribute("message", message);

        model.addAttribute("isPublic", isPublic);

        // 페이지 정보
        model.addAttribute("urlName", UPDATE_CONTENT_NAME);    // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("title", UPDATE_CONTENT_NAME);      // 타이틀 명

        return "contractFortune/updateContractFortune";
    }

    /**
     * 목돈 계약 수정 처리
     *
     * @param contractCode
     * @param contractFortuneDto
     * @param reAttr
     * @return
     */
    @PostMapping("/updateContractFortune")
    public String updateContractFortune(@RequestParam(value = "contractCode") Integer contractCode, @RequestParam(value = "preIsPublic", defaultValue = "true") boolean preIsPublic, @ModelAttribute(value = "contractFortuneDto") ContractFortuneDto contractFortuneDto, RedirectAttributes reAttr)
            throws Exception {

        if (!preIsPublic && !authService.hasAuth(AuthNameEnum.CONTRACT_PRIVATE)) {
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", IS_NOT_PRIVATE_AUTH_MESSAGE);
            return "redirect:/contractFortune/contractFortune";
        }

        int resultContractCode = contractFortuneService.updateContractFortune(contractFortuneDto, preIsPublic);

        if (resultContractCode != 0) {
            boolean isPublic;
            if (contractFortuneDto.getIsPublic().equals("true")) {
                isPublic = true;
            } else {
                isPublic = false;
            }
            // 비공개 조회 권한이 없을 경우 목돈 계약 리스트로 이동
            if (!isPublic && !authService.hasAuth(AuthNameEnum.CONTRACT_PRIVATE))
                return "redirect:/contractFortune/contractFortune";

            reAttr.addAttribute("contractCode", resultContractCode);
            reAttr.addAttribute("isPublic", isPublic);
            return "redirect:/contractFortune/contractFortuneInfo";
        } else {
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", FAIL_MESSAGE);
            reAttr.addAttribute("message", FAIL_MESSAGE);
            reAttr.addAttribute("contractCode", contractCode);
            reAttr.addAttribute("isPublic", preIsPublic);
            return "redirect:/contractFortune/updateContractFortune";
        }
    }

    /**
     * 계약 현황 Ajax
     *
     * @param contractReportDto
     * @return
     */
    @RequestMapping(value = "contractReport", method = RequestMethod.GET)
    @ResponseBody
    public ContractReportDto contractReport(@ModelAttribute(value = "contractReportDto") ContractReportDto contractReportDto) {
        try {
            contractReportDto = contractFortuneService.getContractReport(contractReportDto);
        } catch (Exception e) {
            log.info("Exception - /ContractFortuneController / contractReport / contractReportDto - {}", e.getMessage());
        }
        return contractReportDto;
    }

    /**
     * 목돈 계약 확인 처리
     *
     * @param contractCodeList
     * @param pageNum
     * @param searchValue
     * @param searchKey
     * @param startDate
     * @param endDate
     * @param reAttr
     * @return
     */
    @GetMapping("/updateCheckContract")
    public String updateCheckContract(@RequestParam(value = "contractCodeList") List<String> contractCodeList,
                                      @RequestParam(value = "pageNum", required = false, defaultValue = "1") int pageNum,
                                      @RequestParam(value = "searchValue", required = false) String searchValue,
                                      @RequestParam(value = "searchKey", required = false) String searchKey,
                                      @RequestParam(value = "startDate", required = false) String startDate,
                                      @RequestParam(value = "endDate", required = false) String endDate,
                                      RedirectAttributes reAttr) {


        if (!authService.hasAuth(AuthNameEnum.CONTRACT_CHECK)) {
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", IS_NOT_AUTH_MESSAGE);
            return "redirect:/contractFortune/checkContractFortune";
        }

        contractFortuneService.updateCheckContract(contractCodeList);

        reAttr.addAttribute("searchValue", searchValue);
        reAttr.addAttribute("searchKey", searchKey);
        reAttr.addAttribute("startDate", startDate);
        reAttr.addAttribute("endDate", endDate);
        reAttr.addAttribute("pageNum", pageNum);

        return "redirect:/contractFortune/checkContractFortune";
    }

    @ResponseBody
    @GetMapping("/count")
    public int countContractFortuneAndInsurance(@RequestParam(value = "potentialUserList[]") List<String> potentialUserList) {
        return contractFortuneService.countContractFortuneAndInsurance(potentialUserList);
    }

    /**
     * 월 별 이자 리스트 > 납입 완료 여부에서 미 확인 계약 > 확인 버튼 클릭 > 확인처리
     *
     * @param contractPaymentCycle
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "addPaymentCycle", method = RequestMethod.GET)
    public int addPaymentCycle(@ModelAttribute ContractPaymentCycleDto contractPaymentCycle) {

        if (contractPaymentCycle.getPaymentCycleNo() <= 0 || contractPaymentCycle.getContractCode() <= 0) return 0;
        if (!authService.hasAuth(AuthNameEnum.CONTRACT_PAYMENT_CHECK)) return 3;

        try {
            return contractFortuneService.addPaymentCycle(contractPaymentCycle);
        } catch (Exception e) {
            e.printStackTrace();
            return 2;
        }
    }

    /**
     * 상환 리스트 > 월 별 상환 일 등록 및 수정
     *
     * @param contractRepaymentDateDto
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/addContractRepaymentDate", method = RequestMethod.GET)
    public int addContractRepaymentDate(@ModelAttribute ContractRepaymentDateDto contractRepaymentDateDto) {
        if (contractRepaymentDateDto.getRepaymentMonth().isEmpty() || contractRepaymentDateDto.getRepaymentDate().isEmpty())
            return 0;
        if (!authService.hasAuth(AuthNameEnum.CONTRACT_PAYMENT_CHECK)) return 3;
        try {
            return contractFortuneService.addContractRepaymentDate(contractRepaymentDateDto);
        } catch (Exception e) {
            log.error("ContractFortuneController > addContractRepaymentDate > error message : {}", e.toString());
            return 2;
        }
    }

    /**
     * 상환 리스트 > 상환 정보 등록 및 수정
     *
     * @param contractRepaymentDto
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/addContractRepayment", method = RequestMethod.GET)
    public int addContractRepayment(@ModelAttribute ContractRepaymentDto contractRepaymentDto) {
        if (contractRepaymentDto.getContractCode() == 0) return 0;
        if (!authService.hasAuth(AuthNameEnum.CONTRACT_REPAYMENT_CHECK)) return 3;
        try {
            return contractFortuneService.addContractRepayment(contractRepaymentDto);
        } catch (Exception e) {
            log.error("ContractFortuneController > addContractRepayment > error message : {}", e.toString());
            return 2;
        }
    }

    /**
     * 상환 리스트 > 총 상환액 수정
     *
     * @param contractRepaymentDto
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/updateTotalRepayment", method = RequestMethod.GET)
    public int updateTotalRepayment(@ModelAttribute ContractRepaymentDto contractRepaymentDto) {
        if (contractRepaymentDto.getContractCode() == 0) return 0;
        if (!authService.hasAuth(AuthNameEnum.CONTRACT_REPAYMENT_MANAGER)) return 3;
        try {
            return contractFortuneService.updateTotalRepayment(contractRepaymentDto);
        } catch (Exception e) {
            log.error("ContractFortuneController > updateTotalRepayment > error message : {}", e.toString());
            return 2;
        }
    }

    /**
     * 상환 리스트 > 비고 수정
     *
     * @param contractRepaymentDto
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/updateNoteRepayment", method = RequestMethod.GET)
    public int updateNoteRepayment(@ModelAttribute ContractRepaymentDto contractRepaymentDto) {
        if (contractRepaymentDto.getContractCode() == 0) return 0;
        if (!authService.hasAuth(AuthNameEnum.CONTRACT_REPAYMENT_CHECK)) return 3;
        try {
            return contractFortuneService.updateNoteRepayment(contractRepaymentDto);
        } catch (Exception e) {
            log.error("ContractFortuneController > updateNoteRepayment > error message : {}", e.toString());
            return 2;
        }
    }

    /**
     * 상환 리스트 > 상환 정보 삭제
     *
     * @param contractCode
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/removeContractRepayment", method = RequestMethod.GET)
    public int removeContractRepayment(@RequestParam(value = "contractCode") int contractCode) {
        if (contractCode <= 0) return 0;
        if (!authService.hasAuth(AuthNameEnum.CONTRACT_REPAYMENT_CHECK)) return 3;
        try {
            return contractFortuneService.removeContractRepayment(contractCode);
        } catch (Exception e) {
            log.error("ContractFortuneController > removeContractRepayment > error message : {}", e.toString());
            return 2;
        }
    }

    @GetMapping("/deleteContractFortuneInfo")
    public String deleteContractFortuneInfo(@RequestParam(value = "contractCode") int contractCode) {
        contractFortuneService.deleteContractFortuneInfo(contractCode);
        return "redirect:/contractFortune/contractFortune";
    }

    @GetMapping("/deletePrivateContractFortuneInfo")
    public String deletePrivateContractFortuneInfo(@RequestParam(value = "contractCode") int contractCode, RedirectAttributes reAttr) {
        if (!authService.hasAuth(AuthNameEnum.CONTRACT_MANAGER)) {
            // TODO 에러메시지
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", IS_NOT_AUTH_MESSAGE);
            return "redirect:/contractFortune/privateContractFortune";
        }
        contractFortuneService.deletePrivateContractFortuneInfo(contractCode);
        return "redirect:/contractFortune/privateContractFortune";
    }
}