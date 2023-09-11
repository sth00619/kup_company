package com.kupstudio.incompany.controller.vietnam.novelis;

import com.kupstudio.incompany.dto.vietnam.novelis.VietnamDocDto;
import com.kupstudio.incompany.service.cloud.CloudService;
import com.kupstudio.incompany.service.vietnam.novelis.NovelisVietnamDocService;
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
@RequestMapping("vietnam/novelis/vietnamDoc")
@RequiredArgsConstructor
public class NovelisVietnamDocController {

    private final static String DIRECTORY_PATH = "vietnam/novelis/vietnam_doc/";
    private final NovelisVietnamDocService vietnamDocService;
    private final CloudService cloudService;

    @Value("${cloud.aws.s3Url}")
    private String cloudUrl;

    @GetMapping("/list")
    public String vietnamDoc(Model model) {


        List<VietnamDocDto> vietnamDocList = vietnamDocService.getVietnamDocList();

        model.addAttribute("vietnamDocList", vietnamDocList);


        return "vietnam/novelis/vietnamDoc/list";

    }

    @GetMapping("/info")
    public String vietnamDocInfo(Model model, @RequestParam(value = "poIdxNo") Integer poIdxNo) {


        VietnamDocDto vietnamDoc = vietnamDocService.getVietnamDoc(poIdxNo);

        model.addAttribute("cloudUrl", cloudUrl + DIRECTORY_PATH);

        model.addAttribute("vd", vietnamDoc);


        return "vietnam/novelis/vietnamDoc/info";

    }

    @PostMapping("/info")
    public String updateVietnamDoc(VietnamDocDto vietnamDocDto, MultipartHttpServletRequest request) {


        vietnamDocService.updateVietnamDoc(vietnamDocDto, request);
        return "redirect:/vietnam/novelis/vietnamDoc/info?poIdxNo=" + vietnamDocDto.getPoIdxNo();

    }


    @GetMapping("/edit")
    public String vietnamDocEdit(Model model, @RequestParam(value = "poIdxNo") Integer poIdxNo) {


        VietnamDocDto vietnamDoc = vietnamDocService.getVietnamDoc(poIdxNo);

        model.addAttribute("cloudUrl", cloudUrl + DIRECTORY_PATH);

        model.addAttribute("vd", vietnamDoc);


        return "vietnam/novelis/vietnamDoc/edit";

    }


    @ResponseBody
    @PostMapping("/update")
    public void updateVietnamDoc(String columnName,
                                 String value,
                                 int poIdxNo,
                                 String poNo,
                                 String action) {
        vietnamDocService.updateVietnamDocPart(columnName, value, poIdxNo, poNo, action);
    }

    @ResponseBody
    @DeleteMapping("/deleteFile")
    public void deleteFile(String fileName) {
        cloudService.delete(DIRECTORY_PATH + fileName);

    }

}
