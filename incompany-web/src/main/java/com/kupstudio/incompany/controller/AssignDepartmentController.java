package com.kupstudio.incompany.controller;

import com.kupstudio.incompany.dto.AssignDepartmentDto;
import com.kupstudio.incompany.service.AssignDepartmentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@Controller
public class AssignDepartmentController {

    @Autowired
    private AssignDepartmentService assignDepartmentService;

    // 부서배치 화면 전환 및 사원 전체 조회, 해당 부서 사원 체크 true / false
    @GetMapping("/assignDepartment")
    public String assignDepartment(Model model, @RequestParam(value = "departmentCode") String departmentCode) {

        List<AssignDepartmentDto> getAssignDepartment = assignDepartmentService.getAssignDepartment(departmentCode);

        model.addAttribute("getAssignDepartment", getAssignDepartment);
        model.addAttribute("departmentCode", departmentCode);
        return "companyChart/assignDepartment";
    }

    // 사원 체크 시 Ajax
    @ResponseBody
    @RequestMapping(value = "/addAssignDepartment", method = RequestMethod.GET)
    public int addAssignDepartment(@RequestParam(name = "departmentCode") String departmentCode,
                                   @RequestParam(name = "employeeCode") String employeeCode) {

        int result = assignDepartmentService.addAssignDepartment(departmentCode, employeeCode);
        return result;
    }

    // 사원 체크 해제 시 Ajax
    @ResponseBody
    @RequestMapping(value = "/deleteAssignDepartment", method = RequestMethod.GET)
    public int deleteAssignDepartment(@RequestParam(name = "departmentCode") String departmentCode,
                                      @RequestParam(name = "employeeCode") String employeeCode) {

        int result = assignDepartmentService.deleteAssignDepartment(departmentCode, employeeCode);
        return result;
    }
}
