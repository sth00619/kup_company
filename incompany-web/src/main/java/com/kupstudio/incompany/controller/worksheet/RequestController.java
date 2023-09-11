package com.kupstudio.incompany.controller.worksheet;

import com.github.pagehelper.PageInfo;
import com.kupstudio.incompany.dto.CompanyChartDto;
import com.kupstudio.incompany.dto.document.WriteFormatDto;
import com.kupstudio.incompany.dto.worksheet.RequestDto;
import com.kupstudio.incompany.enumClass.AuthNameEnum;
import com.kupstudio.incompany.enumClass.BoardTypeEnum;
import com.kupstudio.incompany.enumClass.ContentsCateEnum;
import com.kupstudio.incompany.security.EmployeePrincipal;
import com.kupstudio.incompany.service.CompanyChartService;
import com.kupstudio.incompany.service.DepartmentSelectService;
import com.kupstudio.incompany.service.auth.AuthService;
import com.kupstudio.incompany.service.cloud.CloudService;
import com.kupstudio.incompany.service.document.WorkLogService;
import com.kupstudio.incompany.service.notification.NotificationService;
import com.kupstudio.incompany.service.worksheet.RequestService;
import com.kupstudio.incompany.util.PageInfoUtil;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/worksheet/request")
public class RequestController {


    private final static String DIRECTORY_PATH = "worksheet/request/";
    private final CloudService cloudService;
    private final CompanyChartService companyChartService;

    private final RequestService requestService;
    private final DepartmentSelectService departmentSelectService;
    private final WorkLogService workLogService;
    private final AuthService authService;
    private final NotificationService notificationService;
    private final String DEFAULT_PAGE_STR = "1";
    private final String REQUEST_TITLE = "업무요청";
    private final String REQUEST_CONTENT_TITLE = "업무요청 정보";
    private final String REQUEST_ADD_TITLE = "업무요청 작성하기";
    private final String REQUEST_EDIT_TITLE = "업무요청 수정하기";
    private final int COUNT_PER_PAGE = 10;   // 화면에 노출시킬 리스트 개수 (페이지 개수x)
    @Value("${cloud.aws.s3Url}")
    private String cloudUrl;

    @SneakyThrows
    @GetMapping("/list")
    public String requestList(Model model,
                              @AuthenticationPrincipal EmployeePrincipal employee,
                              @RequestParam(value = "departmentCode", required = false, defaultValue = "D") String departmentCode,
                              @RequestParam(required = false) String employeeCode,
                              @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum,
                              @RequestParam(required = false) String searchType,
                              @RequestParam(required = false) String keyword,
                              @RequestParam(required = false) Integer state) {

        String employeeLoginCode = employee.getUsername();
        String companyCode = employee.getCompanyCode();
        String loginDepartmentCode = employee.getDepartmentCode();
        PageInfo<RequestDto> requestList;


        if (StringUtils.isNotEmpty(employeeCode)) {
            model.addAttribute("employeeCode", employeeCode);

        } else {
            employeeCode = employeeLoginCode;
            model.addAttribute("employeeCode", employeeLoginCode);

        }
        if (authService.hasAuth(AuthNameEnum.SCHEDULE_SELECT_DEPARTMENT_ONE_DEPTH) || authService.hasAuth(AuthNameEnum.SCHEDULE_SELECT_DEPARTMENT_TWO_DEPTH) || authService.hasAuth(AuthNameEnum.SCHEDULE_SELECT_DEPARTMENT_THREE_DEPTH)) {

            if(authService.hasAuth(AuthNameEnum.WORK_REQUEST)) {
                // 권한 있을 경우 모든 업무 요청 조회
                requestList = PageInfo.of(requestService.allRequestList(pageNum, searchType, keyword, state), COUNT_PER_PAGE);
            } else {
                // 팀장 이상일 경우 해당부서요청자 전체조회
                requestList = PageInfo.of(requestService.employeeInDepartmentRequestList(employeeCode, loginDepartmentCode, pageNum, searchType, keyword, state), COUNT_PER_PAGE);
            }

        } else {
            requestList = PageInfo.of(requestService.requestList(employeeCode, pageNum, searchType, keyword, state), COUNT_PER_PAGE);

        }


        requestList = PageInfoUtil.setPageNation(requestList, pageNum, COUNT_PER_PAGE);

        List<CompanyChartDto> getDepartmentOneDepth = companyChartService.getDepartmentOneDepth(companyCode, "D");
        Map<String, Object> selectDepartmentMap = departmentSelectService.getSelectDepartment(departmentCode);

        model.addAttribute("getDepartmentOneDepth", getDepartmentOneDepth);
        model.addAttribute("selectDepartmentMap", selectDepartmentMap);

        model.addAttribute("searchType", searchType);
        model.addAttribute("keyword", keyword);

        model.addAttribute("companyCode", companyCode);
        model.addAttribute("departmentCode", departmentCode);
        model.addAttribute("employeeLoginCode", employeeLoginCode);

        model.addAttribute("pageNum", pageNum);
        model.addAttribute("pageList", requestList);
        model.addAttribute("requestList", requestList);
        model.addAttribute("urlName", REQUEST_TITLE);
        model.addAttribute("title", REQUEST_TITLE);
        model.addAttribute("state", state);
        return "worksheet/request/list";
    }

    @GetMapping("/form")
    public String requestForm(Model model, HttpServletRequest request) {

        String requestUrl = request.getRequestURI();
        int boardType = notificationService.getBoardType(requestUrl);

        //양식 list
        List<WriteFormatDto> writeFormList = workLogService.getWriteFormList(boardType);
        model.addAttribute("writeFormList", writeFormList);

        model.addAttribute("urlName", REQUEST_TITLE);
        model.addAttribute("title", REQUEST_ADD_TITLE);
        return "worksheet/request/form";
    }

    @PostMapping("/form")
    public String addRequestForm(RequestDto worksheetRequestDto, List<MultipartFile> file) {

        List<String> filePath = new ArrayList<>();

        if (CollectionUtils.isNotEmpty(file) && !file.get(0).isEmpty()) {
            filePath = cloudService.upload(file, DIRECTORY_PATH);
        }

        requestService.addRequest(worksheetRequestDto, filePath);
        int requestNo = worksheetRequestDto.getRequestNo();

        return "redirect:/worksheet/request/contents?requestNo=" + requestNo;

    }

    @GetMapping("/contents")
    public String requestComment(Model model, int requestNo,
                                 @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum,
                                 @RequestParam(required = false) String searchType,
                                 @RequestParam(required = false) String keyword,
                                 @RequestParam(required = false) Integer state,
                                 @AuthenticationPrincipal EmployeePrincipal employee) {

        String employeeLoginCode = employee.getUsername();
        String loginDepartmentCode = employee.getDepartmentCode();

        model.addAttribute("employeeLoginCode", employeeLoginCode);
        RequestDto requestContent;

        if (authService.hasAuth(AuthNameEnum.SCHEDULE_SELECT_DEPARTMENT_ONE_DEPTH) || authService.hasAuth(AuthNameEnum.SCHEDULE_SELECT_DEPARTMENT_TWO_DEPTH) || authService.hasAuth(AuthNameEnum.SCHEDULE_SELECT_DEPARTMENT_THREE_DEPTH)) {
            // 팀장 이상일 경우 해당부서요청자 전체조회
            requestContent = requestService.employeeInDepartmentRequestContent(requestNo, loginDepartmentCode, searchType, keyword, state);


        } else {
            requestContent = requestService.requestContent(requestNo, searchType, keyword, state);

        }


        model.addAttribute("rc", requestContent);

        List<String> fileList = cloudService.removeUrl(requestContent.getAttacheFiles());
        model.addAttribute("fileList", fileList);
        model.addAttribute("urlName", REQUEST_TITLE);
        model.addAttribute("title", REQUEST_CONTENT_TITLE);
        model.addAttribute("pageNum", pageNum);
        model.addAttribute("searchType", searchType);
        model.addAttribute("keyword", keyword);
        model.addAttribute("state", state);

        model.addAttribute("cloudUrl", cloudUrl);

        // 댓글 조회를 위한 게시물 번호
        model.addAttribute("currentBoardNo", requestNo);

        return "worksheet/request/contents";
    }

    @GetMapping("/edit")
    public String requestEditForm(Model model, int requestNo, HttpServletRequest request) {

        RequestDto requestContent = requestService.requestContent(requestNo, null, null, null);
        model.addAttribute("rc", requestContent);

        List<String> fileList = cloudService.removeUrl(requestContent.getAttacheFiles());

        String requestUrl = request.getRequestURI();
        int boardType = notificationService.getBoardType(requestUrl);

        //양식 list
        List<WriteFormatDto> writeFormList = workLogService.getWriteFormList(boardType);
        model.addAttribute("writeFormList", writeFormList);


        model.addAttribute("urlName", REQUEST_TITLE);
        model.addAttribute("title", REQUEST_EDIT_TITLE);
        model.addAttribute("fileList", fileList);

        return "worksheet/request/edit";
    }

    @PutMapping("/edit")
    public String requestEdit(RequestDto requestDto, List<MultipartFile> file, HttpServletRequest request) {

        int requestNo = requestDto.getRequestNo();

        List<String> filePath = new ArrayList<>();

        List<String> fileNameList = requestService.requestContent(requestDto.getRequestNo(), null, null, null).getFileNameList();

        List<String> fileNameDbList = new ArrayList<>();
        if (request.getParameterValues("fileNameDb") != null) {
            fileNameDbList = List.of(request.getParameterValues("fileNameDb"));
        }
        // 파일이 그대로이면 cloud 삭제 x
        for (String fileDb : fileNameList) {
            String queryFileDb = StringUtils.replace(fileDb, cloudUrl,"");
            if (!fileNameDbList.contains(queryFileDb)) {
                cloudService.deleteAndReplaceUrl(fileDb);
            }
        }
        // 파일이 추가되면 add
        if (CollectionUtils.isNotEmpty(file) && !file.get(0).isEmpty()) {
            filePath = cloudService.upload(file, DIRECTORY_PATH);
        }

        requestService.updateRequest(requestDto, filePath, fileNameDbList);
        return "redirect:/worksheet/request/contents?requestNo=" + requestNo;

    }

    @DeleteMapping("/delete")
    public String requestDelete(int requestNo, HttpServletRequest request) {

        // mainUrl 추출
        String requestUrl = request.getRequestURI();
        int boardType = notificationService.getBoardType(requestUrl);
        // 알림 삭제
        notificationService.deleteNotification(boardType, requestNo);

        // content 삭제하면 파일도 삭제
        List<String> fileNameList = requestService.requestContent(requestNo, null, null, null).getFileNameList();

        if (!fileNameList.isEmpty()) {
            fileNameList.forEach(name -> cloudService.deleteAndReplaceUrl(name));
        }
        requestService.deleteRequest(requestNo);

        return "redirect:/worksheet/request/list";
    }

    @ResponseBody
    @PutMapping("/editState")
    public void editState(int requestNo, int state) {

        requestService.updateState(requestNo, state);
    }

    @ResponseBody
    @PutMapping("/updateResponseEmployee")
    public void updateResponseEmployee(@RequestBody Map<String, Object> data) {
        requestService.updateResponseEmployee(data);
    }

}