package com.kupstudio.incompany.controller;

import com.kupstudio.incompany.cacheService.company.CompanyCacheService;
import com.kupstudio.incompany.config.CommonEncryptConfig;
import com.kupstudio.incompany.dto.*;
import com.kupstudio.incompany.dto.vacation.VacationDto;
import com.kupstudio.incompany.enumClass.AuthNameEnum;
import com.kupstudio.incompany.enumClass.department.SalesDepartmentEnum;
import com.kupstudio.incompany.mail.EmailService;
import com.kupstudio.incompany.security.EmployeePrincipal;
import com.kupstudio.incompany.service.CompanyChartService;
import com.kupstudio.incompany.service.CompanyPositionService;
import com.kupstudio.incompany.service.DepartmentService;
import com.kupstudio.incompany.service.EmployeeService;
import com.kupstudio.incompany.service.auth.AuthService;
import com.kupstudio.incompany.service.department.DepartmentSearchService;
import com.kupstudio.incompany.service.email.CompanyEmailService;
import com.kupstudio.incompany.service.employee.EmployeeSearchService;
import com.kupstudio.incompany.service.schedule.CalendarFromScheduleService;
import com.kupstudio.incompany.service.vacation.VacationService;
import com.kupstudio.incompany.util.DepartmentCodeUtil;
import com.kupstudio.incompany.util.StringCustomUtil;
import io.micrometer.core.instrument.util.StringUtils;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.map.HashedMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Controller
@AllArgsConstructor
@RequestMapping("/companyChart")
public class EmployeeController {

    public static final int DEPTH_ONE = 1;
    private static final String IS_NOT_AUTH_MESSAGE = "권한이 없습니다. \n담당자에게 문의하세요.";
    private static final String IS_DUPLICATE_EMAIL = "이미 사용중인 이메일입니다. \n다른 이메일 주소를 사용해주세요.";
    private static final String DEFAULT_EMAIL_PASSWORD = "$2a$10$MMW9zOqJVkk8Ix2Uyl7pfuB.kNN.sX/J2K.PLjeV6mCiiE9l5XJvK";
    private final CompanyCacheService companyCacheService;
    @Autowired
    private EmployeeService employeeService;
    private EmailService emailService;
    private CompanyEmailService companyEmailService;
    private CompanyPositionService companyPositionService;
    private CompanyChartService companyChartService;
    private DepartmentService departmentService;
    private AuthService authService;
    private CalendarFromScheduleService calendarService;
    private DepartmentSearchService departmentSearchService;
    private EmployeeSearchService employeeSearchService;
    private VacationService vacationService;

    /**
     * 사원 추가 시 사원코드 중복체크 ajax
     */
    @ResponseBody
    @RequestMapping(value = "/isAddEmployeeCode", method = RequestMethod.GET)
    public int isAddEmployeeCode(@RequestParam(name = "employeeCode") String employeeCode) {
        return employeeService.isAddEmployeeCode(employeeCode);
    }


    /**
     * 사내 이메일 계정 연동 시 중복 확인
     */
    @RequestMapping(value = "/checkCompanyEmail", method = RequestMethod.GET)
    @ResponseBody
    public int checkCompanyEmail(@RequestParam String companyEmailId, @RequestParam String companyEmailForm) {
        String companyEmail = companyEmailId + "@" + companyEmailForm;
        return companyEmailService.isConfirmByCompanyEmail(companyEmail);
    }

    @PostMapping("/addEmployee")
    @Transactional(propagation = Propagation.REQUIRED)
    public String addEmployee(RedirectAttributes reAttr,
                              @ModelAttribute(value = "employeeDto") EmployeeDto employeeDto,
                              @ModelAttribute(value = "departmentDto") DepartmentDto departmentDto) throws Exception {
        if (!authService.hasAuth(AuthNameEnum.COMPANY_EMPLOYEE_ADD)) {
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", IS_NOT_AUTH_MESSAGE);
            return "redirect:/companyChart";
        }

        String employeeCode = employeeDto.getEmployeeCode();

        if (StringUtils.isNotEmpty(employeeDto.getCompanyEmailId())) {
            String companyEmail = employeeDto.getCompanyEmailId() + "@" + employeeDto.getCompanyEmailForm();
            int companyEmailCheckResult = checkCompanyEmail(employeeDto.getCompanyEmailId(), employeeDto.getCompanyEmailForm());
            if (companyEmailCheckResult > 0) {
                reAttr.addAttribute("isSuccess", false);
                reAttr.addAttribute("message", IS_DUPLICATE_EMAIL);
            } else {
                companyEmailService.insertCompanyEmail(employeeDto.getEmployeeCode(), companyEmail, DEFAULT_EMAIL_PASSWORD);
                employeeDto.setCompanyEmail(companyEmail);
            }
        }


        String thisYear = StringCustomUtil.getToday().substring(0, 4);

        // 휴가 정보 Default 세팅
        VacationDto vacationDto = new VacationDto();
        vacationDto.setEmployeeCode(employeeCode);
        vacationDto.setYear(thisYear);
        vacationService.addVacation(vacationDto);

        if (!ObjectUtils.isEmpty(departmentDto)) {
            String departmentCode = departmentDto.getDepartmentCode();
            if (StringUtils.isNotEmpty(departmentCode)) {
                String get1D1Id = DepartmentCodeUtil.getDepthString(departmentCode, DEPTH_ONE);

                if (SalesDepartmentEnum.isSalesDepartment(get1D1Id)) {
                    calendarService.addDefaultCalendar(employeeCode);

                }
            }
        }
        employeeService.addEmployee(employeeDto, departmentDto);

        return "redirect:/companyChart/employeeInfo?employeeCode=" + employeeCode;
    }


    @GetMapping("/addEmployee")
    public String addEmployeeForm(Model model, RedirectAttributes reAttr,
                                  @RequestParam(value = "companyCode", required = false) String companyCode,
                                  @RequestParam(value = "departmentCode", required = false) String departmentCode) {
        /*로그인한 사원코드 추출*/
        String employeeLoginCode = authService.getEmployeeCode();
        model.addAttribute("employeeLoginCode", employeeLoginCode);

        if (!authService.hasAuth(AuthNameEnum.COMPANY_EMPLOYEE_ADD)) {
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", IS_NOT_AUTH_MESSAGE);
            return "redirect:/companyChart";
        }
        departmentCode = authService.getDepartmentCode();

        // 부서 리스트
        List<CompanyChartDto> oneDepthList = companyChartService.getDepartmentOneDepth(companyCode, departmentCode);
        //법인 리스트
        List<CompanyChartDto> companyList = companyCacheService.getAllCompanyList();
        // 직급 리스트
        List<CompanyPositionDto> companyPositionList = companyPositionService.getCompanyPositionSelect();

        EmployeeDto employeeDto = new EmployeeDto();

        model.addAttribute("companyPositionList", companyPositionList);
        model.addAttribute("urlName", "사원 추가");
        model.addAttribute("title", "사원 추가");
        model.addAttribute("oneDepthList", oneDepthList);
        model.addAttribute("companyList", companyList);
        model.addAttribute("fragmentInfoDto", employeeDto);
        return "companyChart/addEmployee";
    }

    @PostMapping("/updateEmployee")
    @Transactional(propagation = Propagation.REQUIRED)
    public String updateEmployee(@ModelAttribute(value = "employeeDto") EmployeeDto employeeDto,
                                 @AuthenticationPrincipal EmployeePrincipal employee,
                                 RedirectAttributes reAttr) throws Exception {
        String redirect = "redirect:/companyChart/employeeInfo";
        String employeeCode = employeeDto.getEmployeeCode();
        reAttr.addAttribute("employeeCode", employeeCode);

        if (!authService.hasAuth(AuthNameEnum.COMPANY_EMPLOYEE_UPDATE) && !authService.isLoginEmployee(employeeCode)) {
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", IS_NOT_AUTH_MESSAGE);
            return redirect;
        }

        String email = employeeDto.getEmailId() + "@" + employeeDto.getEmailForm();
        String prevEmail = employeeService.getEmployeeInfoDto(employeeDto.getEmployeeCode()).getEmailId() + "@" + employeeService.getEmployeeInfoDto(employeeDto.getEmployeeCode()).getEmailForm();
        if (email == prevEmail) {
            employeeDto.setEmail(prevEmail);
        }

        String companyEmail = employeeDto.getCompanyEmailId() + "@" + employeeDto.getCompanyEmailForm();
        String prevCompanyEmail = employeeService.getEmployeeInfoDto(employeeDto.getEmployeeCode()).getCompanyEmail();

        // 도메인이 kupstudio인 경우
        if (companyEmail.contains("kupstudio")) {
            companyEmail = employeeDto.getCompanyEmailId() + "@" + employeeDto.getCompanyEmailForm();
            prevCompanyEmail = employeeService.getEmployeeInfoDto(employeeDto.getEmployeeCode()).getCompanyEmail();
            String password = employee.getPassword();
            // companyEmailId 값이 있는 경우
            if (StringUtils.isNotEmpty(employeeDto.getCompanyEmailId())) {
                // 사내 이메일을 변경했을 때
                if (!companyEmail.equals(prevCompanyEmail)) {
                    int companyEmailCheckResult = checkCompanyEmail(employeeDto.getCompanyEmailId(), employeeDto.getCompanyEmailForm());
                    // 이미 존재하는 이메일인 경우(사용 불가)
                    if (companyEmailCheckResult > 0) {
                        reAttr.addAttribute("isSuccess", false);
                        reAttr.addAttribute("message", IS_DUPLICATE_EMAIL);
                        return redirect;
                        // 존재하지 않는 이메일(사용가능한 이메일)
                    } else {
                        companyEmailService.insertCompanyEmail(employeeDto.getEmployeeCode(), companyEmail, password);
                        employeeDto.setCompanyEmail(companyEmail);
                    }
                    // 사내 이메일 변경 사항 없을 때 중복 체크 없이 진행(사내 이메일 있음, 변경 X)
                } else {
                    employeeDto.setCompanyEmail(prevCompanyEmail);
                    employeeDto.setPassword(password);
                }
            }
        }

        // 사원 정보에서 사내 이메일이 변경된 경우(추가, 수정)
        String password = employee.getPassword();
        employeeService.updateEmployee(employeeDto);
        companyEmailService.updateCompanyPassword(employeeCode, password);

        return redirect;

    }

    @GetMapping("/updateEmployee")
    public String updateEmployee(Model model,
                                 RedirectAttributes reAttr,
                                 @RequestParam(value = "employeeCode") String employeeCode,
                                 @RequestParam(value = "companyCode", required = false) String companyCode,
                                 @RequestParam(value = "departmentCode", required = false) String departmentCode) throws Exception {
        if (!authService.hasAuth(AuthNameEnum.COMPANY_EMPLOYEE_UPDATE) && !authService.isLoginEmployee(employeeCode)) {
            reAttr.addAttribute("employeeCode", employeeCode);
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", IS_NOT_AUTH_MESSAGE);
            return "redirect:/companyChart/employeeInfo";
        }

        /*로그인한 사원 코드 추출*/
        String employeeLoginCode = authService.getEmployeeCode();
        model.addAttribute("employeeLoginCode", employeeLoginCode);

        // 직급
        List<CompanyPositionDto> companyPositionList = companyPositionService.getCompanyPositionSelect();

        // 법인 리스트
        List<CompanyChartDto> companyList = companyCacheService.getAllCompanyList();

        // 사원 정보
        EmployeeDto employeeDto = employeeService.getEmployeeInfoDto(employeeCode);
        String getDepartmentCode = employeeDto.getDepartmentCode();
        companyCode = companyCode == null ? employeeDto.getCompanyCode() : companyCode;
        String companyEmail = employeeDto.getCompanyEmail();
        if (companyEmail != null && !companyEmail.isEmpty()) {
            String companyEmailId = companyEmail.substring(0, companyEmail.indexOf("@"));
            String companyEmailForm = companyEmail.substring(companyEmail.indexOf("@") + 1);
            employeeDto.setCompanyEmailId(companyEmailId);
            employeeDto.setCompanyEmailForm(companyEmailForm);
        }

        // 소속 세팅
        Map<String, Object> departmentInfoMap = departmentService.getDepartmentInfoList(getDepartmentCode, companyCode);

        if (StringUtils.isNotEmpty(employeeDto.getMobile())) {
            String decryptedMobile = CommonEncryptConfig.decryptAes(employeeDto.getMobile(), CommonEncryptConfig.ENCRYPT_KEY);
            employeeDto.setMobile(decryptedMobile);
        }

        model.addAttribute("getDepartmentCode", getDepartmentCode);
        model.addAttribute("departmentInfoMap", departmentInfoMap);
        model.addAttribute("companyPositionList", companyPositionList);
        model.addAttribute("urlName", "사원정보수정");
        model.addAttribute("title", "사원정보수정");
        model.addAttribute("employeeDto", employeeDto);
        model.addAttribute("fragmentInfoDto", employeeDto);
        model.addAttribute("companyList", companyList);
        return "companyChart/updateEmployee";
    }

    @GetMapping("/employeeInfo")
    public String employeeInfo(@RequestParam(value = "employeeCode") String employeeCode,
                               @RequestParam(value = "searchKey", required = false) String searchKey,
                               @RequestParam(value = "searchValue", required = false) String searchValue,
                               @RequestParam(value = "isSuccess", required = false) Boolean isSuccess,
                               @RequestParam(value = "message", required = false) String message,
                               Model model) throws Exception {

        List<EmployeeDto> employeeList = employeeService.getEmployeeInfo(employeeCode);

        //select 부서 리스트 조회
        EmployeeDto employeeDto = employeeList.get(0);
        String departmentCode = employeeDto.getDepartmentCode();
        List<String> departmentCodeInfo = DepartmentCodeUtil.getInfo(departmentCode);

        Map<String, Object> departmentInfo = new HashedMap();
        for (int i = 0; i < departmentCodeInfo.size(); i++) {
            DepartmentDto departmentList = departmentSearchService.getDepartment(departmentCodeInfo.get(i));
            String key = "departmentInfo" + (i + 1);
            departmentInfo.put(key, departmentList);
        }

        model.addAttribute("departmentCode", departmentCode);
        model.addAttribute("departmentInfo", departmentInfo);
        model.addAttribute("title", "사원 정보");
        model.addAttribute("urlName", "사원 정보");
        model.addAttribute("employeeList", employeeList);
        model.addAttribute("employeeLoginCode", authService.getEmployeeCode());
        model.addAttribute("searchKey", searchKey);
        model.addAttribute("searchValue", searchValue);
        model.addAttribute("isSuccess", isSuccess);
        model.addAttribute("message", message);
        return "companyChart/employeeInfo";
    }


    @RequestMapping(value = "/emailCheck", method = RequestMethod.GET)
    @ResponseBody
    public void sendEmail(@RequestParam(value = "email") String email
            , @RequestParam(value = "employeeCode") String employeeCode) throws Exception {
        emailService.sendMail(employeeCode, email);
    }

    /**
     * <p>
     * 부서이하 모든 사원 리스트 조회 - 직급 조건 추가 가능(선택)
     * 1뎁스 하위 부서 리스트 조회
     * </p>
     *
     * @param departmentCode
     * @param positionCode
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "getEmployeeByDepartmentOrPosition")
    public Map<String, Object> getEmployeeByDepartmentOrPosition(@RequestParam(value = "departmentCode") String departmentCode,
                                                                 @RequestParam(value = "positionCode", required = false) Integer positionCode) {
        Map<String, Object> resultMap = new HashMap<>();

        // 부서이하 모든 사원 리스트 조회 - 직급 조건 추가 가능(선택)
        List<EmployeeDto> employeeList = employeeService.getEmployeeByDepartmentOrPosition(departmentCode, positionCode);
        resultMap.put("employeeList", employeeList);

        // 1뎁스 하위 부서 조회
        List<DepartmentDto> departmentList = departmentService.getChildDepartment(departmentCode);
        resultMap.put("departmentList", departmentList);
        return resultMap;
    }

    //  사원코드로 사원찾기
    @ResponseBody
    @GetMapping("/searchEmployeeByCode")
    public List<EmployeeProfileDto> searchEmployeeByCode(@RequestParam String searchEmployee) {

        return employeeService.searchEmployeeByCode(searchEmployee);
    }

    // 이름으로 사원찾기
    @ResponseBody
    @GetMapping("/searchEmployeeByName")
    public List<EmployeeProfileDto> searchEmployeeByName(@RequestParam String searchEmployee) {
        return employeeService.searchEmployeeByName(searchEmployee);
    }

    @ResponseBody
    @RequestMapping(value = "/getEmployeeInfoForContractFortune", method = RequestMethod.GET)
    public EmployeeDto getEmployeeInfoForContractFortune(@RequestParam(value = "employeeCode") String employeeCode) {
        return employeeService.getEmployeeInfoForContractFortune(employeeCode);
    }

    @ResponseBody
    @RequestMapping(value = "/getEmployeeInfoForAddContract", method = RequestMethod.GET)
    public EmployeeDto getEmployeeInfoForAddContract(@RequestParam(value = "employeeCode") String employeeCode) {
        return employeeService.getEmployeeInfoForAddContract(employeeCode, null);
    }

    @ResponseBody
    @PostMapping("/imageUrl")
    public void updateEmployeeImage(MultipartFile uploadFile,
                                    String imageUrl,
                                    @AuthenticationPrincipal EmployeePrincipal employee) {

        employeeService.updateEmployeeImg(uploadFile, imageUrl, employee.getUsername());
    }

    @ResponseBody
    @GetMapping("/exists")
    public boolean existsEmployee(String employeeCode) {
        return employeeSearchService.existsEmployee(employeeCode);
    }


}