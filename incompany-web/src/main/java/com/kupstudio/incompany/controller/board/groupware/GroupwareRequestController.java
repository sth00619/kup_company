package com.kupstudio.incompany.controller.board.groupware;

import com.github.pagehelper.PageInfo;
import com.kupstudio.incompany.dto.EmployeeDto;
import com.kupstudio.incompany.dto.board.GroupwareRequestDto;
import com.kupstudio.incompany.service.EmployeeService;
import com.kupstudio.incompany.service.auth.AuthService;
import com.kupstudio.incompany.service.board.GroupwareRequestService;
import com.kupstudio.incompany.service.cloud.CloudService;
import com.kupstudio.incompany.util.PageInfoUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Controller
@RequestMapping("/groupware")
@RequiredArgsConstructor
public class GroupwareRequestController {

    @Value("${cloud.aws.s3Url}")
    private String cloudUrl;
    private final AuthService authService;
    private final EmployeeService employeeService;
    private final GroupwareRequestService groupwareRequestService;
    private final CloudService cloudService;
    private final String ADD = "요청사항";
    private final String LIST = "요청사항 목록";
    private final String INFO = "요청사항 상세보기";
    private static final String[] IMAGE_EXTENSION = {"png", "jpg", "jpeg", "gif"};
    private final int COUNT_PER_PAGE = 10;  //페이징
    private final String DEFAULT_PAGE_STR = "1";    //페이징

    @PostMapping("/updateRequest")
    public String updateGroupwareRequest (@ModelAttribute(value = "GroupwareRequestDto") GroupwareRequestDto groupwareRequestDto) {
        int groupwareRequestNo = groupwareRequestDto.getGroupwareRequestNo();
        groupwareRequestService.updateGroupwareRequest(groupwareRequestDto, cloudUrl);

        return "redirect:/groupware/requestInfo?groupwareRequestNo=" + groupwareRequestNo;
    }

    @GetMapping("/updateRequest")
    public String getUpdateGroupwareRequest (Model model,
                                             @RequestParam(value = "groupwareRequestNo") int groupwareRequestNo) {

        GroupwareRequestDto groupwareRequestDto = groupwareRequestService.getGroupwareRequestInfo(groupwareRequestNo);
        model.addAttribute("groupwareRequestDto", groupwareRequestDto);
        String loginECode = authService.getEmployeeCode();
        model.addAttribute("loginECode", loginECode);

        // 첨부파일
        List<String> fileList = cloudService.removeUrl(groupwareRequestDto.getAttacheFiles());
        model.addAttribute("cloudUrl", cloudUrl);
        model.addAttribute("fileList", fileList);

        model.addAttribute("urlName", ADD);
        model.addAttribute("title", ADD);
        return "groupware/updateRequest";
    }

    @GetMapping("/requestInfo")
    public String getGroupwareRequestInfo (Model model,
                                           @RequestParam(value = "groupwareRequestNo") int groupwareRequestNo) {

        GroupwareRequestDto groupwareRequestDto = groupwareRequestService.getGroupwareRequestInfo(groupwareRequestNo);
        model.addAttribute("groupwareRequestDto", groupwareRequestDto);
        String loginECode = authService.getEmployeeCode();
        model.addAttribute("loginECode", loginECode);

        // 첨부파일
        List<String> fileList = cloudService.removeUrl(groupwareRequestDto.getAttacheFiles());
        model.addAttribute("cloudUrl", cloudUrl);
        model.addAttribute("fileList", fileList);

        // 첨부파일 이미지 출력
        List<String> imgFileUrl = new ArrayList<>();
        for(String fileUrl : fileList) {
            //확장자 추출 후 특정 확장자 배열에 있는 확장자 일 경우 이미지 노출
            String ext = fileUrl.substring(fileUrl.lastIndexOf(".") + 1);
            if(Arrays.asList(IMAGE_EXTENSION).contains(ext)) {
                imgFileUrl.add(cloudUrl + fileUrl);
            }
        }
        model.addAttribute("imgFileUrl", imgFileUrl);

        // 댓글 조회를 위한 게시물 번호
        model.addAttribute("currentBoardNo", groupwareRequestNo);

        model.addAttribute("urlName", INFO);
        model.addAttribute("title", INFO);

        return "groupware/requestInfo";
    }
    @PostMapping("/addRequest")
    public String addGroupwareRequest (@ModelAttribute(value = "GroupwareRequestDto") GroupwareRequestDto groupwareRequestDto) {

        groupwareRequestService.addGroupwareRequest(groupwareRequestDto);

        return "redirect:/groupware/requestList";
    }

    @GetMapping("/addRequest")
    public String addGroupwareRequestForm (Model model) {

        //로그인한 사원의 정보
        String loginECode = authService.getEmployeeCode();
        EmployeeDto employeeDto = employeeService.getOneEmployeeInfo(loginECode);

        model.addAttribute("loginECode", loginECode);
        model.addAttribute("employeeDto", employeeDto);

        model.addAttribute("urlName", ADD);
        model.addAttribute("title", ADD);

        return "groupware/addRequest";
    }

    @GetMapping("/requestList")
    public String getGroupwareRequestList (Model model,
                                           @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum) {

        PageInfo<GroupwareRequestDto> groupwareRequestList = PageInfo.of(groupwareRequestService.getGroupwareRequestList(pageNum, COUNT_PER_PAGE), COUNT_PER_PAGE);
        model.addAttribute("groupwareRequestList", groupwareRequestList);

        // 페이징 start, end 세팅
        groupwareRequestList = PageInfoUtil.setPageNation(groupwareRequestList, pageNum, COUNT_PER_PAGE);
        // 페이징에서 사용할 리스트 세팅
        model.addAttribute("pageList", groupwareRequestList);
        model.addAttribute("pageNum", pageNum);

        model.addAttribute("urlName", LIST);
        model.addAttribute("title", LIST);

        return "groupware/requestList";
    }

    @DeleteMapping("/deleteRequest")
    public String deleteGroupwareRequest(@RequestParam(value = "groupwareRequestNo") int groupwareRequestNo){
        groupwareRequestService.deleteGroupwareRequest(groupwareRequestNo);
        return "redirect:/groupware/requestList";
    }
}

