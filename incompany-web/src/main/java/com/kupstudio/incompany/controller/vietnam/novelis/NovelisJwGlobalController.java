package com.kupstudio.incompany.controller.vietnam.novelis;

import com.kupstudio.incompany.dto.vietnam.novelis.JwGlobalDto;
import com.kupstudio.incompany.service.cloud.CloudService;
import com.kupstudio.incompany.service.vietnam.novelis.NovelisJwGlobalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.util.List;

@Slf4j
@Controller
@RequestMapping("vietnam/novelis/jwGlobal")
@RequiredArgsConstructor
public class NovelisJwGlobalController {

    private final static String DIRECTORY_PATH = "vietnam/novelis/jw_global/";

    private final NovelisJwGlobalService jwGlobalService;
    private final CloudService cloudService;
    @Value("${cloud.aws.s3Url}")
    private String cloudUrl;

    @GetMapping("/list")
    public String jwGlobalList(Model model) {


        List<JwGlobalDto> jwGlobalList = jwGlobalService.getJwGlobalList();

        model.addAttribute("jwGlobalList", jwGlobalList);

        return "vietnam/novelis/jwGlobal/list";

    }


    @GetMapping("/info")
    public String jwGlobalInfo(Model model, Integer poIdxNo) {

        JwGlobalDto jwGlobalDto = jwGlobalService.getJwGlobal(poIdxNo);
        model.addAttribute("jw", jwGlobalDto);

        model.addAttribute("cloudUrl", cloudUrl + DIRECTORY_PATH);


        return "vietnam/novelis/jwGlobal/info";

    }

    @GetMapping("/edit")
    public String jwGlobalForm(Model model, Integer poIdxNo) {
        JwGlobalDto jwGlobalDto = jwGlobalService.getJwGlobal(poIdxNo);
        model.addAttribute("jw", jwGlobalDto);
        model.addAttribute("cloudUrl", cloudUrl + DIRECTORY_PATH);


        return "vietnam/novelis/jwGlobal/edit";
    }

    @PostMapping("/info")
    public String updateJwGlobal(JwGlobalDto jwGlobalDto, MultipartHttpServletRequest request) {


        jwGlobalService.updateJwGlobal(jwGlobalDto, request);
        return "redirect:/vietnam/novelis/jwGlobal/info?poIdxNo=" + jwGlobalDto.getPoIdxNo();

    }


    @ResponseBody
    @PostMapping("/update")
    public void updateJwGlobalPart(String columnName,
                                   String value,
                                   int poIdxNo, String poNo, String action) {
        jwGlobalService.updateJwGlobalPart(columnName, value, poIdxNo, poNo, action);
    }

    @ResponseBody
    @DeleteMapping("/deleteFile")
    public void deleteFile(String fileName) {
        cloudService.delete(DIRECTORY_PATH + fileName);

    }

}
