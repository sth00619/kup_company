package com.kupstudio.incompany.controller.board;

import com.github.pagehelper.PageInfo;
import com.kupstudio.incompany.dto.EmployeeDto;
import com.kupstudio.incompany.dto.board.BoardDto;
import com.kupstudio.incompany.enumClass.board.BoardCategoryEnum;
import com.kupstudio.incompany.service.EmployeeService;
import com.kupstudio.incompany.service.auth.AuthService;
import com.kupstudio.incompany.service.board.BoardService;
import com.kupstudio.incompany.service.cloud.CloudService;
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
@RequestMapping("/board")
@RequiredArgsConstructor
public class BoardController {

    private final static String DIRECTORY_PATH = "board/";
    private final String BOARD_CONTENTS_NAME = "자유 게시판";
    private final CloudService cloudService;
    private final BoardService boardService;
    private final EmployeeService employeeService;
    private final AuthService authService;
    /* 페이징 관련 상수 */
    private final int COUNT_PER_PAGE = 10;   // 화면에 노출시킬 리스트 개수 (페이지 개수x)
    private final String DEFAULT_PAGE_STR = "1";
    @Value("${cloud.aws.s3Url}")
    private String cloudUrl;

    @GetMapping("/addBoard")
    public String addBoardForm(Model model) {
        //로그인한 사원의 정보
        String loginEmployeeCode = authService.getEmployeeCode();
        EmployeeDto employeeDto = employeeService.getOneEmployeeInfo(loginEmployeeCode);
        model.addAttribute("employeeDto", employeeDto);
        model.addAttribute("loginEmployeeCode", loginEmployeeCode);

        //board category 가져오기
        List<BoardCategoryEnum> boardCategory = BoardCategoryEnum.getAllCategoryEnum();
        model.addAttribute("boardCategory", boardCategory);

        model.addAttribute("title", BOARD_CONTENTS_NAME);
        model.addAttribute("urlName", BOARD_CONTENTS_NAME);
        return "board/addBoard";
    }

    @PostMapping("/addBoard")
    public String addBoard(BoardDto boardDto, List<MultipartFile> file) {

        List<String> filePath = new ArrayList<>();
        if (!CollectionUtils.isEmpty(file)) {
            if (!file.get(0).isEmpty()) {
                filePath = cloudService.upload(file, DIRECTORY_PATH);
            }
        }
        boardService.addBoard(boardDto, filePath);

        return "redirect:/board/list";
    }


    @GetMapping("/list")
    public String boardList(Model model,
                            @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum,
                            @RequestParam(required = false) String searchType,
                            @RequestParam(required = false) String keyword,
                            @RequestParam(value = "message", required = false) String message) {
        PageInfo<BoardDto> boardList = PageInfo.of(boardService.getBoardList(pageNum, searchType, keyword), COUNT_PER_PAGE); //한 페이지 당 게시글 조회
        boardList = PageInfoUtil.setPageNation(boardList, pageNum);

        model.addAttribute("searchType", searchType);
        model.addAttribute("keyword", keyword);

        model.addAttribute("boardList", boardList);

        // 페이징에서 사용할 리스트 세팅
        model.addAttribute("pageList", boardList);
        model.addAttribute("pageNum", pageNum);
        // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("title", BOARD_CONTENTS_NAME);
        model.addAttribute("urlName", BOARD_CONTENTS_NAME);
        model.addAttribute("message", message);
        return "board/list";
    }


    // 게시글 상세보기
    @GetMapping("/boardInfo")
    public String getBoardContents(Model model, @RequestParam(value = "boardNo") int boardNo) {

        BoardDto boardContents = boardService.getBoardContents(boardNo);
        model.addAttribute("boardContents", boardContents);

        List<String> fileList = cloudService.removeUrl(boardContents.getAttacheFiles());
        model.addAttribute("fileList", fileList);

        // 로그인 코드
        String loginEmployeeCode = authService.getEmployeeCode();
        model.addAttribute("loginEmployeeCode", loginEmployeeCode);
        // 조회수 증가
        boardService.increaseHit(boardNo);

        // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("title", BOARD_CONTENTS_NAME);
        model.addAttribute("urlName", BOARD_CONTENTS_NAME);

        model.addAttribute("cloudUrl", cloudUrl);

        // 댓글 연결
        model.addAttribute("currentBoardNo", boardNo);

        return "board/boardInfo";
    }

    // 삭제
    @DeleteMapping("/deleteBoard")
    public String deleteBoard(@RequestParam(value = "boardNo") Integer boardNo) {

        List<String> fileNameList = boardService.getBoardContents(boardNo).getFileNameList();
        if (!fileNameList.isEmpty()) {
            fileNameList.forEach(name -> cloudService.deleteAndReplaceUrl(name));
        }
        boardService.deleteBoard(boardNo);
        return "redirect:/board/list";

    }

    // 게시글 수정폼
    @GetMapping("/updateBoard")
    public String updateBoardForm(Model model, RedirectAttributes reAttr,
                                  @RequestParam(value = "boardNo") int boardNo) {

        // 권한 체크
        String loginCode = authService.getEmployeeCode();
        String employeeCode = boardService.getBoardContents(boardNo).getCreateEmployeeCode();
        if (!loginCode.equals(employeeCode)) {
            reAttr.addAttribute("message", "수정 권한이 없습니다.");
            return "redirect:/board/list";
        }
        BoardDto boardContents = boardService.getBoardContents(boardNo);
        model.addAttribute("boardContents", boardContents);
        List<String> fileList = cloudService.removeUrl(boardContents.getAttacheFiles());
        model.addAttribute("fileList", fileList);

        //board category 가져오기
        List<BoardCategoryEnum> boardCategory = BoardCategoryEnum.getAllCategoryEnum();
        model.addAttribute("boardCategory", boardCategory);

        // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("title", BOARD_CONTENTS_NAME);
        model.addAttribute("urlName", BOARD_CONTENTS_NAME);
        return "board/updateBoard";
    }

    // 게시글 수정
    @PostMapping("/updateBoard")
    public String updateBoard(BoardDto boardDto, List<MultipartFile> file, HttpServletRequest request) {
        String contents = boardDto.getContents();
        List<String> filePath = new ArrayList<>();
        List<String> fileNameList = boardService.getBoardContents(boardDto.getBoardNo()).getFileNameList();
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

        boardService.updateBoard(boardDto, filePath, fileNameDbList);
        return "redirect:/board/list";
    }

}