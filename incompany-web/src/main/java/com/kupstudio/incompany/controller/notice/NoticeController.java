package com.kupstudio.incompany.controller.notice;

import com.github.pagehelper.PageInfo;
import com.kupstudio.incompany.dto.DepartmentDto;
import com.kupstudio.incompany.dto.notice.NoticeDto;
import com.kupstudio.incompany.enumClass.NoticeTypeEnum;
import com.kupstudio.incompany.enumClass.notice.NoticeCategoryEnum;
import com.kupstudio.incompany.security.EmployeePrincipal;
import com.kupstudio.incompany.service.DepartmentService;
import com.kupstudio.incompany.service.auth.AuthService;
import com.kupstudio.incompany.service.board.BoardService;
import com.kupstudio.incompany.service.cloud.CloudService;
import com.kupstudio.incompany.service.department.DepartmentSearchService;
import com.kupstudio.incompany.service.notice.NoticeService;
import com.kupstudio.incompany.service.question.QuestionService;
import com.kupstudio.incompany.util.DepartmentCodeUtil;
import com.kupstudio.incompany.util.PageInfoUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Controller
@RequestMapping("notice")
@RequiredArgsConstructor
public class NoticeController {

    public static final int DEPTH_TWO = 2;
    private final static String DIRECTORY_PATH = "kh_news/";
    private static final String IS_NOT_AUTH_MESSAGE = "권한이 없습니다. \n담당자에게 문의하세요.";
    private final CloudService cloudService;
    private final NoticeService noticeService;
    private final DepartmentSearchService departmentSearchService;
    private final BoardService boardService;
    private final QuestionService questionService;
    private final DepartmentService departmentService;
    private final AuthService authService;
    private final String WRITE_CONTENT = " 작성하기";
    private final String DEFAULT_PAGE_STR = "1";
    @Value("${cloud.aws.s3Url}")
    private String cloudUrl;

    @GetMapping("/addNotice")
    public String addNoticeForm(Model model, RedirectAttributes reAttr,
                                @RequestParam(required = false) Integer type,
                                @AuthenticationPrincipal EmployeePrincipal employee
    ) {

        boolean hasRole = NoticeTypeEnum.hasRole(type);
        if (type != 5 && !hasRole) {
            reAttr.addAttribute("message", IS_NOT_AUTH_MESSAGE);
            return "redirect:/notice/list?type=" + type;
        }

        NoticeTypeEnum noticeTypeEnum = NoticeTypeEnum.valueOf(type);
        String typeTitle = noticeTypeEnum.getMeaning();
        if (type.equals(NoticeTypeEnum.BRANCH.getIndex())) {
            String loginDepartmentCode = employee.getDepartmentCode();
            if (DepartmentCodeUtil.getDepth(loginDepartmentCode) >= DEPTH_TWO) {
                String selectDepartmentCode = DepartmentCodeUtil.getDepthString(loginDepartmentCode, DEPTH_TWO);
                model.addAttribute("selectDepartmentCode", selectDepartmentCode);

            }

            model.addAttribute("departmentList", departmentSearchService.getDepthDepartmentCode(DEPTH_TWO));

        }

        if (type.equals(NoticeTypeEnum.ARTICLE.getIndex())) {

            model.addAttribute("categoryList", NoticeCategoryEnum.getAllCategoryEnum());
        }

        model.addAttribute("urlName", typeTitle + WRITE_CONTENT);
        model.addAttribute("title", typeTitle + WRITE_CONTENT);
        model.addAttribute("type", type);

        return "khNews/addNotice";
    }

    @PostMapping("/addNotice")
    public String addNotice(NoticeDto noticeDto, List<MultipartFile> file) {
        int type = noticeDto.getType();

        String url = "redirect:/notice/list?type=" + type;

        NoticeTypeEnum noticeTypeEnum = NoticeTypeEnum.valueOf(type);
        String typeTitle = noticeTypeEnum.getName();

        List<String> filePath = new ArrayList<>();

        String directoryPath = DIRECTORY_PATH + typeTitle + "/";

        if (CollectionUtils.isNotEmpty(file) && !file.get(0).isEmpty()) {
            filePath = cloudService.upload(file, directoryPath);
        }
        noticeService.addNotice(noticeDto, filePath);
//        if (!noticeDto.getStartTime().isEmpty() && !noticeDto.getEndTime().isEmpty()) {
//            noticeService.addFixNotice(noticeDto);
//        }
//

        return url;

    }


    //공지사항 ( 일반 게시글, 페이징) 조회
    @GetMapping("/list")
    public String noticeList(Model model,
                             @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum,
                             @RequestParam(required = false) String searchType,
                             @RequestParam(required = false) String keyword,
                             @RequestParam(required = false) Integer type,
                             @AuthenticationPrincipal EmployeePrincipal employee,
                             @RequestParam(value = "message", required = false) String message) {

        NoticeTypeEnum noticeTypeEnum = NoticeTypeEnum.valueOf(type);
        int perPage = noticeTypeEnum.getPerPage();
        String url = noticeTypeEnum.getUrl();
        String typeTitle = noticeTypeEnum.getMeaning();

        // 지점리스트
        List<DepartmentDto> branchDepartmentList = new ArrayList<>();
        // role 있는지 확인
        boolean hasRole = NoticeTypeEnum.hasRole(type);


        if (type.equals(NoticeTypeEnum.BRANCH.getIndex())) {
            if (!hasRole) {

                String loginDepartmentCode = employee.getDepartmentCode();
                if (DepartmentCodeUtil.getDepth(loginDepartmentCode) > DEPTH_TWO) {

                    DepartmentDto branchDepartmentCode = new DepartmentDto();

                    branchDepartmentCode.setDepartmentCode(DepartmentCodeUtil.getDepthString(loginDepartmentCode, DEPTH_TWO));
                    branchDepartmentList.add(branchDepartmentCode);
                } else {
                    branchDepartmentList.addAll(departmentService.getAllDepartmentCode(loginDepartmentCode));

                }

            } else {
                branchDepartmentList = null;
            }
        }
        PageInfo<NoticeDto> noticeList = PageInfo.of(noticeService.getNoticeList(pageNum, searchType, keyword, type, branchDepartmentList), perPage); //한 페이지 당 게시글 조회;

        noticeList = PageInfoUtil.setPageNation(noticeList, pageNum, perPage);

//        List<NoticeDto> FixNotice = noticeService.getFixNoticeList(); //고정 게시글


        // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("urlName", typeTitle);
        model.addAttribute("keyword", keyword);
        model.addAttribute("searchType", searchType);
        model.addAttribute("title", typeTitle);
//        model.addAttribute("FixNotice", FixNotice);
        model.addAttribute("pageNum", pageNum);
        model.addAttribute("pageList", noticeList);
        model.addAttribute("type", type);

        model.addAttribute("noticeList", noticeList);
        model.addAttribute("message", message);

        return url;

    }

    //공지사항 게시글 상세보기
    @GetMapping("/contents")
    public String noticeContents(Model model, @RequestParam(value = "noticeNo") int noticeNo,
                                 @RequestParam(value = "title", required = false) String title,
                                 @RequestParam(value = "pageNum", required = false) Integer pageNum,
                                 @RequestParam(value = "type", required = false) Integer type,
                                 @RequestParam(value = "searchType", required = false) String searchType,
                                 @RequestParam(value = "keyword", required = false) String keyword,
                                 @AuthenticationPrincipal EmployeePrincipal employee) {

        NoticeTypeEnum noticeTypeEnum = NoticeTypeEnum.valueOf(type);
        String typeTitle = noticeTypeEnum.getMeaning();
        List<DepartmentDto> branchDepartmentList = new ArrayList<>();


        boolean hasRole = NoticeTypeEnum.hasRole(type);

        if (type.equals(NoticeTypeEnum.BRANCH.getIndex())) {

            if (!hasRole) {

                String loginDepartmentCode = employee.getDepartmentCode();
                if (DepartmentCodeUtil.getDepth(loginDepartmentCode) > DEPTH_TWO) {

                    DepartmentDto branchDepartmentCode = new DepartmentDto();

                    branchDepartmentCode.setDepartmentCode(DepartmentCodeUtil.getDepthString(loginDepartmentCode, DEPTH_TWO));
                    branchDepartmentList.add(branchDepartmentCode);
                } else {
                    branchDepartmentList.addAll(departmentService.getAllDepartmentCode(loginDepartmentCode));

                }


            } else {
                branchDepartmentList = null;
            }
        }

        if (type.equals(NoticeTypeEnum.FORM.getIndex())) {
            // 로그인 코드
            String loginEmployeeCode = authService.getEmployeeCode();
            model.addAttribute("loginEmployeeCode", loginEmployeeCode);
        }

        NoticeDto noticeContents = noticeService.getNoticeContents(noticeNo, type, searchType, keyword, branchDepartmentList);

        List<String> fileList = cloudService.removeUrl(noticeContents.getAttacheFiles());

        // 조회수 증가
        noticeService.increaseHit(noticeNo);


        model.addAttribute("cloudUrl", cloudUrl);


        model.addAttribute("fileList", fileList);
        model.addAttribute("noticeContents", noticeContents);

        model.addAttribute("searchType", searchType);
        model.addAttribute("keyword", keyword);

        model.addAttribute("pageNum", pageNum);
        model.addAttribute("type", type);
        model.addAttribute("searchTitle", title);
        model.addAttribute("title", typeTitle);
        model.addAttribute("urlName", typeTitle);
        model.addAttribute("hasRole", hasRole);

        // 댓글 연결
        model.addAttribute("currentBoardNo", noticeNo);

        return "khNews/content";
    }

    // 공지사항 삭제
    @DeleteMapping("/deleteNotice")
    public String deleteNotice(int noticeNo, int type,
                               RedirectAttributes reAttr) {

        boolean hasRole = NoticeTypeEnum.hasRole(type);

        if (type != 5 && !hasRole) {
            reAttr.addAttribute("message", IS_NOT_AUTH_MESSAGE);
            return "redirect:/notice/list?type=" + type;
        }

        // 양식자료 게시판 삭제 권한 체크
        if(type == 5){
            NoticeDto noticeContents = noticeService.getNoticeContents(noticeNo, type, null, null, null);

            String loginCode = authService.getEmployeeCode();
            String employeeCode = noticeContents.getCreateEmployeeCode();
            if (!loginCode.equals(employeeCode)) {
                reAttr.addAttribute("message", "삭제 권한이 없습니다.");
                return "redirect:/notice/list?type=" + type;
            }
        }

        List<String> fileNameList = noticeService.getNoticeContents(noticeNo, type, null, null, null).getFileNameList();

        if (!fileNameList.isEmpty()) {
            fileNameList.forEach(name -> cloudService.deleteAndReplaceUrl(name));
        }
        noticeService.deleteNotice(noticeNo);
        noticeService.deleteFixNotice(noticeNo);

        return "redirect:/notice/list?type=" + type;
    }

    // 공지사항 게시글 수정폼
    @GetMapping("/updateNotice")
    public String updateNoticeForm(Model model, RedirectAttributes reAttr,
                                   @RequestParam(value = "noticeNo") int noticeNo,
                                   @RequestParam(required = false) Integer type) {

        boolean hasRole = NoticeTypeEnum.hasRole(type);

        NoticeTypeEnum noticeTypeEnum = NoticeTypeEnum.valueOf(type);
        String typeTitle = noticeTypeEnum.getMeaning();

        NoticeDto noticeContents = noticeService.getNoticeContents(noticeNo, type, null, null, null);
        List<String> fileList = cloudService.removeUrl(noticeContents.getAttacheFiles());

        if (type != 5 && !hasRole) {
            reAttr.addAttribute("message", IS_NOT_AUTH_MESSAGE);
            return "redirect:/notice/list?type=" + type;
        }

        // 양식자료 게시판 수정 권한 체크
        if(type == 5 ){
            String loginCode = authService.getEmployeeCode();
            String employeeCode = noticeContents.getCreateEmployeeCode();
            if (!loginCode.equals(employeeCode)) {
                reAttr.addAttribute("message", "수정 권한이 없습니다.");
                return "redirect:/notice/list?type=" + type;
            }
        }

        if (type.equals(NoticeTypeEnum.BRANCH.getIndex())) {

            model.addAttribute("departmentList", departmentSearchService.getDepthDepartmentCode(DEPTH_TWO));
        }

        if (type.equals(NoticeTypeEnum.ARTICLE.getIndex())) {

            model.addAttribute("categoryList", NoticeCategoryEnum.getAllCategoryEnum());
        }


        // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("urlName", typeTitle + WRITE_CONTENT);

        model.addAttribute("type", type);
        model.addAttribute("fileList", fileList);
        model.addAttribute("title", typeTitle + WRITE_CONTENT);
        model.addAttribute("noticeContents", noticeContents);
        return "khNews/updateNotice";
    }

    // 공지사항 게시글 수정
    @PutMapping("/updateNotice")
    public String updateNotice(NoticeDto noticeDto, List<MultipartFile> file, HttpServletRequest request) {
        int noticeNo = noticeDto.getNoticeNo();
        Integer type = noticeDto.getType();

        List<String> filePath = new ArrayList<>();

        List<String> fileNameList = noticeService.getNoticeContents(noticeDto.getNoticeNo(), type, null, null, null).getFileNameList();

        List<String> fileNameDbList = new ArrayList<>();
        if (request.getParameterValues("fileNameDb") != null) {
            fileNameDbList = List.of(request.getParameterValues("fileNameDb"));
        }
        // 파일이 그대로이면 cloud 삭제 x
        for (String fileDb : fileNameList) {
            String queryFileDb = StringUtils.replace(fileDb, cloudUrl, "");
            if (!fileNameDbList.contains(queryFileDb)) {
                cloudService.deleteAndReplaceUrl(fileDb);
            }
        }

        NoticeTypeEnum noticeTypeEnum = NoticeTypeEnum.valueOf(type);
        String typeTitle = noticeTypeEnum.getName();
        String directoryPath = DIRECTORY_PATH + typeTitle + "/";


        // 파일이 추가되면 add
        if (CollectionUtils.isNotEmpty(file) && !file.get(0).isEmpty()) {
            filePath = cloudService.upload(file, directoryPath);
        }

//        if (!noticeDto.getStartTime().isEmpty() && !noticeDto.getEndTime().isEmpty()) {
//            if (noticeBf.getStartTime() == null || noticeBf.getEndTime() == null) {
//                noticeService.addFixNotice(noticeDto);
//            }
//            noticeService.updateFixNotice(noticeDto);
//        } else {
//            noticeService.deleteFixNotice(noticeNo);
//        }

        noticeService.updateNotice(noticeDto, filePath, fileNameDbList);

        return "redirect:/notice/contents?noticeNo=" + noticeNo + "&type=" + type;


    }

}