package com.kupstudio.incompany.controller.fund;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.pagehelper.PageInfo;
import com.kupstudio.incompany.cacheService.employee.EmployeeCacheService;
import com.kupstudio.incompany.config.CommonEncryptConfig;
import com.kupstudio.incompany.dto.EmployeeDto;
import com.kupstudio.incompany.dto.fund.FundDto;
import com.kupstudio.incompany.dto.fund.FundInfoDto;
import com.kupstudio.incompany.dto.partialSelectBox.PartialSelectBoxConditionDto;
import com.kupstudio.incompany.dto.potential.PotentialUserDto;
import com.kupstudio.incompany.enumClass.AuthNameEnum;
import com.kupstudio.incompany.enumClass.fund.FundSearchCateEnum;
import com.kupstudio.incompany.enumClass.fund.FundStateEnum;
import com.kupstudio.incompany.service.DepartmentSelectService;
import com.kupstudio.incompany.service.EmployeeService;
import com.kupstudio.incompany.service.auth.AuthService;
import com.kupstudio.incompany.service.fund.FundService;
import com.kupstudio.incompany.service.partialSelectBox.PartialSelectBoxConditionService;
import com.kupstudio.incompany.service.potential.PotentialUserService;
import com.kupstudio.incompany.util.PageInfoUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RequestMapping(value = "/fund")
@Controller
public class fundController {
    private static final String CONTENT_NAME = "펀드 계약 리스트";
    private static final String ADD_CONTENT_NAME = "펀드 계약 추가";
    private static final String INFO_CONTENT_NAME = "펀드 계약";
    private static final String UPDATE_CONTENT_NAME = "펀드 계약 수정";
    private static final String CHECK_CONTENT_NAME = "펀드 계약 확인";
    private static final String IS_NOT_AUTH_MESSAGE = "권한이 없습니다. \n담당자에게 문의하세요.";
    private static final String FAIL_MESSAGE = "처리 실패하였습니다.";

    // 화면에 노출시킬 리스트 개수 (페이지 개수x)
    private final int COUNT_PER_PAGE = 10;
    private final String DEFAULT_PAGE_STR = "1";

    // 계약확인 여부
    private final String CHECK_FUND_Y = "Y";
    private final String CHECK_FUND_N = "N";

    // 0 = 근무자, 1 = 퇴사자, 2 = 전체 조회
    private final Integer RESIGN_NUM = 2;

    private final int SALE_DEPARTMENT_LENGTH = 5;

    @Autowired
    FundService fundService;
    @Autowired
    EmployeeService employeeService;
    @Autowired
    AuthService authService;
    @Autowired
    PotentialUserService potentialUserService;
    @Autowired
    private DepartmentSelectService departmentSelectService;
    @Autowired
    private EmployeeCacheService employeeCacheService;

    @Autowired
    private PartialSelectBoxConditionService partialSelectBoxConditionService;

    @ResponseBody
    @RequestMapping(value = "/updateFund", method = RequestMethod.POST)
    public Boolean updateFund(@RequestBody Map<String, Object> data) {
        try {
            fundService.updateJsonStringFromMap(data);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @GetMapping("/updateFund")
    public String updateFundForm(Model model,
                                 @RequestParam(value = "fundManageNo") Integer fundManageNo) {
        /*계약한 펀드 정보*/
        List<FundInfoDto> fundInfoList = fundService.getFundInfoList(fundManageNo);
        model.addAttribute("fundInfoList", fundInfoList);

        /*펀드 계약관련 정보*/
        FundDto fundDto = fundService.getFund(fundManageNo);
        model.addAttribute("fundDto", fundDto);

        /*로그인한 사원코드*/
        String loginEmployeeCode = authService.getEmployeeCode();
        model.addAttribute("loginEmployeeCode", loginEmployeeCode);

        /*사원코드로 사원정보 가져오기*/
        String employeeCode = fundService.getFund(fundManageNo).getEmployeeCode();
        EmployeeDto employeeDto = employeeService.getEmployeeInfoForAddContract(employeeCode, null);
        model.addAttribute("employeeDto", employeeDto);

        /*사원코드의 잠재고객 리스트 가져오기*/
        List<PotentialUserDto> potentialUserList = potentialUserService.getPotentialUserListByEmployeeCode(employeeCode);
        model.addAttribute("potentialUserList", potentialUserList);

        //펀드 구분 리스트
        List<FundStateEnum> fundStateEnum = FundStateEnum.getAllStateEnum();
        model.addAttribute("fundStateEnum", fundStateEnum);

        model.addAttribute("urlName", UPDATE_CONTENT_NAME);
        model.addAttribute("title", UPDATE_CONTENT_NAME);

        return "fund/updateFund";
    }

    /**
     * 계약 펀드 상세 정보
     *
     * @param model
     * @param fundManageNo
     * @return
     */
    @GetMapping("/fundInfo")
    public String getFundInfo(Model model,
                              @RequestParam(value = "fundManageNo") Integer fundManageNo) {
        /*계약관련 정보*/
        FundDto fundDto = fundService.getFund(fundManageNo);
        model.addAttribute("fundDto", fundDto);

        /*계약한 펀드 상세 정보*/
        List<FundInfoDto> fundInfoList = fundService.getFundInfoList(fundManageNo);
        model.addAttribute("fundInfoList", fundInfoList);

        /*사원코드로 사원정보 가져오기*/
        String employeeCode = fundService.getFund(fundManageNo).getEmployeeCode();
        EmployeeDto employeeDto = employeeService.getEmployeeInfoForAddContract(employeeCode, null);
        model.addAttribute("employeeDto", employeeDto);

        String checkFund = fundDto.getCheckFund();
        model.addAttribute("checkFund", checkFund);

        // 댓글 조회를 위한 게시물 번호
        model.addAttribute("currentBoardNo", fundManageNo);
        model.addAttribute("urlName", INFO_CONTENT_NAME);
        model.addAttribute("title", INFO_CONTENT_NAME);

        return "fund/fundInfo";
    }

    @ResponseBody
    @RequestMapping(value = "/addFund", method = RequestMethod.POST)
    public String addFund(@RequestBody Map<String, Object> data,
                          RedirectAttributes reAttr) throws JSONException, JsonProcessingException {
        // 총무만 가능
        if (!authService.hasAuth(AuthNameEnum.CONTRACT_MANAGER)) {
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", IS_NOT_AUTH_MESSAGE);
            return "redirect:/fund/fund";
        }

        fundService.addJsonStringFromMap(data);

        return "fund/checkFund";
    }

    @GetMapping("/addFund")
    public String addFund(Model model, RedirectAttributes reAttr,
                          @RequestParam(value = "potentialUserNo", required = false) Integer potentialUserNo,
                          @RequestParam(value = "departmentCode", required = false) String departmentCode,
                          @RequestParam(value = "employeeCode", required = false) String employeeCode) {


        // 총무만 가능
        if (!authService.hasAuth(AuthNameEnum.CONTRACT_MANAGER)) {
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", IS_NOT_AUTH_MESSAGE);
            return "redirect:/fund/fund";
        }

        model.addAttribute("departmentCode", departmentCode);
        model.addAttribute("employeeCode", employeeCode);

        // 담당자 정보
        EmployeeDto employeeDto = new EmployeeDto();
        if (StringUtils.isNotEmpty(employeeCode))
            employeeDto = employeeService.getEmployeeInfoForAddContract(employeeCode, 0);
        model.addAttribute("employeeDto", employeeDto);

        // 담당자 검색 리스트
        List<EmployeeDto> allEmployeeList = employeeCacheService.getEmployeeByWorkingStatus(0);
        employeeService.setDepartmentNameByDepthForEmployeeInfo(allEmployeeList);
        model.addAttribute("allEmployee", allEmployeeList);

        /*입력받은 사원코드의 잠재고객 리스트 가져오기*/
        List<PotentialUserDto> potentialUserList = potentialUserService.getPotentialUserListByEmployeeCode(employeeCode);
        model.addAttribute("potentialUserList", potentialUserList);

        // 고객 코드
        if (potentialUserNo != null) model.addAttribute("potentialUserNo", potentialUserNo);

        //펀드 구분 리스트
        List<FundStateEnum> fundStateEnum = FundStateEnum.getAllStateEnum();
        model.addAttribute("fundStateEnum", fundStateEnum);

        model.addAttribute("urlName", ADD_CONTENT_NAME);
        model.addAttribute("title", ADD_CONTENT_NAME);
        return "fund/addFund";
    }

    /**
     * 펀드 계약 확인 처리
     *
     * @param fundManageNoList
     * @return
     */
    @GetMapping("/updateCheckFund")
    public String updateCheckFund(RedirectAttributes reAttr,
                                  @RequestParam(value = "fundManageNoList") List<String> fundManageNoList,
                                  @RequestParam(value = "pageNum", required = false, defaultValue = "1") int pageNum) {

        if (!authService.hasAuth(AuthNameEnum.CONTRACT_CHECK)) {
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", IS_NOT_AUTH_MESSAGE);
            return "redirect:/fund/checkFund";
        }

        fundService.updateCheckFund(fundManageNoList);

        reAttr.addAttribute("pageNum", pageNum);
        return "redirect:/fund/checkFund";
    }

    /**
     * 펀드 계약 확인 리스트
     *
     * @param pageNum
     * @return
     */
    @GetMapping("/checkFund")
    public String checkFund(Model model,
                            @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum,
                            @RequestParam(value = "searchValue", required = false) String searchValue,
                            @RequestParam(value = "searchKey", required = false) String searchKey,
                            @RequestParam(value = "orderBy", required = false) String orderBy,
                            @RequestParam(value = "departmentCode", required = false) String departmentCode,
                            @RequestParam(value = "employeeCode", required = false) String employeeCode,
                            @RequestParam(value = "startDate", required = false) String startDate,
                            @RequestParam(value = "endDate", required = false) String endDate,
                            @RequestParam(value = "isSuccess", required = false) Boolean isSuccess,
                            @RequestParam(value = "message", required = false) String message) throws Exception {

        // 로그인한 사원에게 CONTRACT_LEADER 권한이 있을 경우 리더 부서 코드 세팅
        String leaderDepartmentCode = authService.getDepartmentCodeByIsAuth(AuthNameEnum.CONTRACT_LEADER);

        // 검색 조건 리스트 조회
        List<FundSearchCateEnum> searchCateList = FundSearchCateEnum.getAllMeaning();
        model.addAttribute("searchCateList", searchCateList);
        model.addAttribute("originalSearchValue", searchValue);
        model.addAttribute("searchKey", searchKey);

        if (StringUtils.isNotEmpty(searchKey) && StringUtils.isNotEmpty(searchValue)) {
            if (searchKey.equals(FundSearchCateEnum.USER_MOBILE.getMeaning())) {
                searchValue = CommonEncryptConfig.encryptAes(searchValue, CommonEncryptConfig.ENCRYPT_KEY_POTENTIAL_USER);
            }
        }

        model.addAttribute("startDate", startDate);
        model.addAttribute("endDate", endDate);

        // 펀드 리스트 조회
        PageInfo<FundDto> fundList;
        fundList = PageInfo.of(fundService.getFundList(startDate, endDate, CHECK_FUND_N, pageNum, searchKey, searchValue, departmentCode, employeeCode, COUNT_PER_PAGE, orderBy), COUNT_PER_PAGE);

        // 본부, 지점, 팀, 담당자 리스트 select box 영역 세팅
        Map<String, Object> selectDepartmentMap = departmentSelectService.getSelectDepartment(departmentCode, RESIGN_NUM);

        // 리더권한의 사원이 담당자를 선택하지 않았을 경우 본인의 부서 코드로 세팅
        if (StringUtils.isEmpty(departmentCode) && StringUtils.isNotEmpty(leaderDepartmentCode))
            departmentCode = leaderDepartmentCode;

        // 본부, 지점, 팀, 담당자 리스트 select box 영역 세팅
        model.addAttribute("selectDepartmentMap", selectDepartmentMap);
        model.addAttribute("departmentCode", departmentCode);
        model.addAttribute("employeeCode", employeeCode);

        // 페이징 start, end 세팅
        fundList = PageInfoUtil.setPageNation(fundList, pageNum, COUNT_PER_PAGE);

        // 페이징에서 사용할 리스트 세팅
        model.addAttribute("pageList", fundList);
        model.addAttribute("pageNum", pageNum);

        // Pass the searchValue parameter to the page_nation fragment
        model.addAttribute("searchValue", searchValue);

        model.addAttribute("fundList", fundList);
        model.addAttribute("urlName", CHECK_CONTENT_NAME);
        model.addAttribute("title", CHECK_CONTENT_NAME);

        model.addAttribute("loginEmployeeCode", authService.getEmployeeCode());

        model.addAttribute("orderBy", orderBy);
        model.addAttribute("isSuccess", isSuccess);
        model.addAttribute("message", message);

        return "fund/checkFund";
    }


    @GetMapping("/fund")
    public String fund(Model model,
                       @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum,
                       @RequestParam(value = "searchKey", required = false) String searchKey,
                       @RequestParam(value = "searchValue", required = false) String searchValue,
                       @RequestParam(value = "departmentCode", required = false) String departmentCode,
                       @RequestParam(value = "employeeCode", required = false) String employeeCode,
                       @RequestParam(value = "startDate", required = false) String startDate,
                       @RequestParam(value = "endDate", required = false) String endDate,
                       @RequestParam(value = "orderBy", required = false) String orderBy,
                       @RequestParam(value = "isSuccess", required = false) Boolean isSuccess,
                       @RequestParam(value = "message", required = false) String message,
                       RedirectAttributes reAttr) throws Exception {

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
                return "redirect:/fund/fund";
            }

        }
        // 로그인한 사원에게 CONTRACT_LEADER 권한이 있을 경우 리더 부서 코드 세팅
        String leaderDepartmentCode = authService.getDepartmentCodeByIsAuth(AuthNameEnum.CONTRACT_LEADER);


        // 검색 조건 리스트 조회
        List<FundSearchCateEnum> searchCateList = FundSearchCateEnum.getAllMeaning();
        model.addAttribute("searchCateList", searchCateList);

        model.addAttribute("originalSearchValue", searchValue);
        model.addAttribute("searchKey", searchKey);

        if (StringUtils.isNotEmpty(searchKey) && StringUtils.isNotEmpty(searchValue)) {
            if (searchKey.equals(FundSearchCateEnum.USER_MOBILE.getMeaning())) {
                searchValue = CommonEncryptConfig.encryptAes(searchValue, CommonEncryptConfig.ENCRYPT_KEY_POTENTIAL_USER);
            }
        }

        model.addAttribute("startDate", startDate);
        model.addAttribute("endDate", endDate);

        // 펀드 리스트 조회
        PageInfo<FundDto> fundList;
        fundList = PageInfo.of(fundService.getFundList(startDate, endDate, CHECK_FUND_Y, pageNum, searchKey, searchValue, departmentCode, employeeCode, COUNT_PER_PAGE, orderBy), COUNT_PER_PAGE);

        // Get the total number of records in the list
        long totalRecords = fundList.getTotal();

        // Calculate the total number of pages based on the number of records and items per page
        long totalPages = (totalRecords + COUNT_PER_PAGE - 1) / COUNT_PER_PAGE;

        // Update the page number if it exceeds the total number of pages
        if (pageNum > totalPages) {
            pageNum = (int) totalPages;
        }

        // 본부, 지점, 팀, 담당자 리스트 select box 영역 세팅
        Map<String, Object> selectDepartmentMap = departmentSelectService.getSelectDepartment(departmentCode, RESIGN_NUM);

        // 리더권한의 사원이 담당자를 선택하지 않았을 경우 본인의 부서 코드로 세팅
        if (StringUtils.isEmpty(departmentCode) && StringUtils.isNotEmpty(leaderDepartmentCode))
            departmentCode = leaderDepartmentCode;

        // 페이징 start, end 세팅
        fundList = PageInfoUtil.setPageNation(fundList, pageNum, COUNT_PER_PAGE);

        // 페이징에서 사용할 리스트 세팅
        model.addAttribute("pageList", fundList);
        model.addAttribute("pageNum", pageNum);

        model.addAttribute("fundList", fundList);

        // 본부, 지점, 팀, 담당자 리스트 select box 영역 세팅
        model.addAttribute("selectDepartmentMap", selectDepartmentMap);
        model.addAttribute("departmentCode", departmentCode);
        model.addAttribute("employeeCode", employeeCode);

        // 계약 현황 관련 사원코드 (선택한 담당자가 없을 때 본인의 계약 현황 조회)
        model.addAttribute("reportEmployeeCode", authService.getEmployeeCode());

        model.addAttribute("urlName", CONTENT_NAME);
        model.addAttribute("title", CONTENT_NAME);

        model.addAttribute("message", message);
        model.addAttribute("isSuccess", isSuccess);

        model.addAttribute("orderBy", orderBy);
        return "fund/fund";
    }

    /**
     * 계약 이관
     */
    @GetMapping("/transferEmployeeFund")
    public String transferEmployeeContract(@RequestParam(value = "pageNum", required = false, defaultValue = "1") int pageNum,
                                           @RequestParam(value = "transferEmployeeCode") String transferEmployeeCode,
                                           @RequestParam(value = "fundCodeList") List<String> fundCodeList,
                                           @RequestParam(value = "departmentCode", required = false) String selectDepartmentCode,
                                           @RequestParam(value = "selectEmployeeCode", required = false) String selectEmployeeCode,
                                           @RequestParam(value = "searchValue", required = false) String searchValue,
                                           @RequestParam(value = "searchKey", required = false) String searchKey,
                                           @RequestParam(value = "startDate", required = false) String startDate,
                                           @RequestParam(value = "endDate", required = false) String endDate,
                                           RedirectAttributes reAttr) {
        Boolean isSuccess;
        String message = null;

        if (authService.hasAuth(AuthNameEnum.CONTRACT_TRANSFER)) {
            try {
                fundService.transferEmployeeFund(fundCodeList, transferEmployeeCode);
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

        return "redirect:/fund/fund";
    }

    @GetMapping("/deleteFundInfo")
    public String deleteFundInfo(@RequestParam(value = "fundManageNo") int fundManageNo) {
        fundService.deleteFundInfo(fundManageNo);
        fundService.deleteFund(fundManageNo);
        return "redirect:/fund/fund";

    }
}
