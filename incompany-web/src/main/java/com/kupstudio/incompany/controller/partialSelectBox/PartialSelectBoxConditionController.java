package com.kupstudio.incompany.controller.partialSelectBox;

import com.kupstudio.incompany.dto.DepartmentDto;
import com.kupstudio.incompany.dto.partialSelectBox.PartialSelectBoxConditionDto;
import com.kupstudio.incompany.dto.role.EmployeeRoleDto;
import com.kupstudio.incompany.enumClass.AuthNameEnum;
import com.kupstudio.incompany.service.department.DepartmentSearchService;
import com.kupstudio.incompany.service.partialSelectBox.PartialSelectBoxConditionService;
import com.kupstudio.incompany.service.role.EmployeeRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/partialSelectBox")
@RequiredArgsConstructor
public class PartialSelectBoxConditionController {

    private final DepartmentSearchService departmentSearchService;

    private final PartialSelectBoxConditionService partialSelectBoxConditionService;

    private final EmployeeRoleService employeeRoleService;

    private final int SALES_DEPARTMENT_CODE_DEPTH = 2;

    @GetMapping("/condition")
    public String getPartialSelectBoxCondition(Model model, String employeeCode) {

        // 지점만 추가 가능
        List<DepartmentDto> twoDepthDepartmentList = departmentSearchService.getDepthDepartmentCode(SALES_DEPARTMENT_CODE_DEPTH);
        PartialSelectBoxConditionDto partialSelectBoxConditionDto = partialSelectBoxConditionService.getPartialSelectBoxCondition(employeeCode);

        boolean isNew = ObjectUtils.isEmpty(partialSelectBoxConditionDto);

        model.addAttribute("departmentList", twoDepthDepartmentList);
        model.addAttribute("partialSelectBoxCondition", partialSelectBoxConditionDto);
        model.addAttribute("employeeCode", employeeCode);
        model.addAttribute("isNew", isNew);

        return "partialSelectBox/condition";
    }


    @ResponseBody
    @PostMapping("/condition")
    public String insertPartialSelectBoxCondition(@ModelAttribute(value = "partialSelectBoxConditionDto") PartialSelectBoxConditionDto partialSelectBoxConditionDto) {

        List<EmployeeRoleDto> employeeRoleList = employeeRoleService.getEmployeeRoleListByEmployeeCode(partialSelectBoxConditionDto.getEmployeeCode());
        for (EmployeeRoleDto employeeRole : employeeRoleList) {
            if (employeeRole.getRole().equals(AuthNameEnum.PARTIAL_SELECT_BOX.meaning)) {

                partialSelectBoxConditionService.insertPartialSelectBoxCondition(partialSelectBoxConditionDto);


                return "";
            }
        }

        return "선택한 사원은 권한이 없습니다.";
    }

    @ResponseBody
    @PutMapping("/condition")
    public String updatePartialSelectBoxCondition(@ModelAttribute(value = "partialSelectBoxConditionDto") PartialSelectBoxConditionDto partialSelectBoxConditionDto) {

        List<EmployeeRoleDto> employeeRoleList = employeeRoleService.getEmployeeRoleListByEmployeeCode(partialSelectBoxConditionDto.getEmployeeCode());
        for (EmployeeRoleDto employeeRole : employeeRoleList) {
            if (employeeRole.getRole().equals(AuthNameEnum.PARTIAL_SELECT_BOX.meaning)) {

                partialSelectBoxConditionService.updatePartialSelectBoxCondition(partialSelectBoxConditionDto);

                return "";
            }
        }

        return "선택한 사원은 권한이 없습니다.";
    }
}
