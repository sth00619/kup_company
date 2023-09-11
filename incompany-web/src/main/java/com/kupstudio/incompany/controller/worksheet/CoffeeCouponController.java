package com.kupstudio.incompany.controller.worksheet;

import com.github.pagehelper.PageInfo;
import com.kupstudio.incompany.dto.worksheet.CoffeeCouponDto;
import com.kupstudio.incompany.enumClass.AuthNameEnum;
import com.kupstudio.incompany.service.auth.AuthService;
import com.kupstudio.incompany.service.worksheet.CoffeeCouponService;
import com.kupstudio.incompany.util.PageInfoUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Slf4j
@Controller
@RequestMapping("/worksheet/cafe")
@RequiredArgsConstructor
public class CoffeeCouponController {
    private final int COUNT_PER_PAGE = 10;  //페이징
    private final String DEFAULT_PAGE_STR = "1";    //페이징
    private final CoffeeCouponService coffeeCouponService;
    private final AuthService authService;

    @GetMapping("/coffeeCoupon")
    public String coffeeCoupon(Model model, @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum, @RequestParam(value = "isUsed", required = false, defaultValue = "-1") int isUsed, RedirectAttributes reAttr){
        boolean isAuth = authService.hasAuth(AuthNameEnum.CAFE_SCHEDULE);
        if (!isAuth) {
            reAttr.addAttribute("message", "게시글 권한이 없습니다.");
            return "redirect:/worksheet/document/documentList";
        }

        PageInfo<CoffeeCouponDto> coffeeCouponList = PageInfo.of(coffeeCouponService.getCoffeeCouponList(pageNum, COUNT_PER_PAGE, isUsed), COUNT_PER_PAGE);
        model.addAttribute("coffeeCouponList", coffeeCouponList);

        // 페이징 start, end 세팅
        coffeeCouponList = PageInfoUtil.setPageNation(coffeeCouponList, pageNum, COUNT_PER_PAGE);
        model.addAttribute("pageList", coffeeCouponList);
        model.addAttribute("pageNum", pageNum);

        model.addAttribute("urlName", "커피 쿠폰 내역");
        model.addAttribute("title", "커피 쿠폰 내역");
        return "worksheet/cafe/coffeeCoupon";
    }
}
