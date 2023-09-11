package com.kupstudio.incompany.controller.worksheet;

import com.github.pagehelper.PageInfo;
import com.kupstudio.incompany.cacheService.employee.EmployeeCacheService;
import com.kupstudio.incompany.dto.CompanyChartDto;
import com.kupstudio.incompany.dto.document.WriteFormatDto;
import com.kupstudio.incompany.dto.worksheet.MyProjectDto;
import com.kupstudio.incompany.dto.worksheet.ProjectDto;
import com.kupstudio.incompany.dto.worksheet.RequestDto;
import com.kupstudio.incompany.enumClass.BoardTypeEnum;
import com.kupstudio.incompany.enumClass.ContentsCateEnum;
import com.kupstudio.incompany.security.EmployeePrincipal;
import com.kupstudio.incompany.service.CompanyChartService;
import com.kupstudio.incompany.service.DepartmentSelectService;
import com.kupstudio.incompany.service.document.WorkLogService;
import com.kupstudio.incompany.service.notification.NotificationService;
import com.kupstudio.incompany.service.worksheet.ProjectService;
import com.kupstudio.incompany.util.PageInfoUtil;
import io.micrometer.core.instrument.util.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/worksheet/project")
public class ProjectController {


    private final String DEPARTMENT_CODE_DEFAULT = "D";
    private final ProjectService projectService;
    private final CompanyChartService companyChartService;
    private final DepartmentSelectService departmentSelectService;
    private final EmployeeCacheService employeeCacheService;
    private final WorkLogService workLogService;
    private final NotificationService notificationService;


    private final String DEFAULT_PAGE_STR = "1";

    private final String PROJECT_TITLE = "프로젝트";
    private final String PROJECT_CONTENT_TITLE = "프로젝트 정보";
    private final String PROJECT_ADD_TITLE = "프로젝트 작성하기";
    private final String PROJECT_EDIT_TITLE = "프로젝트 수정하기";
    private final int COUNT_PER_PAGE = 10;   // 화면에 노출시킬 리스트 개수 (페이지 개수x)


    @SneakyThrows
    @GetMapping("/list")
    public String getProjectList(Model model,
                                 @RequestParam(value = "departmentCode", required = false, defaultValue = DEPARTMENT_CODE_DEFAULT) String departmentCode,
                                 @AuthenticationPrincipal EmployeePrincipal employee,
                                 @RequestParam(required = false) String employeeCode,
                                 @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum,
                                 @RequestParam(required = false) String searchType,
                                 @RequestParam(required = false) Integer state,
                                 @RequestParam(required = false) String keyword) {

        String employeeLoginCode = employee.getUsername();
        String companyCode = employee.getCompanyCode();
        PageInfo<ProjectDto> projectList;

        model.addAttribute("selectEmployeeCode", employeeCode);

        List<CompanyChartDto> getDepartmentOneDepth = companyChartService.getDepartmentOneDepth(companyCode, DEPARTMENT_CODE_DEFAULT);
        Map<String, Object> selectDepartmentMap = departmentSelectService.getSelectDepartment(departmentCode);


        if (departmentCode.equals(DEPARTMENT_CODE_DEFAULT)) {
            // 부서선택 X
            // 부서 선택 안되어있을때 로그인한사람으로 리스트출력
            projectList = PageInfo.of(projectService.loginProjectList(employeeLoginCode, pageNum, searchType, keyword, state), COUNT_PER_PAGE); //한 페이지 당 게시글 조회;
            projectList = PageInfoUtil.setPageNation(projectList, pageNum, COUNT_PER_PAGE);
            model.addAttribute("employeeCode", employeeLoginCode);

        } else {
            //부서선택 O
            Boolean isEmployeeEmpty;

            if (StringUtils.isEmpty(employeeCode)) {
                // 부서는 선택했는데 작성자를 선택 안했을때
                isEmployeeEmpty = true;
                employeeCode = employeeLoginCode;
                model.addAttribute("employeeCode", employeeLoginCode);
            } else {
                //부서, 작성자 둘다 선택
                isEmployeeEmpty = false;
                model.addAttribute("employeeCode", employeeCode);
            }


            projectList = PageInfo.of(projectService.selectProjectList(isEmployeeEmpty, employeeCode, pageNum, searchType, keyword, departmentCode, state), COUNT_PER_PAGE); //한 페이지 당 게시글 조회;
            projectList = PageInfoUtil.setPageNation(projectList, pageNum, COUNT_PER_PAGE);

        }
        model.addAttribute("allEmployee", employeeCacheService.getAllEmployee());
        model.addAttribute("departmentCode", departmentCode);
        model.addAttribute("getDepartmentOneDepth", getDepartmentOneDepth);
        model.addAttribute("selectDepartmentMap", selectDepartmentMap);
        model.addAttribute("employeeLoginCode", employeeLoginCode);

        model.addAttribute("searchType", searchType);
        model.addAttribute("keyword", keyword);

        model.addAttribute("pageNum", pageNum);
        model.addAttribute("pageList", projectList);
        model.addAttribute("projectList", projectList);
        model.addAttribute("urlName", PROJECT_TITLE);
        model.addAttribute("title", PROJECT_TITLE);
        model.addAttribute("state", state);


        return "worksheet/project/list";
    }

    @GetMapping("/form")
    public String addProjectForm(Model model, HttpServletRequest request) {

        // boardType 추출
        String requestUrl = request.getRequestURI();
        int boardType = notificationService.getBoardType(requestUrl);

        //양식 list
        List<WriteFormatDto> writeFormList = workLogService.getWriteFormList(boardType);
        model.addAttribute("writeFormList", writeFormList);

        model.addAttribute("allEmployee", employeeCacheService.getAllEmployee());
        model.addAttribute("urlName", PROJECT_TITLE);
        model.addAttribute("title", PROJECT_ADD_TITLE);
        return "worksheet/project/form";
    }

    @PostMapping("/form")
    public String addProject(RequestDto worksheetRequestDto) {


        return "redirect:/worksheet/project/list";

    }

    @GetMapping("/contents")
    public String getProjectInfo(Model model,
                                 @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum,
                                 @RequestParam(required = false) String employeeCode,
                                 @RequestParam(value = "departmentCode", required = false, defaultValue = DEPARTMENT_CODE_DEFAULT) String departmentCode,
                                 @RequestParam(required = false) String searchType,
                                 @RequestParam(required = false) String keyword,
                                 @RequestParam(required = false) Integer state,
                                 int projectNo, @AuthenticationPrincipal EmployeePrincipal employee) {

        String employeeLoginCode = employee.getUsername();
        ProjectDto projectContent;
        model.addAttribute("selectEmployeeCode", employeeCode);

        if (departmentCode.equals(DEPARTMENT_CODE_DEFAULT)) {
            // 부서선택 X
            // 부서 선택 안되어있을때 로그인한사람으로 리스트출력
            projectContent = projectService.loginProjectContent(employeeLoginCode, projectNo, searchType, keyword, state);

        } else {
            //부서선택 O
            Boolean isEmployeeEmpty;
            if (StringUtils.isEmpty(employeeCode)) {
                // 부서는 선택했는데 작성자를 선택 안했을때
                isEmployeeEmpty = true;

            } else {
                //부서, 작성자 둘다 선택
                isEmployeeEmpty = false;

            }
            projectContent = projectService.selectProjectContent(isEmployeeEmpty, departmentCode, employeeCode, projectNo, searchType, keyword, state);

        }


        model.addAttribute("pc", projectContent);
        model.addAttribute("employeeLoginCode", employeeLoginCode);
        model.addAttribute("departmentCode", departmentCode);

        // 댓글 조회를 위한 게시물 번호
        model.addAttribute("currentBoardNo", projectNo);

        model.addAttribute("urlName", PROJECT_TITLE);
        model.addAttribute("title", PROJECT_CONTENT_TITLE);
        model.addAttribute("pageNum", pageNum);
        model.addAttribute("searchType", searchType);
        model.addAttribute("keyword", keyword);
        model.addAttribute("state", state);

        return "worksheet/project/contents";
    }

    @GetMapping("/edit")
    public String updateProjectForm(Model model, @AuthenticationPrincipal EmployeePrincipal employee, int projectNo,
                                    HttpServletRequest request) {


        String requestUrl = request.getRequestURI();
        int boardType = notificationService.getBoardType(requestUrl);

        //양식 list
        List<WriteFormatDto> writeFormList = workLogService.getWriteFormList(boardType);
        model.addAttribute("writeFormList", writeFormList);

        String loginEmployeeCode = employee.getUsername();

        ProjectDto projectContent = projectService.loginProjectContent(loginEmployeeCode, projectNo, null, null, null);

        model.addAttribute("pc", projectContent);

        model.addAttribute("allEmployee", employeeCacheService.getAllEmployee());

        model.addAttribute("urlName", PROJECT_TITLE);
        model.addAttribute("title", PROJECT_EDIT_TITLE);
        return "worksheet/project/edit";
    }

    @DeleteMapping("/delete")
    public String deleteProject(int projectNo) {

        projectService.deleteProject(projectNo);

        return "redirect:/worksheet/project/list";
    }

    @ResponseBody
    @PostMapping("/addProject")
    public int addProject(@RequestBody Map<String, Object> data, @AuthenticationPrincipal EmployeePrincipal employee) {

        String loginEmployeeCode = employee.getUsername();

        return projectService.addProject(data, loginEmployeeCode);

    }

    @ResponseBody
    @PutMapping("/editState")
    public void editState(int projectNo, int state) {

        projectService.updateState(projectNo, state);
    }

    @ResponseBody
    @PutMapping("/updateProject")
    public String updateProjectAndMyProject(@RequestBody Map<String, Object> data,
                                            @AuthenticationPrincipal EmployeePrincipal employee) {
        String loginEmployeeCode = employee.getUsername();
        int projectNo = Integer.parseInt(String.valueOf(data.get("projectNo")));
        List<MyProjectDto> myProjectList = projectService.getMyProjectListByProjectNo(projectNo, false, null);

        Boolean isWriteable = false;

        for (MyProjectDto myProjectDto : myProjectList) {
            if (myProjectDto.getEmployeeCode().equals(loginEmployeeCode)) {
                isWriteable = true;
            }

        }

        if (isWriteable) {
            projectService.updateProjectAndMyProject(data);
            return null;
        } else {
            return "작성자와 참여자만 수정 가능합니다.";
        }


    }


}