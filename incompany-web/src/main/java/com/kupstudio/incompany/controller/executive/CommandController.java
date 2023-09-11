package com.kupstudio.incompany.controller.executive;

import com.github.pagehelper.PageInfo;
import com.kupstudio.incompany.cacheService.employee.EmployeeCacheService;
import com.kupstudio.incompany.dto.EmployeeDto;
import com.kupstudio.incompany.dto.command.CommandDto;
import com.kupstudio.incompany.dto.command.ListDto;
import com.kupstudio.incompany.dto.payment.PaymentDto;
import com.kupstudio.incompany.enumClass.command.CommandCategoryEnum;
import com.kupstudio.incompany.enumClass.payment.PaymentBoardTypeEnum;
import com.kupstudio.incompany.security.EmployeePrincipal;
import com.kupstudio.incompany.service.EmployeeService;
import com.kupstudio.incompany.service.auth.AuthService;
import com.kupstudio.incompany.service.cloud.CloudService;
import com.kupstudio.incompany.service.command.CommandService;
import com.kupstudio.incompany.service.payment.CommonPaymentService;
import com.kupstudio.incompany.service.worksheet.SelfImprovementCostService;
import com.kupstudio.incompany.util.PageInfoUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.collections.ListUtils;
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
import java.util.Arrays;
import java.util.List;

@Slf4j
@Controller
@RequestMapping("/command")
@RequiredArgsConstructor
public class CommandController {

    private final static String DIRECTORY_PATH = "command/";
    private final static PaymentBoardTypeEnum BOARD_ENUM = PaymentBoardTypeEnum.PAYMENT;
    private final static int BOARD_TYPE = BOARD_ENUM.getBoardType();
    private final static String[] IMAGE_EXTENSION = {"png", "jpg", "jpeg", "gif"}; // 이미지 확장자
    public static final String QATEST_00 = "qatest00";
    private final String BOARD_CONTENTS_NAME = "지점장 공지게시판";
    private final CloudService cloudService;
    private final EmployeeService employeeService;
    private final EmployeeCacheService employeeCacheService;
    private final AuthService authService;
    private final CommandService commandService;
    private final SelfImprovementCostService selfImprovementCostService;
    private final CommonPaymentService commonPaymentService;
    /* 페이징 관련 상수 */
    private final int COUNT_PER_PAGE = 10;   // 화면에 노출시킬 리스트 개수 (페이지 개수x)
    private final String DEFAULT_PAGE_STR = "1";
    @Value("${cloud.aws.s3Url}")
    private String cloudUrl;

    @GetMapping("/addCommand")
    public String addCommandForm(Model model) {

        // 로그인한 사원의 정보
        String loginEmployeeCode = authService.getEmployeeCode();
        EmployeeDto employeeDto = employeeService.getOneEmployeeInfo(loginEmployeeCode);
        model.addAttribute("loginEmployeeCode", loginEmployeeCode);
        model.addAttribute("employeeDto", employeeDto);

        // command category 가져오기
        List<CommandCategoryEnum> commandCategory = CommandCategoryEnum.getAllCategoryEnum();
        model.addAttribute("commandCategory", commandCategory);

        // 상위 직급(지점장 이상) 사원 리스트
        model.addAttribute("superiorEmployee", employeeCacheService.getSuperiorEmployee(loginEmployeeCode));

        model.addAttribute("title", BOARD_CONTENTS_NAME);
        model.addAttribute("urlName", BOARD_CONTENTS_NAME);
        CommandDto commandDto = new CommandDto();
        commandDto.setCommandNo(commandDto.getCommandNo());
        model.addAttribute("commandDto", commandDto);
        // commandContents를 모델에 추가하지 않음

        return "command/addCommand";
    }

    @PostMapping("/addCommand")
    public String addCommand(CommandDto commandDto,
                             @RequestParam(value = "referrerList") List<String> referrerList,
                             List<MultipartFile> file) {

        List<String> filePath = new ArrayList<>();
        if (!CollectionUtils.isEmpty(file)) {
            if (!file.get(0).isEmpty()) {
                filePath = cloudService.upload(file, DIRECTORY_PATH);
            }
        }

        Integer commandNo = commandDto.getCommandNo();

        Integer no = commandDto.getCommandNo();

        Integer status = 0;

        // 게시글 내용 추가
        commandService.addCommand(commandDto, filePath);
        // 게시글 참조자 추가
        commandService.addCommandList(commandDto.getCommandNo(), referrerList, status);
        // 게시글 작성자 추가
        commandService.addCommandWriter(commandDto.getCommandNo(), commandDto.getCreateEmployeeCode());
        return "redirect:/command/list";
    }

    @GetMapping("/list")
    public String commandList(Model model,
                              @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum,
                              @RequestParam(required = false) String searchType,
                              @RequestParam(required = false) String keyword,
                              @RequestParam(value = "message", required = false) String message) {

        String employeeCode = authService.getEmployeeCode();

        List<CommandDto> commandList = commandService.getCommandList(pageNum, searchType, keyword, employeeCode);

        PageInfo<CommandDto> pageInfo = PageInfo.of(commandList, COUNT_PER_PAGE);
        pageInfo = PageInfoUtil.setPageNation(pageInfo, pageNum);

        model.addAttribute("employeeCode", employeeCode);
        model.addAttribute("searchType", searchType);
        model.addAttribute("keyword", keyword);

        model.addAttribute("commandList", pageInfo);
        model.addAttribute("pageList", pageInfo);
        model.addAttribute("pageNum", pageNum);

        // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("title", BOARD_CONTENTS_NAME);
        model.addAttribute("urlName", BOARD_CONTENTS_NAME);
        model.addAttribute("message", message);

        return "command/list";
    }


    @GetMapping("/listAdmin")
    public String commandAdminList(Model model,
                              @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum,
                              @RequestParam(required = false) String searchType,
                              @RequestParam(required = false) String keyword,
                              @RequestParam(value = "message", required = false) String message) {

        String employeeCode = authService.getEmployeeCode();
        if(!QATEST_00.equals(employeeCode)) {
            return "redirect:/command/list";
        }
        List<CommandDto> commandList = commandService.getCommandListByAdmin(pageNum);

        PageInfo<CommandDto> pageInfo = PageInfo.of(commandList, COUNT_PER_PAGE);
        pageInfo = PageInfoUtil.setPageNation(pageInfo, pageNum);

        model.addAttribute("employeeCode", employeeCode);
        model.addAttribute("searchType", searchType);
        model.addAttribute("keyword", keyword);

        model.addAttribute("commandList", pageInfo);
        model.addAttribute("pageList", pageInfo);
        model.addAttribute("pageNum", pageNum);

        // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("title", BOARD_CONTENTS_NAME);
        model.addAttribute("urlName", BOARD_CONTENTS_NAME);
        model.addAttribute("message", message);

        return "command/list";
    }


    // 게시글 상세보기
    @GetMapping("/commandInfo")
    public String getCommandContents(Model model, @RequestParam(value = "commandNo") int commandNo) {
        String loginEmployeeCode = authService.getEmployeeCode();


        CommandDto commandContents = commandService.getCommandContents(commandNo);
        model.addAttribute("commandContents", commandContents);

        CommandDto commandDto = commandService.getCommandContents(commandNo);
        model.addAttribute("commandDto", commandDto);

        // 참조자 조회
        List<CommandDto> commandLists = commandService.getCommandLists(commandNo);
        model.addAttribute("commandLists", commandLists);

        List<String> authCommandList = new ArrayList<String>();
        authCommandList.add(QATEST_00);
        authCommandList.add(commandDto.getCreateEmployeeCode());
        for (CommandDto command : commandLists) {
            authCommandList.add(command.getEmployeeCode());
        }

        if (!authCommandList.contains(loginEmployeeCode)) {
            return "redirect:/command/list";
        }

        commandLists = commandLists.isEmpty() ? new ArrayList<>() : commandLists;

        for (CommandDto command : commandLists) {
            command.setCommandNo(commandNo);
            command.setEmployeeCode(command.getEmployeeCode());
            String employeeName = employeeService.getEmployeeNameByEmployeeCode(command.getEmployeeCode());
            Integer status = command.getStatus();
            command.setEmployeeName(employeeName);
            command.setStatus(command.getStatus());
            model.addAttribute("status", status);
        }

        // 로그인 코드
        model.addAttribute("loginEmployeeCode", loginEmployeeCode);

        // command_list 조회
        commandService.getCommandLists(commandNo);
        // 참조자 조회 여부 확인
        commandService.status(commandNo, loginEmployeeCode);
        // 참조자 조회 시 조회 여부 변경
        commandService.statusChange(commandNo, loginEmployeeCode, commandLists);
        // 조회수 증가
        commandService.increaseHit(commandNo);

        // 첨부 파일
        List<String> fileList = cloudService.removeUrl(commandDto.getAttacheFiles());
        model.addAttribute("imgFileUrl", getImgFileUrl(fileList));

        model.addAttribute("fileList", fileList);
        model.addAttribute("cloudUrl", cloudUrl);

        // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("title", BOARD_CONTENTS_NAME);
        model.addAttribute("urlName", BOARD_CONTENTS_NAME);

        // 댓글 연결
        model.addAttribute("currentBoardNo", commandDto.getCommandNo());

        return "command/commandInfo";
    }

    // 삭제
    @DeleteMapping("/deleteCommand")
    public String deleteCommand(@RequestParam(value = "commandNo") Integer commandNo) {

        List<String> fileNameList = commandService.getCommandContents(commandNo).getFileNameList();
        if (!fileNameList.isEmpty()) {
            fileNameList.forEach(name -> cloudService.deleteAndReplaceUrl(name));
        }
        commandService.deleteCommand(commandNo);
        commandService.deleteCommandList(commandNo);
        return "redirect:/command/list";

    }

    // 게시글 수정폼
    @GetMapping("/updateCommand")
    public String updateCommandForm(Model model, RedirectAttributes reAttr,
                                    @RequestParam(value = "commandNo") int commandNo) {

        String loginEmployeeCode = authService.getEmployeeCode();
        EmployeeDto employeeDto = employeeService.getOneEmployeeInfo(loginEmployeeCode);
        model.addAttribute("loginEmployeeCode", loginEmployeeCode);
        model.addAttribute("employeeDto", employeeDto);

        // 권한 체크
        String employeeCode = commandService.getCommandContents(commandNo).getCreateEmployeeCode();
        if (!loginEmployeeCode.equals(employeeCode)) {
            reAttr.addAttribute("message", "수정 권한이 없습니다.");
            return "redirect:/command/list";
        }

        CommandDto commandContents = commandService.getCommandContents(commandNo);
        model.addAttribute("commandContents", commandContents);
        List<String> fileList = cloudService.removeUrl(commandContents.getAttacheFiles());
        model.addAttribute("fileList", fileList);

        //command category 가져오기
        List<CommandCategoryEnum> commandCategory = CommandCategoryEnum.getAllCategoryEnum();
        model.addAttribute("commandCategory", commandCategory);

        // 지점장 이상 상위 직급 직원 리스트 가져오기
        model.addAttribute("superiorEmployee", employeeCacheService.getSuperiorEmployee(loginEmployeeCode));
        model.addAttribute("allEmployee", employeeCacheService.getAllEmployee());

        PaymentDto payment = commandService.getCommandEmployee(commandNo, BOARD_TYPE);
        payment = payment != null ? payment : new PaymentDto();
        model.addAttribute("payment", payment);

        // 컨텐츠 상단 현재 페이지 명
        model.addAttribute("title", BOARD_CONTENTS_NAME);
        model.addAttribute("urlName", BOARD_CONTENTS_NAME);

        // 기존 참조자 목록 가져오기
        List<ListDto> commandLists = commandService.getCommandListEmployeeCode(commandNo);
        model.addAttribute("referrerList", commandLists);

        List<CommandDto> notReadLists = commandService.getNotReadCommandLists(commandNo);
        model.addAttribute("notReadLists", notReadLists);

        return "command/updateCommand";
    }

    // 게시글 수정
    @PostMapping("/updateCommand")
    public String updateCommand(CommandDto commandDto,
                                List<MultipartFile> file, HttpServletRequest request,
                                @RequestParam(value = "commandNo") int commandNo,
                                @RequestParam(value = "notReadLists", required = false) List<String> notReadLists,
                                @RequestParam(value = "referrerList", required = false) List<String> referrerList,
                                Model model, @AuthenticationPrincipal EmployeePrincipal employee) {

        CommandDto commandContents = commandService.getCommandContents(commandDto.getCommandNo());
        // 로그인사용자랑 게시글 작성자가 같을때 수정할수있음 ,  TODO 오류 메시지 추가 필요
        if(!commandContents.getCreateEmployeeCode().equals(authService.getEmployeeCode())) {
            return "redirect:/command/list";
        }

        // 이건 왜 모델에 셋팅했는지 궁금함
        model.addAttribute("commandContents", commandContents);

        String loginEmployeeCode = employee.getUsername();

        boolean isModify = true;
        String title = commandDto.getTitle();

        List<String> fileNameDbList = new ArrayList<>();
        if (request.getParameterValues("fileNameDb") != null) {
            fileNameDbList = List.of(request.getParameterValues("fileNameDb"));
        }

        // 파일이 그대로이면 cloud 삭제 x
        List<String> fileNameList = commandService.getCommandContents(commandDto.getCommandNo()).getFileNameList();
        for (String fileDb : fileNameList) {
            String queryFileDb = StringUtils.replace(fileDb, cloudUrl, "");
            if (!fileNameDbList.contains(queryFileDb)) {
                cloudService.deleteAndReplaceUrl(fileDb);
            }
        }

        String directoryPath = DIRECTORY_PATH;

        // 파일 추가
        List<String> filePathList = new ArrayList<>();
        if (CollectionUtils.isNotEmpty(file) && !file.get(0).isEmpty()) {
            filePathList = cloudService.upload(file, directoryPath);
        }

        if (CollectionUtils.isEmpty(referrerList)) {
            commandService.deleteCommandList(commandNo);
            // 게시글 작성자 추가
            commandService.addCommandWriter(commandNo, authService.getEmployeeCode());
        } else {
            List<String> beforeCommandList = new ArrayList<String>();
            List<CommandDto> commandLists = commandService.getCommandLists(commandNo);
            for (CommandDto command : commandLists) {
                beforeCommandList.add(command.getEmployeeCode());
            }

            List<String> delCommandList = ListUtils.removeAll(beforeCommandList , referrerList);
            List<String> addCommandList = ListUtils.removeAll(referrerList, beforeCommandList);

            commandService.deleteCommandList(commandNo, delCommandList);
            commandService.addCommandList(commandNo, addCommandList, commandDto.getStatus());
        }

        // FIXED 타이틀,컨텐츠 수정 안되는 버그가 있었음 ,기존 게시물 업데이트
        commandService.updateCommand(commandDto, fileNameList, fileNameDbList, loginEmployeeCode, isModify);

        return "redirect:/command/list";
    }

    /**
     * 확장자 조건에 맞을 경우
     * 이미지 파일을 출력한다.
     *
     * @param fileNameList
     * @return
     */
    public List<String> getImgFileUrl(List<String> fileNameList) {
        boolean isContain = false;

        String[] arrExt = IMAGE_EXTENSION; // 확장자 배열

        List<String> imgFileUrl = new ArrayList<>();

        for (String fileUrl : fileNameList) {
            String ext = fileUrl.substring(fileUrl.lastIndexOf(".") + 1); //확장자 추출
            isContain = Arrays.asList(arrExt).contains(ext);

            if (isContain) {
                imgFileUrl.add(cloudUrl + fileUrl);
            }
        }
        return imgFileUrl;
    }


}