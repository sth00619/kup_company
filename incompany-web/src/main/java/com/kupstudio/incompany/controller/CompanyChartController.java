package com.kupstudio.incompany.controller;

import com.github.pagehelper.PageInfo;
import com.kupstudio.incompany.cacheService.company.CompanyCacheService;
import com.kupstudio.incompany.cacheService.employee.EmployeeCacheService;
import com.kupstudio.incompany.config.CommonEncryptConfig;
import com.kupstudio.incompany.dto.CompanyChartDto;
import com.kupstudio.incompany.dto.DepartmentDto;
import com.kupstudio.incompany.dto.EmployeeDto;
import com.kupstudio.incompany.enumClass.AuthNameEnum;
import com.kupstudio.incompany.enumClass.employee.EmployeeSearchCateEnum;
import com.kupstudio.incompany.service.CompanyChartService;
import com.kupstudio.incompany.service.CompanyPositionService;
import com.kupstudio.incompany.service.DepartmentService;
import com.kupstudio.incompany.service.EmployeeService;
import com.kupstudio.incompany.service.auth.AuthService;
import com.kupstudio.incompany.service.department.DepartmentSearchService;
import com.kupstudio.incompany.util.DepartmentCodeUtil;
import com.kupstudio.incompany.util.PageInfoUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Slf4j
@Controller
@RequiredArgsConstructor
public class CompanyChartController {

    private static final String IS_NOT_AUTH_MESSAGE = "권한이 없습니다. \n담당자에게 문의하세요.";
    private final String DEFAULT_PAGE_STR = "1";
    private final int COUNT_PER_PAGE = 10; // 화면에 노출시킬 리스트 개수 (페이지 개수x)
    private final DepartmentService departmentService;
    private final DepartmentSearchService departmentSearchService;
    private final AuthService authService;
    private final CompanyCacheService companyCacheService;
    private final String BELONG_DEPARTMENT_CODE = "D";

    private final String DEPARTMENT_DEPLOYING_NAME = "D99"; // 부서 배치 중
    private final String BELONG_DEPARTMENT_NAME = "본부";
    private final int TEAM_CODE_LENGTH = 7;
    private final int DEPART_CODE_LENGTH = 5;
    private final int BELONG_CODE_LENGTH = 3;

    @Autowired
    private final CompanyChartService companyChartService;
    private final EmployeeCacheService employeeCacheService;
    @Autowired
    EmployeeService employeeService;

    @GetMapping("/companyChart")
    public String companyChart(Model model, Authentication authentication, RedirectAttributes reAttr,
                               @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum,
                               @RequestParam(value = "departmentCode", required = false, defaultValue = "D") String departmentCode,
                               @RequestParam(value = "employeeName", required = false) String employeeName,
                               @RequestParam(value = "searchValue", required = false) String searchValue,
                               @RequestParam(value = "searchKey", required = false) String searchKey,
                               @RequestParam(value = "isSuccess", required = false) Boolean isSuccess,
                               @RequestParam(value = "isResign", required = false, defaultValue = "0") Integer isResign,
                               @RequestParam(value = "message", required = false) String message) throws Exception {


        // 부서배치 중 리스트 : 권한 있는 사원만 노출
        if (departmentCode.equals(DEPARTMENT_DEPLOYING_NAME)) {

            if (!authService.hasAuth(AuthNameEnum.DEPARTMENT_DEPLOYING)) {
                reAttr.addAttribute("isSuccess", false);
                reAttr.addAttribute("message", IS_NOT_AUTH_MESSAGE);
                return "redirect:/index";
            }
        }

        // 조직추가 셀렉트박스
        List<CompanyChartDto> companyList = companyCacheService.getAllCompanyList();
        model.addAttribute("companyList", companyList);

        // 사원 이름 검색용 리스트
        List<String> searchEmployeeNameList = employeeCacheService.getEmployeeNameByDepartmentCode(departmentCode);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        model.addAttribute("role", userDetails.getAuthorities());

        // 검색 조건 리스트 조회
        List<EmployeeSearchCateEnum> searchCateList = EmployeeSearchCateEnum.getAllMeaning();
        model.addAttribute("searchCateList", searchCateList);

        PageInfo<EmployeeDto> employeeList = null;
        if (StringUtils.isNotEmpty(searchKey) && StringUtils.isNotEmpty(searchValue)) {
            if (searchKey.equals(EmployeeSearchCateEnum.EMPLOYEE_MOBILE.getMeaning())) {
                // Encrypt the searchValue if the searchKey is EmployeeSearchCateEnum.EMPLOYEE_MOBILE
                searchValue = CommonEncryptConfig.encryptAes(searchValue, CommonEncryptConfig.ENCRYPT_KEY);
            }
            // 검색조건에 따른 사원리스트 조회
            employeeList = PageInfo.of(employeeService.getEmployeeListOfSearchCategory(searchKey, searchValue, pageNum, isResign));
        } else if (StringUtils.isNotEmpty(departmentCode)) {
            // 조직도 부서 별 사원 리스트 조회
            employeeList = PageInfo.of(employeeService.getEmployeeListOfDepartment(departmentCode, pageNum, employeeName, isResign));
        }

        /* 페이징 start, end 세팅 */
        employeeList = PageInfoUtil.setPageNation(employeeList, pageNum, COUNT_PER_PAGE);

        List<CompanyChartDto> company = companyChartService.getAllCompanyList();
        model.addAttribute("company", company);

        model.addAttribute("employeeList", employeeList);
        model.addAttribute("searchEmployeeNameList", searchEmployeeNameList);

        // 페이징에서 사용할 리스트 세팅
        model.addAttribute("pageList", employeeList);
        model.addAttribute("pageNum", pageNum);

        // departmentCode parameter 넘겨주면 해당 부서 사원리스트 출력 및 왼쪽 조직도 회사 부서 전체 펼침, 다른 회사는 닫힘
        model.addAttribute("departmentCode", departmentCode);

        // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("urlName", "부서별 사원 리스트");

        model.addAttribute("employeeName", employeeName);
        model.addAttribute("pageNum", pageNum);

        model.addAttribute("title", "조직도");

        if (StringUtils.isNotEmpty(searchKey) && StringUtils.isNotEmpty(searchValue)) {
            if (searchKey.equals(EmployeeSearchCateEnum.EMPLOYEE_MOBILE.getMeaning())) {
                searchValue = CommonEncryptConfig.decryptAes(searchValue, CommonEncryptConfig.ENCRYPT_KEY);
                model.addAttribute("searchValue", searchValue);
            } else {
                model.addAttribute("searchValue", searchValue);
            }
        }
        model.addAttribute("searchKey", searchKey);
        model.addAttribute("isResign", isResign);

        model.addAttribute("isSuccess", isSuccess);
        model.addAttribute("message", message);

        List<DepartmentDto> salesDepartmentList;
        List<DepartmentDto> teamList = null;
        List<DepartmentDto> departmentList = null;
        String leaderDepartmentCode = null;

        // 로그인한 사원에게 리더 권한이 있을 경우 리더 부서 코드 세팅
        if (StringUtils.isNotEmpty(departmentCode)) {
            leaderDepartmentCode = authService.getDepartmentCodeByIsAuth(AuthNameEnum.SELECT_SALES_LEADER);
        }

        departmentCode = authService.getDepartmentCode();
        List info = DepartmentCodeUtil.getInfo(departmentCode);

        // 팀 선택 select box 유지
        if (departmentCode != null && departmentCode.length() == TEAM_CODE_LENGTH) {
            teamList = departmentService.getChildDepartment((String) info.get(1));
            departmentList = departmentService.getChildDepartment((String) info.get(0));
        } else if (departmentCode != null && departmentCode.length() == DEPART_CODE_LENGTH) {
            teamList = departmentService.getChildDepartment((String) info.get(1));
            departmentList = departmentService.getChildDepartment((String) info.get(0));
        } else if (departmentCode != null && departmentCode.length() == BELONG_CODE_LENGTH) {
            departmentList = departmentService.getChildDepartment((String) info.get(0));
        } else if (leaderDepartmentCode != null) {
            teamList = departmentService.getChildDepartment(leaderDepartmentCode);
        }

        salesDepartmentList = departmentService.getChildDepartmentByName(BELONG_DEPARTMENT_CODE, BELONG_DEPARTMENT_NAME);

        String companyCode = departmentSearchService.getDepartment(departmentCode).getCompanyCode();
        model.addAttribute("companyCode", companyCode);

        model.addAttribute("salesDepartmentList", salesDepartmentList);
        model.addAttribute("departmentList", departmentList);
        model.addAttribute("teamList", teamList);
        model.addAttribute("employeeLoginCode", authService.getEmployeeCode());
        model.addAttribute("message", message);

        return "companyChart/companyChart";
    }

    @RequestMapping(value = "getDepartmentDepth", method = RequestMethod.GET)
    @ResponseBody
    public List<CompanyChartDto> getDepartmentDepth(@RequestParam(value = "companyCode", required = false) String companyCode,
                                                    @RequestParam(value = "departmentCode", required = false) String departmentCode) {
        if (departmentCode == null) departmentCode = "D";

        List<CompanyChartDto> getDepartmentOneDepth = companyChartService.getDepartmentOneDepth(companyCode, departmentCode);

        return getDepartmentOneDepth;
    }


}