package com.kupstudio.incompany.controller.role;

import com.kupstudio.incompany.cacheService.employee.EmployeeCacheService;
import com.kupstudio.incompany.dto.EmployeeDto;
import com.kupstudio.incompany.dto.role.EmployeeRoleAppendixDto;
import com.kupstudio.incompany.enumClass.AuthNameEnum;
import com.kupstudio.incompany.enumClass.PositionEnum;
import com.kupstudio.incompany.service.EmployeeService;
import com.kupstudio.incompany.service.auth.AuthService;
import com.kupstudio.incompany.service.role.EmployeeRoleAppendixModifyService;
import com.kupstudio.incompany.service.role.EmployeeRoleAppendixService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/roleAppendix")
@RequiredArgsConstructor
public class EmployeeRoleAppendixController {

    private final EmployeeRoleAppendixService employeeRoleAppendixService;
    private final EmployeeRoleAppendixModifyService employeeRoleAppendixModifyService;
    private final EmployeeCacheService employeeCacheService;
    private final EmployeeService employeeService;
    private final AuthService authService;
    private final String NOT_AUTH_MESSAGE = "권한이 없습니다.";

    @GetMapping("/form")
    public String roleForm(Model model, RedirectAttributes reAttr,
                           @RequestParam(value = "employeeCode", required = false) String employeeCode) throws Exception {
        // 접근 권한 체크 > false -> 홈 화면 이동
        if(!authService.hasAuth(AuthNameEnum.ROOT_ADMIN)) {
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", NOT_AUTH_MESSAGE);
            return "redirect:/index";
        }

        if (StringUtils.isEmpty(employeeCode)) {
            model.addAttribute("allEmployee", employeeCacheService.getAllEmployee());
            return "roleAppendix/form";
        }
        List<EmployeeDto> employeeInfoList = employeeService.getEmployeeInfo(employeeCode);
        if (ObjectUtils.isEmpty(employeeInfoList.get(0))) {
            model.addAttribute("message", "등록되지 않은 사원입니다");
            model.addAttribute("allEmployee", employeeCacheService.getAllEmployee());
            return "roleAppendix/form";
        }

        List<AuthNameEnum> allAuthEnumList = AuthNameEnum.getALlAuthNameEnumList();
        List<EmployeeRoleAppendixDto> employeeRoleAppendixList = employeeRoleAppendixService.getEmployeeRoleAppendixListByEmployeeCode(employeeCode);
        int employeePositionCode = employeeInfoList.get(0).getPositionCode();
        String employeePositionName = PositionEnum.getPositionEnum(employeePositionCode).getPositionName();
        List<AuthNameEnum> positionAuthNameList = AuthNameEnum.getAuthNameEnumByPosition(employeePositionCode);


        model.addAttribute("allAuthEnumList", allAuthEnumList);
        model.addAttribute("employeeRoleAppendixList", employeeRoleAppendixList);
        model.addAttribute("employeeCode", employeeCode);
        model.addAttribute("positionAuthNameList", positionAuthNameList);
        model.addAttribute("employeePositionName", employeePositionName);
        model.addAttribute("allEmployee", employeeCacheService.getAllEmployee());

        return "roleAppendix/form";
    }


    @ResponseBody
    @PostMapping("/form")
    public String modifyRole(String employeeCode, RedirectAttributes reAttr,
                             @RequestParam(value = "checkArray[]", required = false) List<String> role) throws Exception {
        // 접근 권한 체크 > false -> 홈 화면 이동
        if(!authService.hasAuth(AuthNameEnum.ROOT_ADMIN)) {
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", NOT_AUTH_MESSAGE);
            return "redirect:/index";
        }
        employeeRoleAppendixModifyService.modifyRole(employeeCode, role);
        return "roleAppendix/form";
    }
}
