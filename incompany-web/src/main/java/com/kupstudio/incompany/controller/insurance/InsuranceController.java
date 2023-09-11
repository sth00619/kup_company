package com.kupstudio.incompany.controller.insurance;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.pagehelper.PageInfo;
import com.kupstudio.incompany.cacheService.employee.EmployeeCacheService;
import com.kupstudio.incompany.dto.EmployeeDto;
import com.kupstudio.incompany.dto.insurance.InsuranceDto;
import com.kupstudio.incompany.dto.insurance.InsuranceInfoDto;
import com.kupstudio.incompany.dto.partialSelectBox.PartialSelectBoxConditionDto;
import com.kupstudio.incompany.dto.potential.PotentialUserDto;
import com.kupstudio.incompany.enumClass.AuthNameEnum;
import com.kupstudio.incompany.enumClass.insurance.InsuranceCategoryEnum;
import com.kupstudio.incompany.enumClass.insurance.InsuranceCompanyEnum;
import com.kupstudio.incompany.enumClass.insurance.InsuranceSearchCateEnum;
import com.kupstudio.incompany.enumClass.insurance.InsuranceStateEnum;
import com.kupstudio.incompany.service.DepartmentSelectService;
import com.kupstudio.incompany.service.EmployeeService;
import com.kupstudio.incompany.service.auth.AuthService;
import com.kupstudio.incompany.service.contranct.InsuranceService;
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
@Controller
@RequestMapping("/insurance")
public class InsuranceController {
    private static final String CONTENT_NAME = "보험 계약 리스트";
    private static final String ADD_CONTENT_NAME = "보험 계약 추가";
    private static final String INFO_CONTENT_NAME = "보험 계약";
    private static final String UPDATE_CONTENT_NAME = "보험 계약 수정";
    private static final String CHECK_CONTENT_NAME = "보험 계약 확인";
    private static final String IS_NOT_AUTH_MESSAGE = "권한이 없습니다. \n담당자에게 문의하세요.";
    private static final String FAIL_MESSAGE = "처리 실패하였습니다.";

    // 화면에 노출시킬 리스트 개수 (페이지 개수x)
    private final int COUNT_PER_PAGE = 10;
    private final String DEFAULT_PAGE_STR = "1";

    // 계약확인 여부
    private final String CHECK_INSURANCE_Y = "Y";
    private final String CHECK_INSURANCE_N = "N";

    // 0 = 근무자, 1 = 퇴사자, 2 = 전체 조회
    private final Integer RESIGN_NUM = 2;

    private final int SALE_DEPARTMENT_LENGTH = 5;


    @Autowired
    InsuranceService insuranceService;
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
    @RequestMapping(value = "/updateInsurance", method = RequestMethod.POST)
    public Boolean updateInsurance(@RequestBody Map<String, Object> data) {
        try {
            insuranceService.updateJsonStringFromMap(data);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @GetMapping("/updateInsurance")
    public String updateInsuranceForm(Model model,
                                      @RequestParam(value = "insuranceManageNo") Integer insuranceManageNo) {
        /*계약한 보험 정보*/
        List<InsuranceInfoDto> insuranceInfoList = insuranceService.getInsuranceInfoList(insuranceManageNo);
        model.addAttribute("insuranceInfoList", insuranceInfoList);

        /*보험 계약관련 정보*/
        InsuranceDto insuranceDto = insuranceService.getInsurance(insuranceManageNo);
        model.addAttribute("insuranceDto", insuranceDto);

        /*로그인한 사원코드*/
        String loginEmployeeCode = authService.getEmployeeCode();
        model.addAttribute("loginEmployeeCode", loginEmployeeCode);

        /*사원코드로 사원정보 가져오기*/
        String employeeCode = insuranceService.getInsurance(insuranceManageNo).getEmployeeCode();
        EmployeeDto employeeDto = employeeService.getEmployeeInfoForAddContract(employeeCode, null);
        model.addAttribute("employeeDto", employeeDto);

        /*사원코드의 잠재고객 리스트 가져오기*/
        List<PotentialUserDto> potentialUserList = potentialUserService.getPotentialUserListByEmployeeCode(employeeCode);
        model.addAttribute("potentialUserList", potentialUserList);

        //보험 구분 리스트
        List<InsuranceStateEnum> insuranceStateEnum = InsuranceStateEnum.getAllStateEnum();
        model.addAttribute("insuranceStateEnum", insuranceStateEnum);
        //보험 카테고리 리스트
        List<InsuranceCategoryEnum> insuranceCategoryEnum = InsuranceCategoryEnum.getAllStateEnum();
        model.addAttribute("insuranceCategoryEnum", insuranceCategoryEnum);
        //보험사 리스트
        List<InsuranceCompanyEnum> insuranceCompanyEnum = InsuranceCompanyEnum.getInsuranceCompanyEnumList();
        model.addAttribute("insuranceCompanyEnum", insuranceCompanyEnum);

        model.addAttribute("urlName", UPDATE_CONTENT_NAME);
        model.addAttribute("title", UPDATE_CONTENT_NAME);

        return "insurance/updateInsurance";
    }

    /**
     * 계약 보험 상세 정보
     *
     * @param model
     * @param insuranceManageNo
     * @return
     */
    @GetMapping("/insuranceInfo")
    public String getInsuranceInfo(Model model,
                                   @RequestParam(value = "insuranceManageNo") Integer insuranceManageNo) {
        /*계약관련 정보*/
        InsuranceDto insuranceDto = insuranceService.getInsurance(insuranceManageNo);
        model.addAttribute("insuranceDto", insuranceDto);

        /*계약한 보험 상세 정보*/
        List<InsuranceInfoDto> insuranceInfoList = insuranceService.getInsuranceInfoList(insuranceManageNo);
        model.addAttribute("insuranceInfoList", insuranceInfoList);

        /*사원코드로 사원정보 가져오기*/
        String employeeCode = insuranceService.getInsurance(insuranceManageNo).getEmployeeCode();
        EmployeeDto employeeDto = employeeService.getEmployeeInfoForAddContract(employeeCode, null);
        model.addAttribute("employeeDto", employeeDto);

        String checkInsurance = insuranceDto.getCheckInsurance();
        model.addAttribute("checkInsurance", checkInsurance);

        // 댓글 조회를 위한 게시물 번호
        model.addAttribute("currentBoardNo", insuranceManageNo);
        model.addAttribute("urlName", INFO_CONTENT_NAME);
        model.addAttribute("title", INFO_CONTENT_NAME);

        return "insurance/insuranceInfo";
    }

    @ResponseBody
    @RequestMapping(value = "/addInsurance", method = RequestMethod.POST)
    public String addInsurance(@RequestBody Map<String, Object> data,
                               RedirectAttributes reAttr) throws JSONException, JsonProcessingException {
        // 총무만 가능
        if (!authService.hasAuth(AuthNameEnum.CONTRACT_MANAGER)) {
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", IS_NOT_AUTH_MESSAGE);
            return "redirect:/insurance/insurance";
        }


        insuranceService.addJsonStringFromMap(data);

        return "insurance/checkInsurance";
    }

    @GetMapping("/addInsurance")
    public String addInsurance(@RequestParam(value = "potentialUserNo", required = false) Integer potentialUserNo,
                               @RequestParam(value = "departmentCode", required = false) String departmentCode,
                               @RequestParam(value = "employeeCode", required = false) String employeeCode,
                               Model model, RedirectAttributes reAttr) throws Exception {

        // 총무만 가능
        if (!authService.hasAuth(AuthNameEnum.CONTRACT_MANAGER)) {
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", IS_NOT_AUTH_MESSAGE);
            return "redirect:/insurance/insurance";
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

        //보험 구분 리스트
        List<InsuranceStateEnum> insuranceStateEnum = InsuranceStateEnum.getAllStateEnum();
        model.addAttribute("insuranceStateEnum", insuranceStateEnum);

        //보험 카테고리 리스트
        List<InsuranceCategoryEnum> insuranceCategoryEnum = InsuranceCategoryEnum.getAllStateEnum();
        model.addAttribute("insuranceCategoryEnum", insuranceCategoryEnum);

        //보험사 리스트트
        List<InsuranceCompanyEnum> insuranceCompanyEnum = InsuranceCompanyEnum.getInsuranceCompanyEnumList();
        model.addAttribute("insuranceCompanyEnum", insuranceCompanyEnum);

        model.addAttribute("urlName", ADD_CONTENT_NAME);
        model.addAttribute("title", ADD_CONTENT_NAME);
        return "insurance/addInsurance";
    }


    /**
     * 보험 계약 확인 처리
     *
     * @param insuranceManageNoList
     * @return
     */
    @GetMapping("/updateCheckInsurance")
    public String updateCheckInsurance(RedirectAttributes reAttr,
                                       @RequestParam(value = "insuranceManageNoList") List<String> insuranceManageNoList,
                                       @RequestParam(value = "pageNum", required = false, defaultValue = "1") int pageNum) {

        if (!authService.hasAuth(AuthNameEnum.CONTRACT_CHECK)) {
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", IS_NOT_AUTH_MESSAGE);
            return "redirect:/insurance/checkInsurance";
        }

        insuranceService.updateCheckInsurance(insuranceManageNoList);

        reAttr.addAttribute("pageNum", pageNum);
        return "redirect:/insurance/checkInsurance";
    }

    /**
     * 보험 계약 확인 리스트
     *
     * @param pageNum
     * @return
     */
    @GetMapping("/checkInsurance")
    public String checkInsurance(Model model,
                                 @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum,
                                 @RequestParam(value = "searchValue", required = false) String searchValue,
                                 @RequestParam(value = "searchKey", required = false) String searchKey,
                                 @RequestParam(value = "orderBy", required = false) String orderBy,
                                 @RequestParam(value = "departmentCode", required = false) String departmentCode,
                                 @RequestParam(value = "employeeCode", required = false) String employeeCode,
                                 @RequestParam(value = "startDate", required = false) String startDate,
                                 @RequestParam(value = "endDate", required = false) String endDate,
                                 @RequestParam(value = "isSuccess", required = false) Boolean isSuccess,
                                 @RequestParam(value = "message", required = false) String message, RedirectAttributes reAttr) throws Exception {

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
                return "redirect:/insurance/checkInsurance";
            }

        }


        // 로그인한 사원에게 CONTRACT_LEADER 권한이 있을 경우 리더 부서 코드 세팅
        String leaderDepartmentCode = authService.getDepartmentCodeByIsAuth(AuthNameEnum.CONTRACT_LEADER);

        // 검색 조건 리스트 조회
        List<InsuranceSearchCateEnum> searchCateList = InsuranceSearchCateEnum.getAllMeaning();
        model.addAttribute("searchCateList", searchCateList);
        model.addAttribute("searchValue", searchValue);
        model.addAttribute("searchKey", searchKey);
        model.addAttribute("startDate", startDate);
        model.addAttribute("endDate", endDate);


        // 보험 리스트 조회
        PageInfo<InsuranceDto> insuranceList;
        insuranceList = PageInfo.of(insuranceService.getInsuranceList(startDate, endDate, CHECK_INSURANCE_N, pageNum, searchKey, searchValue, departmentCode, employeeCode, COUNT_PER_PAGE, orderBy), COUNT_PER_PAGE);

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
        insuranceList = PageInfoUtil.setPageNation(insuranceList, pageNum, COUNT_PER_PAGE);

        // 페이징에서 사용할 리스트 세팅
        model.addAttribute("pageList", insuranceList);
        model.addAttribute("pageNum", pageNum);

        model.addAttribute("insuranceList", insuranceList);
        model.addAttribute("urlName", CHECK_CONTENT_NAME);
        model.addAttribute("title", CHECK_CONTENT_NAME);

        model.addAttribute("loginEmployeeCode", authService.getEmployeeCode());

        model.addAttribute("orderBy", orderBy);
        model.addAttribute("isSuccess", isSuccess);
        model.addAttribute("message", message);

        return "insurance/checkInsurance";
    }

    @GetMapping("/insurance")
    public String insurance(Model model,
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
                            RedirectAttributes reAttr

    ) throws Exception {


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
                return "redirect:/insurance/insurance";
            }
        }

        // 로그인한 사원에게 CONTRACT_LEADER 권한이 있을 경우 리더 부서 코드 세팅
        String leaderDepartmentCode = authService.getDepartmentCodeByIsAuth(AuthNameEnum.CONTRACT_LEADER);


        // 검색 조건 리스트 조회
        List<InsuranceSearchCateEnum> searchCateList = InsuranceSearchCateEnum.getAllMeaning();
        model.addAttribute("searchCateList", searchCateList);
        model.addAttribute("searchValue", searchValue);
        model.addAttribute("searchKey", searchKey);
        model.addAttribute("startDate", startDate);
        model.addAttribute("endDate", endDate);

        // 보험 리스트 조회
        PageInfo<InsuranceDto> insuranceList;

        insuranceList = PageInfo.of(insuranceService.getInsuranceList(startDate, endDate, CHECK_INSURANCE_Y, pageNum, searchKey, searchValue, departmentCode, employeeCode, COUNT_PER_PAGE, orderBy), COUNT_PER_PAGE);

        // 본부, 지점, 팀, 담당자 리스트 select box 영역 세팅
        Map<String, Object> selectDepartmentMap = departmentSelectService.getSelectDepartment(departmentCode, RESIGN_NUM);

        // 리더권한의 사원이 담당자를 선택하지 않았을 경우 본인의 부서 코드로 세팅
        if (StringUtils.isEmpty(departmentCode) && StringUtils.isNotEmpty(leaderDepartmentCode))
            departmentCode = leaderDepartmentCode;

        // 페이징 start, end 세팅
        insuranceList = PageInfoUtil.setPageNation(insuranceList, pageNum, COUNT_PER_PAGE);

        // 페이징에서 사용할 리스트 세팅
        model.addAttribute("pageList", insuranceList);
        model.addAttribute("pageNum", pageNum);

        model.addAttribute("insuranceList", insuranceList);

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
        return "insurance/insurance";
    }

    /**
     * 계약 이관
     */
    @GetMapping("/transferEmployeeInsurance")
    public String transferEmployeeContract(@RequestParam(value = "pageNum", required = false, defaultValue = "1") int pageNum,
                                           @RequestParam(value = "transferEmployeeCode") String transferEmployeeCode,
                                           @RequestParam(value = "insuranceCodeList") List<String> insuranceCodeList,
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
                insuranceService.transferEmployeeInsurance(insuranceCodeList, transferEmployeeCode);
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

        return "redirect:/insurance/insurance";
    }

    @GetMapping("/deleteInsuranceInfo")
    public String deleteInsuranceInfo(@RequestParam(value = "insuranceManageNo") int insuranceManageNo) {
        insuranceService.deleteInsuranceInfo(insuranceManageNo);
        insuranceService.deleteInsurance(insuranceManageNo);
        return "redirect:/insurance/insurance";

    }
}
