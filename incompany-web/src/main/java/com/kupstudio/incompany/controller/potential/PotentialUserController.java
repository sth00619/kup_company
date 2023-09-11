package com.kupstudio.incompany.controller.potential;

import com.kupstudio.incompany.cacheService.employee.EmployeeCacheService;
import com.kupstudio.incompany.dao.company.DepartmentMemberMapper;
import com.kupstudio.incompany.dto.AssignDepartmentDto;
import com.kupstudio.incompany.dto.EmployeeDto;
import com.kupstudio.incompany.dto.potential.PotentialUserDto;
import com.kupstudio.incompany.enumClass.PotentialSourceEnum;
import com.kupstudio.incompany.service.EmployeeService;
import com.kupstudio.incompany.service.auth.AuthService;
import com.kupstudio.incompany.service.potential.PotentialUserService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Slf4j
@Controller
@RequestMapping("/potential")
public class PotentialUserController {

    private final String UPDATE_ERROR_MESSAGE = "본인의 고객만 수정 할 수 있습니다.";

    private final String MY_POTENTIAL_TITLE = "나만의 고객추가";

    private final String UPDATE_MY_POTENTIAL_TITLE = "고객수정";

    private final String INFO_TITLE = "고객 상세 정보";

    @Autowired
    PotentialUserService potentialUserService;
    @Autowired
    DepartmentMemberMapper departmentMemberMapper;
    @Autowired
    EmployeeService employeeService;

    @Autowired
    EmployeeCacheService employeeCacheService;
    @Autowired
    AuthService authService;


    @PostMapping("/updatePotentialUser")
    public String updatePotentialUser(@ModelAttribute(value = "potentialUserDto") PotentialUserDto potentialUserDto,
                                      RedirectAttributes reAttr) throws Exception {

        // 본인의 고객이 아닌 경우 처리 하지 않음
        if (!authService.isLoginEmployee(potentialUserDto.getEmployeeCode())) {
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", UPDATE_ERROR_MESSAGE);
            return "redirect:/potential/counseling";
        }
        String urlParam = "?potentialUserNo=" + potentialUserDto.getPotentialUserNo() + "&employeeCode=" + potentialUserDto.getEmployeeCode();
        potentialUserService.updatePotentialUser(potentialUserDto);
        return "redirect:/potential/potentialUserInfo" + urlParam;
    }

    @GetMapping("/updatePotentialUser")
    public String getPotentialUser(Model model,
                                   @RequestParam(value = "potentialUserNo") int potentialUserNo,
                                   @RequestParam(value = "employeeCode") String employeeCode) throws Exception {

        PotentialUserDto potentialUserDto = potentialUserService.getPotentialUser(potentialUserNo);

        String loginEmployeeCode = authService.getEmployeeCode();
        model.addAttribute("loginEmployeeCode", loginEmployeeCode);
        // 본인의 고객이 아닌경우 false
        if (!authService.isLoginEmployee(employeeCode)) model.addAttribute("isMyPotentialUser", false);

        List<EmployeeDto> employeeInfo = employeeService.getEmployeeInfo(employeeCode);
        EmployeeDto employeeInfoDto = employeeInfo.get(0);
        model.addAttribute("employeeInfo", employeeInfoDto);

        List<PotentialSourceEnum> potentialSourceEnumList = PotentialSourceEnum.getAllList();
        model.addAttribute("potentialSourceEnumList", potentialSourceEnumList);

        model.addAttribute("employeeCode", employeeCode);
        model.addAttribute("employeeLoginCode", authService.getEmployeeCode());

        model.addAttribute("fragmentInfoDto", potentialUserDto);
        model.addAttribute("urlName", UPDATE_MY_POTENTIAL_TITLE);
        model.addAttribute("title", UPDATE_MY_POTENTIAL_TITLE);
        return "potential/updatePotentialUser";
    }

    @PostMapping("/addPotentialUser")
    public String addPotentialUser(PotentialUserDto potentialUserDto,
                                   @RequestParam(value = "preRequestUrl", required = false) String preRequestUrl) throws Exception {
        potentialUserService.addPotentialUser(potentialUserDto);
        PotentialUserDto newPotentialUserDto = potentialUserService.getNewPotentialUserByEmployeeCode(authService.getEmployeeCode());
        int newPotentialUserNo = newPotentialUserDto.getPotentialUserNo();

        // 계약관리 > 목돈계약추가 > 고객등록으로 접근하여 고객 등록 시 / 처리 후 목돈계약추가로 이동 + 등록 고객 고객선택에 바로 세팅
        if (StringUtils.isNotEmpty(preRequestUrl))
            return "redirect:" + preRequestUrl + "?potentialUserNo=" + newPotentialUserNo;

        return "redirect:/potential/counseling";
    }

    @GetMapping("/addPotentialUser")
    public String addPotentialUserForm(@RequestParam(value = "preRequestUrl", required = false) String preRequestUrl,
                                       @RequestParam(value = "employeeCode", required = false) String employeeCode,
                                       Model model) throws Exception {

        model.addAttribute("employeeCode", employeeCode);

        /*로그인한 사원코드 & 부서코드*/
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String employeeLoginCode = auth.getName();
        List<AssignDepartmentDto> departmentList = departmentMemberMapper.getDepartmentEmployee(employeeLoginCode);
        String departmentCode = departmentList.get(0).getDepartmentCode();

        List<EmployeeDto> employeeInfo = employeeService.getEmployeeInfo(employeeLoginCode);
        EmployeeDto employeeInfoDto = employeeInfo.get(0);
        PotentialUserDto potentialUserDto = new PotentialUserDto();

        // 이전 페이지 url 정보
        if (StringUtils.isNotEmpty(preRequestUrl)) model.addAttribute("preRequestUrl", preRequestUrl);

        List<PotentialSourceEnum> potentialSourceEnumList = PotentialSourceEnum.getAllList();
        model.addAttribute("potentialSourceEnumList", potentialSourceEnumList);

        // 담당자 정보
        EmployeeDto employeeDto = new EmployeeDto();
        if (StringUtils.isNotEmpty(employeeCode))
            employeeDto = employeeService.getEmployeeInfoForAddContract(employeeCode, 0);
        model.addAttribute("employeeDto", employeeDto);

        // 담당자 검색 리스트
        List<EmployeeDto> allEmployeeList = employeeCacheService.getEmployeeByWorkingStatus(0);
        employeeService.setDepartmentNameByDepthForEmployeeInfo(allEmployeeList);
        model.addAttribute("allEmployee", allEmployeeList);

        model.addAttribute("employeeInfo", employeeInfoDto);
        model.addAttribute("employeeLoginCode", employeeLoginCode);
        model.addAttribute("urlName", MY_POTENTIAL_TITLE);
        model.addAttribute("title", MY_POTENTIAL_TITLE);
        model.addAttribute("departmentCode", departmentCode);
        model.addAttribute("fragmentInfoDto", potentialUserDto);

        return "potential/addPotentialUser";
    }

    @GetMapping("/potentialUserInfo")
    public String potentialUserInfo(@RequestParam(value = "potentialUserNo") int potentialUserNo,
                                    @RequestParam(value = "employeeCode") String employeeCode,
                                    Model model) throws Exception {
        // 고객 정보
        PotentialUserDto potentialUserDto = potentialUserService.getPotentialUser(potentialUserNo);

        // 담당자 정보
        List<EmployeeDto> employeeInfo = employeeService.getEmployeeInfo(employeeCode);
        EmployeeDto employeeInfoDto = employeeInfo.get(0);

        model.addAttribute("potentialUserDto", potentialUserDto);
        model.addAttribute("employeeInfoDto", employeeInfoDto);
        model.addAttribute("urlName", INFO_TITLE);
        model.addAttribute("title", INFO_TITLE);
        model.addAttribute("potentialUserNo", potentialUserNo);
        model.addAttribute("employeeCode", employeeCode);
        return "potential/potentialUserInfo";
    }

    /**
     * 사원의 할당 된 고객 리스트 반환
     *
     * @param employeeCode
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/getPotentialUserListByEmployeeCode", method = RequestMethod.GET)
    public List<PotentialUserDto> getPotentialUserListByEmployeeCode(@RequestParam("employeeCode") String employeeCode) {
        return potentialUserService.getPotentialUserListByEmployeeCode(employeeCode);
    }

    /**
     * 핸드폰번호 중복 확인
     *
     * @param encryptMobile
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/isConfirmByMobile", method = RequestMethod.GET)
    public int isConfirmByMobile(@RequestParam(name = "encryptMobile") String encryptMobile) throws Exception {
        PotentialUserDto potentialUserDto = new PotentialUserDto();
        potentialUserDto.setEncryptMobile(encryptMobile);
        return potentialUserService.isConfirmByMobile(potentialUserDto);
    }


    @ResponseBody
    @GetMapping("/potentialUserInfoJson")
    public PotentialUserDto potentialUserInfoJson(Integer potentialUserNo) throws Exception {

        if (!potentialUserNo.equals(0) && potentialUserNo != null) {

            PotentialUserDto potentialUserDto = potentialUserService.getPotentialUser(potentialUserNo);
            return potentialUserDto;
        }
        return null;

    }

}