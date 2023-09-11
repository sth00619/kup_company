package com.kupstudio.incompany.controller.potential;

import com.kupstudio.incompany.enumClass.AuthNameEnum;
import com.kupstudio.incompany.interceptor.exception.ParsedFileException;
import com.kupstudio.incompany.service.auth.AuthService;
import com.kupstudio.incompany.service.potential.UploadFileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Slf4j
@Controller
@RequiredArgsConstructor
@RequestMapping("/potential/uploadFile")
public class PotentialUploadFileController {
    private final UploadFileService uploadFileService;
    private final AuthService authService;
    private final String DB_EXEL_ADD_TITLE = "DB엑셀입력";
    private final String NOT_AUTH_MESSAGE = "권한이 없습니다.";

    //파일 업로드
    @GetMapping("/uploadFile")
    public String uploadFile(HttpServletRequest request, Model model, RedirectAttributes reAttr,
                             @RequestParam(value = "isSuccess", required = false, defaultValue = "true") Boolean isSuccess,
                             @RequestParam(value = "errorMessage", required = false) String errorMessage) {
        // 접근 권한 체크 > false -> 홈 화면 이동
        if(!authService.hasAuth(AuthNameEnum.ROOT_ADMIN)) {
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", NOT_AUTH_MESSAGE);
            return "redirect:/index";
        }
        if (isSuccess == null) isSuccess = true;
        model.addAttribute("isSuccess", isSuccess);
        model.addAttribute("errorMessage", errorMessage);
        model.addAttribute("title", DB_EXEL_ADD_TITLE);
        model.addAttribute("urlName", DB_EXEL_ADD_TITLE);
        return "potential/uploadFile/uploadFile";
    }

    //파일업로드
    @RequestMapping(value = "/fileAdd", method = RequestMethod.POST)
    @ExceptionHandler(ParsedFileException.class)
    public String fileAdd(RedirectAttributes reAttr, Model model,
                          @RequestParam(value = "isSuccess", required = false, defaultValue = "true") Boolean isSuccess,
                          @RequestParam(value = "fileName") MultipartFile fileUpload) {
        // 접근 권한 체크 > false -> 홈 화면 이동
        if(!authService.hasAuth(AuthNameEnum.ROOT_ADMIN)) {
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", NOT_AUTH_MESSAGE);
            return "redirect:/index";
        }
        if (isSuccess == null) isSuccess = true;
        try {

           List<String> notAddPotentialUserNameList = uploadFileService.fileUpload(fileUpload);
           if (notAddPotentialUserNameList.size() > 0) {
               model.addAttribute("notAddPotentialUserNameList", notAddPotentialUserNameList.toString() + "님은 이미 저장되어있습니다.");
           }

        } catch (ParsedFileException pe) {

            reAttr.addAttribute("errorMessage", pe.getMessage());
            reAttr.addAttribute("isSuccess", false);
            log.info("PotentialUploadFileController errorMessage {}", pe.getMessage());
            return "redirect:/potential/uploadFile/uploadFile";

        } catch (Exception e) {

            reAttr.addAttribute("errorMessage", e.getMessage());
            reAttr.addAttribute("isSuccess", false);
            log.info("PotentialUploadFileController errorMessage {}", e.getMessage());
            return "redirect:/potential/uploadFile/uploadFile";
            
        }

        model.addAttribute("title", DB_EXEL_ADD_TITLE);
        model.addAttribute("urlName", DB_EXEL_ADD_TITLE);
        model.addAttribute("isSuccess", isSuccess);
        return "potential/uploadFile/fileAdd";
    }
}