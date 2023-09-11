package com.kupstudio.incompany.controller.role;

import com.kupstudio.incompany.cacheService.department.DepartmentCacheService;
import com.kupstudio.incompany.cacheService.employee.EmployeeCacheService;
import com.kupstudio.incompany.dto.role.EmployeeRoleDto;
import com.kupstudio.incompany.enumClass.AuthNameEnum;
import com.kupstudio.incompany.service.auth.AuthService;
import com.kupstudio.incompany.service.role.EmployeeRoleAndAppendixUpdateService;
import com.kupstudio.incompany.service.role.EmployeeRoleService;
import io.micrometer.core.instrument.util.StringUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/role")
@RequiredArgsConstructor
public class EmployeeRoleController {

    private final EmployeeCacheService employeeCacheService;

    private final DepartmentCacheService departmentCacheService;

    private final EmployeeRoleAndAppendixUpdateService employeeRoleAndAppendixUpdateService;
    private final AuthService authService;

    private final EmployeeRoleService employeeRoleService;
    private final String NOT_AUTH_MESSAGE = "권한이 없습니다.";

    @GetMapping("/form")
    public String updateRoleForm(Model model, RedirectAttributes reAttr) {
        // 접근 권한 체크 > false -> 홈 화면 이동
        if (!authService.hasAuth(AuthNameEnum.ROOT_ADMIN)) {
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", NOT_AUTH_MESSAGE);
            return "redirect:/index";
        }
        model.addAttribute("allDepartment", departmentCacheService.getAllDepartmentList());
        model.addAttribute("allEmployee", employeeCacheService.getAllEmployee());
        return "role/form";
    }

    @ResponseBody
    @PostMapping("/form")
    public String updateRole(String key, String value, RedirectAttributes reAttr) throws Exception {
        // 접근 권한 체크 > false -> 홈 화면 이동
        if (!authService.hasAuth(AuthNameEnum.ROOT_ADMIN)) {
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", NOT_AUTH_MESSAGE);
            return "redirect:/index";
        }

        return employeeRoleAndAppendixUpdateService.updateRole(key, value);

    }


    @GetMapping("/list")
    public String getEmployeeRoleByName(Model model, @RequestParam(required = false) String role) {

        List<AuthNameEnum> authNameList = AuthNameEnum.getALlAuthNameEnumList();

        if (StringUtils.isNotEmpty(role)) {

            List<EmployeeRoleDto> employeeList = employeeRoleService.getEmployeeListByRoleName(role);
            model.addAttribute("employeeList", employeeList);
        }

        model.addAttribute("authNameList", authNameList);
        model.addAttribute("selectRole", role);

        return "role/list";
    }

}
