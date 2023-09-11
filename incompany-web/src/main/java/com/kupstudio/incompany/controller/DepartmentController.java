package com.kupstudio.incompany.controller;

import com.kupstudio.incompany.dao.company.DepartmentMemberMapper;
import com.kupstudio.incompany.dto.AssignDepartmentDto;
import com.kupstudio.incompany.dto.DepartmentDto;
import com.kupstudio.incompany.enumClass.AuthNameEnum;
import com.kupstudio.incompany.service.CompanyChartService;
import com.kupstudio.incompany.service.DepartmentService;
import com.kupstudio.incompany.service.auth.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Controller
@RequestMapping("/departments/**")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;
    private final CompanyChartService companyChartService;
    private final AuthService authService;
    private final int DEPARTMENT_MAX_LENGTH = 7;

    // 0 = 근무자, 1 = 퇴사자, 2 = 전체 조회
    private Integer resign = 0;

    @Autowired
    private DepartmentMemberMapper employeeService;

    @ResponseBody
    @PutMapping("/update")
    public void updateDepartment(DepartmentDto departmentDto) {

        if (!authService.hasAuth(AuthNameEnum.COMPANY_GROUP_UPDATE)) return;

        String updateCode = departmentDto.getUpdateCode();
        if (updateCode.length() > DEPARTMENT_MAX_LENGTH) {
            companyChartService.updateCompany(departmentDto);
        } else {
            departmentService.updateDepartment(departmentDto);
        }
    }

    @ResponseBody
    @PostMapping("/addSub")
    public String addDepartmentSub(DepartmentDto departmentDto) {
        String departmentCode = departmentDto.getDepartmentCode();
        if (!authService.hasAuth(AuthNameEnum.COMPANY_GROUP_ADD)) return departmentCode;
        departmentService.insertDepartmentSub(departmentDto);
        return departmentCode;
    }

    @ResponseBody
    @DeleteMapping("/delete")
    public String deleteDepartmentUpper(String departmentCode) {
        String parentDepartmentCode = departmentCode.substring(0, departmentCode.length() - 2);
        if (!authService.hasAuth(AuthNameEnum.COMPANY_GROUP_UPDATE)) return parentDepartmentCode;
        departmentService.deleteDepartment(departmentCode);
        return parentDepartmentCode;
    }

    @ResponseBody
    @RequestMapping(value = "getChildDepartment", method = RequestMethod.GET)
    public Map<String, Object> getChildDepartment(@RequestParam(value = "departmentCode") String departmentCode,
                                                  @RequestParam(value = "departmentName", required = false) String departmentName) {
        Map<String, Object> resultMap = new HashMap<>();

        List<DepartmentDto> childDepartmentList = new ArrayList<>();
        List<AssignDepartmentDto> employeeList = new ArrayList<>();

        try {
            if (StringUtils.isNotEmpty(departmentName)) {
                childDepartmentList = departmentService.getChildDepartmentByName(departmentCode, departmentName);
            } else {
                // 하위 부서
                childDepartmentList = departmentService.getChildDepartment(departmentCode);
            }
            // 담당 부서 선택 시 하위 담당자 조회
            employeeList = employeeService.getEmployeeDepartment(departmentCode, resign);
        } catch (Exception e) {
            log.info("error message : {}", e.getMessage());
        }

        resultMap.put("childDepartmentList", childDepartmentList);
        resultMap.put("employeeList", employeeList);

        return resultMap;
    }

    @ResponseBody
    @RequestMapping(value = "getChildDepartmentByResign")
    public Map<String, Object> getChildDepartmentByResign(@RequestParam(value = "departmentCode") String departmentCode,
                                                          @RequestParam(value = "departmentName", required = false) String departmentName,
                                                          @RequestParam(value = "isResign") Integer isResign) {
        this.resign = isResign;
        return getChildDepartment(departmentCode, departmentName);
    }

    @ResponseBody
    @GetMapping("/getDepartmentName")
    public Map<String, String> getDepartmentNameByDepartmentCode(String departmentCode) {
        Map<String, String> department = departmentService.getDepartmentName(departmentCode);

        return department;
    }
}