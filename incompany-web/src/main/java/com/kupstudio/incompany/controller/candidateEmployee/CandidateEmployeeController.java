package com.kupstudio.incompany.controller.candidateEmployee;

import com.github.pagehelper.PageInfo;
import com.kupstudio.incompany.cacheService.employee.EmployeeCacheService;
import com.kupstudio.incompany.dto.EmployeeDto;
import com.kupstudio.incompany.dto.candidateEmployee.CandidateEmployeeDto;
import com.kupstudio.incompany.enumClass.AuthNameEnum;
import com.kupstudio.incompany.security.EmployeePrincipal;
import com.kupstudio.incompany.service.DepartmentSelectService;
import com.kupstudio.incompany.service.EmployeeService;
import com.kupstudio.incompany.service.auth.AuthService;
import com.kupstudio.incompany.service.candidateEmployee.CandidateEmployeeService;
import com.kupstudio.incompany.service.candidateEmployee.CandidateModifyEmployeeService;
import com.kupstudio.incompany.util.MobileHyphenUtil;
import com.kupstudio.incompany.util.PageInfoUtil;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/candidate")
@RequiredArgsConstructor
public class CandidateEmployeeController {

    private final CandidateModifyEmployeeService candidateModifyEmployeeService;

    private final CandidateEmployeeService candidateEmployeeService;
    private final String CANDIDATE_EMPLOYEE_TITLE = "후보자 리스트";

    private final String CANDIDATE_EMPLOYEE_INFO = "후보자 정보";


    private final String CANDIDATE_EMPLOYEE_ADD = "후보자 추가";

    private final String CANDIDATE_EMPLOYEE_EDIT = "후보자 수정";

    private final int NAVIGATE_PAGES = 10;
    private final int COUNT_PER_PAGE = 10;
    private final String DEFAULT_PAGE_STR = "1";

    private final AuthService authService;


    private final DepartmentSelectService departmentSelectService;

    private final EmployeeCacheService employeeCacheService;
    private final EmployeeService employeeService;

    @SneakyThrows
    @GetMapping("/list")
    public String candidateList(Model model,
                                @RequestParam(value = "employeeCode", required = false) String employeeCode,
                                @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum,
                                @RequestParam(value = "departmentCode", required = false) String departmentCode,
                                @RequestParam(value = "searchType", required = false) String searchType,
                                @RequestParam(value = "keyword", required = false) String keyword) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String employeeLoginCode = auth.getName();
        PageInfo<CandidateEmployeeDto> counselingUserList;

        if (employeeCode != null || departmentCode != null) {

            counselingUserList = PageInfo.of(candidateModifyEmployeeService.getCandidateEmployeeList(departmentCode, searchType, keyword, employeeCode, pageNum, COUNT_PER_PAGE), NAVIGATE_PAGES);
            model.addAttribute("employeeCode", employeeCode);
        } else {
            counselingUserList = PageInfo.of(candidateModifyEmployeeService.getCandidateEmployeeList(departmentCode, searchType, keyword, employeeLoginCode, pageNum, COUNT_PER_PAGE), NAVIGATE_PAGES);

            model.addAttribute("employeeCode", employeeLoginCode);
        }

        counselingUserList = PageInfoUtil.setPageNation(counselingUserList, pageNum);

        // 본부, 지점, 팀, 담당자 리스트 select box 영역 세팅
        Map<String, Object> selectDepartmentMap = departmentSelectService.getSelectDepartment(departmentCode);

        // 로그인한 사원에게 리더 권한이 있을 경우 리더 부서 코드 세팅
        String leaderDepartmentCode = authService.getDepartmentCodeByIsAuth(AuthNameEnum.SELECT_SALES_LEADER);

        if (departmentCode == null && leaderDepartmentCode != null) departmentCode = leaderDepartmentCode;

        try {

            // 본부, 지점, 팀, 담당자 리스트 select box 세팅
            model.addAttribute("selectDepartmentMap", selectDepartmentMap);
            // 검색
            model.addAttribute("searchType", searchType);
            model.addAttribute("keyword", keyword);
            //잠재고객 리스트
            model.addAttribute("pageList", counselingUserList);
            model.addAttribute("employeeLoginCode", employeeLoginCode);
            model.addAttribute("candidateList", counselingUserList);
            model.addAttribute("pageNum", pageNum);


            // 영업부서, 팀, 담당자 리스트 select box 세팅


            model.addAttribute("urlName", CANDIDATE_EMPLOYEE_TITLE);    // 컨텐츠 상단 현재 페이지 명
            model.addAttribute("title", CANDIDATE_EMPLOYEE_TITLE);      // 타이틀 명

            model.addAttribute("departmentCode", departmentCode);


            return "potential/candidate/list";
        } catch (Exception e) {
            e.printStackTrace();
            return "redirect:/potential/candidate/list";
        }


    }


    @GetMapping("/info")
    public String candidateInfo(Model model,
                                @RequestParam(name = "candidateEmployeeNo") Integer candidateEmployeeNo) {

        CandidateEmployeeDto candidateEmployee = candidateModifyEmployeeService.getCandidateEmployee(candidateEmployeeNo);

        model.addAttribute("ce", candidateEmployee);

        model.addAttribute("urlName", CANDIDATE_EMPLOYEE_INFO);    // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("title", CANDIDATE_EMPLOYEE_INFO);      // 타이틀 명

        return "potential/candidate/info";
    }

    @GetMapping("/form")
    public String candidateForm(Model model, @AuthenticationPrincipal EmployeePrincipal employee) {

        String employeeCode = employee.getUsername();
        CandidateEmployeeDto candidateEmployeeDto = new CandidateEmployeeDto();

        EmployeeDto employeeDto = new EmployeeDto();
        if (StringUtils.isNotEmpty(employeeCode))
            employeeDto = employeeService.getEmployeeInfoForAddContract(employeeCode, null);
        model.addAttribute("employeeDto", employeeDto);

        List<EmployeeDto> allEmployeeList = employeeCacheService.getAllEmployee();
        employeeService.setDepartmentNameByDepthForEmployeeInfo(allEmployeeList);
        model.addAttribute("allEmployee", allEmployeeList);

        model.addAttribute("fragmentInfoDto", candidateEmployeeDto);

        model.addAttribute("urlName", CANDIDATE_EMPLOYEE_ADD);    // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("title", CANDIDATE_EMPLOYEE_ADD);      // 타이틀 명


        return "potential/candidate/form";
    }

    @PostMapping("/form")
    public String candidateFormAction(CandidateEmployeeDto candidateEmployeeDto) {

        Integer candidateEmployeeNo = candidateModifyEmployeeService.addCandidateEmployee(candidateEmployeeDto);


        return "redirect:/candidate/info?candidateEmployeeNo=" + candidateEmployeeNo;
    }

    @GetMapping("/edit")
    public String candidateEdit(Model model,
                                @RequestParam(name = "candidateEmployeeNo") Integer candidateEmployeeNo) {


        List<EmployeeDto> allEmployeeList = employeeCacheService.getAllEmployee();
        employeeService.setDepartmentNameByDepthForEmployeeInfo(allEmployeeList);

        CandidateEmployeeDto candidateEmployee = candidateModifyEmployeeService.getCandidateEmployee(candidateEmployeeNo);

        model.addAttribute("fragmentInfoDto", candidateEmployee);
        model.addAttribute("allEmployee", allEmployeeList);
        model.addAttribute("ce", candidateEmployee);

        model.addAttribute("urlName", CANDIDATE_EMPLOYEE_EDIT);    // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("title", CANDIDATE_EMPLOYEE_EDIT);      // 타이틀 명

        return "potential/candidate/edit";
    }

    @PutMapping("/edit")
    public String candidateEditAction(CandidateEmployeeDto candidateEmployeeDto) {

        candidateModifyEmployeeService.updateCandidateEmployee(candidateEmployeeDto);


        return "redirect:/candidate/info?candidateEmployeeNo=" + candidateEmployeeDto.getCandidateEmployeeNo();
    }


    /**
     * 핸드폰번호 중복 확인
     *
     * @param mobile
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/isConfirmByMobile", method = RequestMethod.GET)
    public int isConfirmByMobile(@RequestParam(name = "mobile") String mobile) {

        /*MobileHyphenUtil 하이픈 생성*/
        String reMobile = MobileHyphenUtil.mobileHyphen(mobile);

        return candidateEmployeeService.isConfirmByMobile(reMobile);
    }

}
