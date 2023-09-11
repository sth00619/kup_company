package com.kupstudio.incompany.controller.document;

import com.github.pagehelper.PageInfo;
import com.kupstudio.incompany.dto.EmployeeDto;
import com.kupstudio.incompany.dto.document.WorkLogDto;
import com.kupstudio.incompany.dto.document.WriteFormatDto;
import com.kupstudio.incompany.enumClass.AuthNameEnum;
import com.kupstudio.incompany.enumClass.BoardTypeEnum;
import com.kupstudio.incompany.enumClass.ContentsCateEnum;
import com.kupstudio.incompany.enumClass.document.WorkLogCategoryEnum;
import com.kupstudio.incompany.enumClass.document.WorkLogSearchCateEnum;
import com.kupstudio.incompany.service.DepartmentSelectService;
import com.kupstudio.incompany.service.EmployeeService;
import com.kupstudio.incompany.service.auth.AuthService;
import com.kupstudio.incompany.service.cloud.CloudService;
import com.kupstudio.incompany.service.document.WorkLogService;
import com.kupstudio.incompany.service.notification.NotificationService;
import com.kupstudio.incompany.util.PageInfoUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

@Slf4j
@Controller
@RequestMapping("/worksheet/document")
@RequiredArgsConstructor
public class WorkLogController {

    private static final String CONTENT_NAME = "업무일지";
    private static final String RECORD_NAME = "회의록";
    private static final String WRITE_TITLE = "업무일지 작성하기";
    private static final String DOCUMENT_INFO_TITLE = "업무일지 정보";
    private final static String DIRECTORY_PATH = "work_log/";

    private final static String[] IMAGE_EXTENSION = {"png", "jpg", "jpeg", "gif"}; // 이미지 확장자

    // 화면에 노출시킬 리스트 개수 (페이지 개수x)
    private final int COUNT_PER_PAGE = 10;
    private final String DEFAULT_PAGE_STR = "1";
    private final WorkLogService workLogService;
    private final EmployeeService employeeService;
    private final AuthService authService;
    private final DepartmentSelectService departmentSelectService;
    private final CloudService cloudService;
    private final NotificationService notificationService;

    @Value("${cloud.aws.s3Url}")
    private String cloudUrl;

    @GetMapping("/recordList")
    public String getRecordList (Model model,
                                 @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum,
                                 @RequestParam(value = "departmentCode", required = false) String departmentCode,
                                 @RequestParam(value = "employeeCode", required = false) String employeeCode,
                                 @RequestParam(value = "searchKey", required = false) String searchKey,
                                 @RequestParam(value = "searchValue", required = false) String searchValue,
                                 @RequestParam(value = "createDate", required = false) String createDate,
                                 @RequestParam(value = "message", required = false) String message) throws Exception {

        String loginEmployeeCode = authService.getEmployeeCode();
        model.addAttribute("loginEmployeeCode", loginEmployeeCode);

        // 로그인한 사원에게 CONTRACT_LEADER 권한이 있을 경우 리더 부서 코드 세팅
        String leaderDepartmentCode = authService.getDepartmentCodeByIsAuth(AuthNameEnum.CONTRACT_LEADER);

        // 본부, 지점, 팀, 담당자 리스트 : 권한별 select box 영역 세팅
        Map<String, Object> selectDepartmentMap = departmentSelectService.getSelectDepartment(departmentCode, AuthNameEnum.SELECT_DEPARTMENT_FROM_TEAM_LEADER_TO_PRESIDENT);
        if (selectDepartmentMap == null) selectDepartmentMap = new HashMap<>();

        /*검색조건 리스트 조회*/
        List<WorkLogSearchCateEnum> searchCateList = WorkLogSearchCateEnum.getAllMeaning();
        model.addAttribute("searchCateList", searchCateList);
        model.addAttribute("searchKey", searchKey);
        model.addAttribute("searchValue", searchValue);
        /*업무일지 리스트 조회*/
        PageInfo<WorkLogDto> workLogList;


        if (authService.hasAuth(AuthNameEnum.DOCUMENT_PAYMENT)) {
            // 결제 권한 있는 사원은 전체 회의록 보이도록
            workLogList = PageInfo.of(workLogService.getEmployeeInDepartmentRecordList(loginEmployeeCode, employeeCode, departmentCode, searchKey, searchValue, pageNum, COUNT_PER_PAGE, createDate), COUNT_PER_PAGE);
        } else {
            // 결제 권한 없는 사원은 해당 팀이 작성한 회의록만 보이도록
            workLogList = PageInfo.of(workLogService.getRecordList(loginEmployeeCode, searchKey, searchValue, pageNum, COUNT_PER_PAGE, createDate), COUNT_PER_PAGE);
        }

        model.addAttribute("workLogList", workLogList);
        // 페이징 start, end 세팅
        workLogList = PageInfoUtil.setPageNation(workLogList, pageNum, COUNT_PER_PAGE);
        // 페이징에서 사용할 리스트 세팅
        model.addAttribute("pageList", workLogList);
        model.addAttribute("pageNum", pageNum);

        // 리더권한의 사원이 담당자를 선택하지 않았을 경우 본인의 부서 코드로 세팅
        if (StringUtils.isEmpty(departmentCode) && StringUtils.isNotEmpty(leaderDepartmentCode))
            departmentCode = leaderDepartmentCode;

        model.addAttribute("selectDepartmentMap", selectDepartmentMap);
        model.addAttribute("departmentCode", departmentCode);
        model.addAttribute("employeeCode", employeeCode);
        model.addAttribute("message", message);

        model.addAttribute("urlName", RECORD_NAME);
        model.addAttribute("title", RECORD_NAME);
        
        return "worksheet/document/recordList";
    }
    @PostMapping("/updateDocument")
    public String updateDocument(@ModelAttribute(value = "WorkLogDto") WorkLogDto workLogDto,
                                 List<MultipartFile> file, HttpServletRequest request) {

        String loginEmployeeCode = authService.getEmployeeCode();
        int workLogNo = workLogDto.getWorkLogNo();


        List<String> fileNameDbList = new ArrayList<>();
        if (request.getParameterValues("fileNameDb") != null) {
            fileNameDbList = List.of(request.getParameterValues("fileNameDb"));
        }

        // 파일 목록 동일할 경우 cloud 삭제 x
        List<String> fileNameList = workLogService.getDocumentInfo(workLogNo, loginEmployeeCode).getFileNameList();
        for (String fileDb : fileNameList) {
            String queryFileDb = StringUtils.replace(fileDb, cloudUrl,"");
            if (!fileNameDbList.contains(queryFileDb)) {
                cloudService.deleteAndReplaceUrl(fileDb);
            }
        }

        // 파일 추가
        List<String> filePath = new ArrayList<>();
        if (CollectionUtils.isNotEmpty(file) && !file.get(0).isEmpty()) {
            filePath = cloudService.upload(file, DIRECTORY_PATH);
        }

        workLogService.updateDocument(workLogDto, filePath, fileNameDbList);
        return "redirect:/worksheet/document/documentInfo?workLogNo=" + workLogNo;
    }

    @GetMapping("/updateDocument")
    public String updateDocumentForm(Model model,
                                     @RequestParam(value = "workLogNo") Integer workLogNo,
                                     HttpServletRequest request) {
        // boardType 추출
        String requestUrl = request.getRequestURI();
        int boardType = notificationService.getBoardType(requestUrl);

        WorkLogDto workLogDto = workLogService.getDocumentInfo(workLogNo, null);
        model.addAttribute("workLogDto", workLogDto);

        // 첨부파일
        List<String> fileList = cloudService.removeUrl(workLogDto.getAttacheFiles());
        model.addAttribute("fileList", fileList);

        //업무일지 카테고리 list
        List<WorkLogCategoryEnum> workLogCategoryEnum = WorkLogCategoryEnum.getAllCategoryEnum();
        model.addAttribute("workLogCategoryEnum", workLogCategoryEnum);
        //양식 list
        List<WriteFormatDto> writeFormList = workLogService.getWriteFormList(boardType);
        model.addAttribute("writeFormList", writeFormList);
        workLogService.getDocumentInfo(workLogNo, null);

        model.addAttribute("urlName", CONTENT_NAME);
        model.addAttribute("title", WRITE_TITLE);
        return "worksheet/document/updateDocument";
    }

    @GetMapping("/documentInfo")
    public String getDocumentInfo(Model model, RedirectAttributes reAttr,
                                  @RequestParam(value = "workLogNo") Integer workLogNo) {

        String loginEmployeeCode = authService.getEmployeeCode();
        model.addAttribute("loginEmployeeCode", loginEmployeeCode);

        WorkLogDto workLogDto = workLogService.getDocumentInfo(workLogNo, loginEmployeeCode);
        model.addAttribute("workLogDto", workLogDto);

        // 첨부파일
        List<String> fileList = cloudService.removeUrl(workLogDto.getAttacheFiles());
        model.addAttribute("imgFileUrl", getImgFileUrl(fileList)); //이미지 파일 출력
        model.addAttribute("fileList", fileList);
        model.addAttribute("cloudUrl", cloudUrl);

        String employeeCode = workLogDto.getEmployeeCode();

        // 권한 체크
        boolean isAuth = authService.hasAuth(AuthNameEnum.DOCUMENT_PAYMENT);
        boolean isEmployee = authService.isLoginEmployee(employeeCode);
        int categoryNO = workLogDto.getCategory();

        if (WorkLogCategoryEnum.WORK_LOG.getCategory() == categoryNO) {

            if (!isEmployee && !isAuth) {
                reAttr.addAttribute("message", "게시글 권한이 없습니다.");
                return "redirect:/worksheet/document/documentList";
            }
        }

        // 업무일지 카테고리
        String category = WorkLogCategoryEnum.getMeaning(categoryNO);
        model.addAttribute("category", category);

        // 댓글 조회를 위한 게시물 번호
        model.addAttribute("currentBoardNo", workLogNo);

        model.addAttribute("urlName", CONTENT_NAME);
        model.addAttribute("title", DOCUMENT_INFO_TITLE);
        return "worksheet/document/documentInfo";
    }

    @GetMapping("/documentList")
    public String getWorkLogList(Model model,
                                 @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum,
                                 @RequestParam(value = "departmentCode", required = false) String departmentCode,
                                 @RequestParam(value = "employeeCode", required = false) String employeeCode,
                                 @RequestParam(value = "searchKey", required = false) String searchKey,
                                 @RequestParam(value = "searchValue", required = false) String searchValue,
                                 @RequestParam(value = "createDate", required = false) String createDate,
                                 @RequestParam(value = "message", required = false) String message) throws Exception {

        String loginEmployeeCode = authService.getEmployeeCode();
        model.addAttribute("loginEmployeeCode", loginEmployeeCode);

        // 로그인한 사원에게 CONTRACT_LEADER 권한이 있을 경우 리더 부서 코드 세팅
        String leaderDepartmentCode = authService.getDepartmentCodeByIsAuth(AuthNameEnum.CONTRACT_LEADER);

        // 본부, 지점, 팀, 담당자 리스트 : 권한별 select box 영역 세팅
        Map<String, Object> selectDepartmentMap = departmentSelectService.getSelectDepartment(departmentCode, AuthNameEnum.SELECT_DEPARTMENT_FROM_TEAM_LEADER_TO_PRESIDENT);
        if (selectDepartmentMap == null) selectDepartmentMap = new HashMap<>();

        /*검색조건 리스트 조회*/
        List<WorkLogSearchCateEnum> searchCateList = WorkLogSearchCateEnum.getAllMeaning();
        model.addAttribute("searchCateList", searchCateList);
        model.addAttribute("searchKey", searchKey);
        model.addAttribute("searchValue", searchValue);


        // 회의록 리스트 권한 별 노출
        if (pageNum == 1) {
            PageInfo<WorkLogDto> recordList;
            if (authService.hasAuth(AuthNameEnum.DOCUMENT_PAYMENT)) {
                // 결제 권한 있는 사원은 전체 회의록 보이도록
                recordList = PageInfo.of(workLogService.getEmployeeInDepartmentRecordListAtWorkLog(loginEmployeeCode, employeeCode, departmentCode, searchKey, searchValue, pageNum, COUNT_PER_PAGE, createDate), COUNT_PER_PAGE);
            } else {
                // 결제 권한 없는 사원은 해당 팀이 작성한 회의록만 보이도록
                recordList = PageInfo.of(workLogService.getRecordListAtWorkLog(loginEmployeeCode, searchKey, searchValue, pageNum, COUNT_PER_PAGE, createDate), COUNT_PER_PAGE);
            }
            model.addAttribute("recordList", recordList);
        }


        // 권한별 업무일지 리스트 조회
        PageInfo<WorkLogDto> workLogList;
        if (authService.hasAuth(AuthNameEnum.DOCUMENT_PAYMENT)) {
            workLogList = PageInfo.of(workLogService.getEmployeeInDepartmentWorkLogList(loginEmployeeCode, employeeCode, departmentCode, searchKey, searchValue, pageNum, COUNT_PER_PAGE, createDate), COUNT_PER_PAGE);

        } else {
            workLogList = PageInfo.of(workLogService.getWorkLogList(loginEmployeeCode, searchKey, searchValue, pageNum, COUNT_PER_PAGE, createDate), COUNT_PER_PAGE);

        }
        model.addAttribute("workLogList", workLogList);

        // 페이징 start, end 세팅
        workLogList = PageInfoUtil.setPageNation(workLogList, pageNum, COUNT_PER_PAGE);

        // 페이징에서 사용할 리스트 세팅
        model.addAttribute("pageList", workLogList);
        model.addAttribute("pageNum", pageNum);

        // 리더권한의 사원이 담당자를 선택하지 않았을 경우 본인의 부서 코드로 세팅
        if (StringUtils.isEmpty(departmentCode) && StringUtils.isNotEmpty(leaderDepartmentCode))
            departmentCode = leaderDepartmentCode;

        model.addAttribute("selectDepartmentMap", selectDepartmentMap);
        model.addAttribute("departmentCode", departmentCode);
        model.addAttribute("employeeCode", employeeCode);
        model.addAttribute("message", message);

        model.addAttribute("urlName", CONTENT_NAME);
        model.addAttribute("title", CONTENT_NAME);
        return "worksheet/document/documentList";
    }

    @PostMapping("/addDocument")
    public String addDocument(@ModelAttribute(value = "WorkLogDto") WorkLogDto workLogDto,
                              List<MultipartFile> multipartFile) {

        workLogService.addDocument(workLogDto, multipartFile);
        addNotification(workLogDto);
        return "redirect:/worksheet/document/documentList";
    }

    public void addNotification(WorkLogDto workLogDto) {
        int boardNo = workLogDto.getWorkLogNo();
        workLogService.addNotification(workLogDto, boardNo);
    }


    @GetMapping("/addDocument")
    public String addDocumentForm(Model model,
                                  HttpServletRequest request) {

        // 게시판타입에 따른 양식을 출력하기위한 mainUrl 추출
        String requestUrl = request.getRequestURI();
        int boardType = notificationService.getBoardType(requestUrl);
        model.addAttribute("boardType", boardType);
        // 양식 list
        List<WriteFormatDto> writeFormList = workLogService.getWriteFormList(boardType);
        model.addAttribute("writeFormList", writeFormList);

        //로그인한 사원의 정보
        String loginEmployeeCode = authService.getEmployeeCode();
        EmployeeDto employeeDto = employeeService.getOneEmployeeInfo(loginEmployeeCode);
        model.addAttribute("employeeDto", employeeDto);
        model.addAttribute("loginEmployeeCode", loginEmployeeCode);

        //업무일지 카테고리 list
        List<WorkLogCategoryEnum> workLogCategoryEnum = WorkLogCategoryEnum.getAllCategoryEnum();
        model.addAttribute("workLogCategoryEnum", workLogCategoryEnum);

        model.addAttribute("urlName", CONTENT_NAME);
        model.addAttribute("title", WRITE_TITLE);
        return "worksheet/document/addDocument";

    }

    @DeleteMapping("/deleteDocument")
    public String deleteDocument(@RequestParam(value = "workLogNo") Integer workLogNo) {
        workLogService.deleteDocument(workLogNo);
        return "redirect:/worksheet/document/documentList";
    }

    @ResponseBody
    @PostMapping("/updateCheckDocument")
    public void updateCheckDocument(@RequestParam(value = "workLogNo") Integer workLogNo) {

        String employeeCode = authService.getEmployeeCode();

        workLogService.updateCheckDocument(workLogNo, employeeCode);

    }

    /**
     * 확장자 조건에 맞을 경우
     * 이미지 파일을 출력한다.
     * @param fileNameList
     * @return
     */
    public List<String> getImgFileUrl (List<String> fileNameList) {
        boolean isContain = false;

        String [] arrExt = IMAGE_EXTENSION; // 확장자 배열

        List<String> imgFileUrl = new ArrayList<>();

        for(String fileUrl : fileNameList) {
            String ext = fileUrl.substring(fileUrl.lastIndexOf(".") + 1); //확장자 추출
            isContain = Arrays.asList(arrExt).contains(ext);

            if(isContain) {
                imgFileUrl.add(cloudUrl + fileUrl);
            }
        }
        return imgFileUrl;
    }
}