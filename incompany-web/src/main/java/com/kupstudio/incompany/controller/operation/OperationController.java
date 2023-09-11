package com.kupstudio.incompany.controller.operation;

import com.kupstudio.incompany.enumClass.AuthNameEnum;
import com.kupstudio.incompany.service.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequiredArgsConstructor
public class OperationController {

    private final AuthService authService;

    private final String NOT_AUTH_MESSAGE = "권한이 없습니다.";

    /**
     * 운영 페이지들이 링크 걸린 페이지
     *
     * @return
     */
    @GetMapping("/operation/operationHome")
    public String operationPage(RedirectAttributes reAttr) {
        // 접근 권한 체크 > false -> 홈 화면 이동
        if(authService.hasAuth(AuthNameEnum.ROOT_ADMIN)) return "operation/operationHome";
        reAttr.addAttribute("isSuccess", false);
        reAttr.addAttribute("message", NOT_AUTH_MESSAGE);
        return "redirect:/index";
    }
}