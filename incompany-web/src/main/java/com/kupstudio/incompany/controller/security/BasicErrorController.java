package com.kupstudio.incompany.controller.security;

import com.kupstudio.incompany.enumClass.errorStatus.ErrorStatusCodeEnum;
import org.springframework.boot.autoconfigure.web.servlet.error.AbstractErrorController;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

@Controller
@RequestMapping("${server.error.path:${error.path:/error}}")
public class BasicErrorController extends AbstractErrorController {


    public BasicErrorController(ErrorAttributes errorAttributes) {
        super(errorAttributes);
    }

    @RequestMapping
    public String customError(HttpServletRequest request, Model model) {
        HttpStatus httpStatus = getStatus(request);
        Integer statusCode = httpStatus.value();

        model.addAttribute("statusCode", statusCode);
        model.addAttribute("message", ErrorStatusCodeEnum.getMessage(statusCode));

        return "account/accessDenied";
    }

}
