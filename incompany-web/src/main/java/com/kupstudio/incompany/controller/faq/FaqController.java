package com.kupstudio.incompany.controller.faq;

import com.github.pagehelper.PageInfo;
import com.kupstudio.incompany.dto.EmployeeDto;
import com.kupstudio.incompany.dto.faq.FaqDto;
import com.kupstudio.incompany.enumClass.FAQ.FaqTypeEnum;
import com.kupstudio.incompany.service.EmployeeService;
import com.kupstudio.incompany.service.auth.AuthService;
import com.kupstudio.incompany.service.faq.FaqService;
import com.kupstudio.incompany.util.PageInfoUtil;
import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@Controller
@RequestMapping("/faq")
@RequiredArgsConstructor
public class FaqController {

    private static final String TITLE_NAME = "FAQ";
    private final String DEFAULT_PAGE_STR = "1";
    private final FaqService faqService;
    private final AuthService authService;
    private final EmployeeService employeeService;
    /* 페이징 관련 상수 */
    private final int COUNT_PER_PAGE = 6;   // 화면에 노출시킬 리스트 개수 (페이지 개수x)
    @Value("${cloud.aws.s3Url}")
    private String cloudUrl;

    @GetMapping("/addFaq")
    public String addFaqForm(Model model) {
        //로그인한 사원의 정보
        String loginEmployeeCode = authService.getEmployeeCode();
        EmployeeDto employeeDto = employeeService.getOneEmployeeInfo(loginEmployeeCode);
        model.addAttribute("employeeDto", employeeDto);
        model.addAttribute("loginEmployeeCode", loginEmployeeCode);

        // FaqTypeEnum type 가져오기
        List<FaqTypeEnum> faqType = FaqTypeEnum.getAllTypeEnum();
        model.addAttribute("faqType", faqType);

        model.addAttribute("urlName", TITLE_NAME);
        model.addAttribute("title", TITLE_NAME);
        return "faq/addFaq";
    }

    @SneakyThrows
    @PostMapping("/addFaq")
    public String addFaq(FaqDto faqDto) {

        faqService.addFaq(faqDto);

        return "redirect:/faq/list";
    }

    // faq 삭제
    @ResponseBody
    @DeleteMapping("/deleteFaq")
    public void deleteFaq(int faqNo) {

        faqService.deleteFaq(faqNo);

    }


    //faq 조회
    @GetMapping("/list")
    public String faqList(Model model,
                          @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum,
                          @RequestParam(value = "title", required = false) String title,
                          @RequestParam(value = "type", required = false) Long type,
                          @RequestParam(value = "faqNo", required = false) Integer faqNo


    ) {
        PageInfo<FaqDto> faqList = PageInfo.of(faqService.getFaqList(pageNum, title, type), COUNT_PER_PAGE);
        faqList = PageInfoUtil.setPageNation(faqList, pageNum, COUNT_PER_PAGE);

        model.addAttribute("type", type);
        model.addAttribute("searchTitle", title);
        model.addAttribute("faqList", faqList);
        // 페이징에서 사용할 리스트 세팅
        model.addAttribute("pageList", faqList);
        model.addAttribute("pageNum", pageNum);
        // 페이지 정보
        model.addAttribute("title", TITLE_NAME);
        model.addAttribute("urlName", TITLE_NAME);

        model.addAttribute("faqNo", faqNo);

        return "faq/list";
    }

    //faq 게시글 상세보기
    @GetMapping("/contents")
    public String faqContents(Model model, @RequestParam(value = "faqNo") int faqNo) {
        FaqDto faqContents = faqService.getFaqContents(faqNo);

        model.addAttribute("cloudUrl", cloudUrl);
        model.addAttribute("faqContents", faqContents);

        model.addAttribute("title", TITLE_NAME);
        model.addAttribute("urlName", TITLE_NAME);
        return "faq/contents";
    }

    //faq 게시글 수정
    @GetMapping("/updateFaq")
    public String updateFaqForm(Model model, @RequestParam(value = "faqNo") int faqNo,
                                @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum,
                                @RequestParam(value = "type", required = false) Long type) {
        FaqDto faqContents = faqService.getFaqContents(faqNo);

        model.addAttribute("faqContents", faqContents);

        // FaqTypeEnum type 가져오기
        List<FaqTypeEnum> faqType = FaqTypeEnum.getAllTypeEnum();
        model.addAttribute("faqType", faqType);
        model.addAttribute("pageNum", pageNum);
        model.addAttribute("pageType", type);


        model.addAttribute("title", TITLE_NAME);
        model.addAttribute("urlName", TITLE_NAME);
        return "faq/updateFaq";
    }

    @PutMapping("/updateFaq")
    public String updateFaq(FaqDto faqDto,
                            @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum,
                            @RequestParam(value = "pageType", required = false) Integer pageType) {


        faqService.updateFaq(faqDto);
        if (pageType == null) {
            return "redirect:/faq/list?faqNo=" + faqDto.getFaqNo() + "&pageNum=" + pageNum;

        } else {
            return "redirect:/faq/list?faqNo=" + faqDto.getFaqNo() + "&pageNum=" + pageNum + "&type=" + pageType;

        }
    }


}