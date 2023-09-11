package com.kupstudio.incompany.controller.question;

import com.github.pagehelper.PageInfo;
import com.kupstudio.incompany.dto.EmployeeDto;
import com.kupstudio.incompany.dto.question.QuestionDto;
import com.kupstudio.incompany.enumClass.question.QuestionCategoryEnum;
import com.kupstudio.incompany.service.EmployeeService;
import com.kupstudio.incompany.service.auth.AuthService;
import com.kupstudio.incompany.service.cloud.CloudService;
import com.kupstudio.incompany.service.question.QuestionService;
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
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Controller
@RequestMapping("/faQuestion")
@RequiredArgsConstructor
public class QuestionController {

    private final static String DIRECTORY_PATH = "faQuestion/";
    private final String QUESTION_CONTENTS_NAME = "질문 게시판";
    private final CloudService cloudService;
    private final QuestionService questionService;
    private final EmployeeService employeeService;
    private final AuthService authService;
    /* 페이징 관련 상수 */
    private final int COUNT_PER_PAGE = 10;   // 화면에 노출시킬 리스트 개수 (페이지 개수x)
    private final String DEFAULT_PAGE_STR = "1";
    @Value("${cloud.aws.s3Url}")
    private String cloudUrl;

    @GetMapping("/addQuestion")
    public String addQuestionForm(Model model) {
        //로그인한 사원의 정보
        String loginEmployeeCode = authService.getEmployeeCode();
        EmployeeDto employeeDto = employeeService.getOneEmployeeInfo(loginEmployeeCode);
        model.addAttribute("employeeDto", employeeDto);
        model.addAttribute("loginEmployeeCode", loginEmployeeCode);

        //question category 가져오기
        List<QuestionCategoryEnum> questionCategory = QuestionCategoryEnum.getAllCategoryEnum();
        model.addAttribute("questionCategory", questionCategory);

        model.addAttribute("title", QUESTION_CONTENTS_NAME);
        model.addAttribute("urlName", QUESTION_CONTENTS_NAME);
        return "question/addQuestion";
    }

    @PostMapping("/addQuestion")
    public String addQuest(QuestionDto questionDto, List<MultipartFile> file) {

        List<String> filePath = new ArrayList<>();
        if (!CollectionUtils.isEmpty(file)) {
            if (!file.get(0).isEmpty()) {
                filePath = cloudService.upload(file, DIRECTORY_PATH);
            }
        }
        questionService.addQuestion(questionDto, filePath);

        return "redirect:/faQuestion/list";
    }


    @GetMapping("/list")
    public String questionList(Model model,
                               @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum,
                               @RequestParam(required = false) String searchType,
                               @RequestParam(required = false) String keyword,
                               @RequestParam(value = "message", required = false) String message) {
        PageInfo<QuestionDto> questionList = PageInfo.of(questionService.getQuestionList(pageNum, searchType, keyword), COUNT_PER_PAGE); //한 페이지 당 게시글 조회
        questionList = PageInfoUtil.setPageNation(questionList, pageNum);

        model.addAttribute("searchType", searchType);
        model.addAttribute("keyword", keyword);

        model.addAttribute("questionList", questionList);

        // 페이징에서 사용할 리스트 세팅
        model.addAttribute("pageList", questionList);
        model.addAttribute("pageNum", pageNum);
        // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("title", QUESTION_CONTENTS_NAME);
        model.addAttribute("urlName", QUESTION_CONTENTS_NAME);
        model.addAttribute("message", message);
        return "question/list";
    }


    // 게시글 상세보기
    @GetMapping("/questionInfo")
    public String getQuestionContents(Model model, @RequestParam(value = "questionNo") int questionNo) {

        QuestionDto questionContents = questionService.getQuestionContents(questionNo);
        model.addAttribute("questionContents", questionContents);

        List<String> fileList = cloudService.removeUrl(questionContents.getAttachFiles());
        model.addAttribute("fileList", fileList);

        // 로그인 코드
        String loginEmployeeCode = authService.getEmployeeCode();
        model.addAttribute("loginEmployeeCode", loginEmployeeCode);
        // 조회수 증가
        questionService.increaseHit(questionNo);

        // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("title", QUESTION_CONTENTS_NAME);
        model.addAttribute("urlName", QUESTION_CONTENTS_NAME);

        model.addAttribute("cloudUrl", cloudUrl);

        // 댓글 연결
        model.addAttribute("currentBoardNo", questionNo);

        return "question/questionInfo";
    }

    // 삭제
    @DeleteMapping("/deleteQuestion")
    public String deleteQuestion(@RequestParam(value = "questionNo") Integer questionNo) {

        List<String> fileNameList = questionService.getQuestionContents(questionNo).getFileNameList();
        if (!fileNameList.isEmpty()) {
            fileNameList.forEach(name -> cloudService.deleteAndReplaceUrl(name));
        }
        questionService.deleteQuestion(questionNo);
        return "redirect:/faQuestion/list";

    }

    // 게시글 수정폼
    @GetMapping("/updateQuestion")
    public String updateQuestionForm(Model model, RedirectAttributes reAttr,
                                     @RequestParam(value = "questionNo") int questionNo) {

        // 권한 체크
        String loginCode = authService.getEmployeeCode();
        String employeeCode = questionService.getQuestionContents(questionNo).getCreateEmployeeCode();
        if (!loginCode.equals(employeeCode)) {
            reAttr.addAttribute("message", "수정 권한이 없습니다.");
            return "redirect:/faQuestion/list";
        }
        QuestionDto questionContents = questionService.getQuestionContents(questionNo);
        model.addAttribute("questionContents", questionContents);
        List<String> fileList = cloudService.removeUrl(questionContents.getAttachFiles());
        model.addAttribute("fileList", fileList);

        //question category 가져오기
        List<QuestionCategoryEnum> questionCategory = QuestionCategoryEnum.getAllCategoryEnum();
        model.addAttribute("questionCategory", questionCategory);

        // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("title", QUESTION_CONTENTS_NAME);
        model.addAttribute("urlName", QUESTION_CONTENTS_NAME);
        return "question/updateQuestion";
    }

    // 게시글 수정
    @PostMapping("/updateQuestion")
    public String updateQuestion(QuestionDto questionDto, List<MultipartFile> file, HttpServletRequest request) {
        String contents = questionDto.getContents();
        List<String> filePath = new ArrayList<>();
        List<String> fileNameList = questionService.getQuestionContents(questionDto.getQuestionNo()).getFileNameList();
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
        // 파일이 추가되면 add
        if (!CollectionUtils.isEmpty(file)) {
            if (!file.get(0).isEmpty()) {
                filePath = cloudService.upload(file, DIRECTORY_PATH);
            }
        }

        questionService.updateQuestion(questionDto, filePath, fileNameDbList);
        return "redirect:/faQuestion/list";
    }
}

