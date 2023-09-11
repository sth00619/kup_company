package com.kupstudio.incompany.controller.worksheet;

import com.github.pagehelper.PageInfo;
import com.kupstudio.incompany.dto.worksheet.SignatureDto;
import com.kupstudio.incompany.enumClass.AuthNameEnum;
import com.kupstudio.incompany.enumClass.signature.SignatureCategoryEnum;
import com.kupstudio.incompany.service.auth.AuthService;
import com.kupstudio.incompany.service.cloud.CloudService;
import com.kupstudio.incompany.service.worksheet.SignatureService;
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
import java.util.Arrays;
import java.util.List;

@Slf4j
@Controller
@RequestMapping("/worksheet/signature")
@RequiredArgsConstructor
public class SignatureController {

    private final SignatureService signatureService;
    private final CloudService cloudService;
    private final AuthService authService;

    private final String ADD_SIGNATURE_SALES = "매출추가";
    private final String SIGNATURE_SALES_INFO = "매출내용";
    private final String SIGNATURE_SALES_LIST = "(주)카페시그니처";
    private final String GANG_NAME_SIGNATURE_SALES_LIST = "강남시그니처";
    private final String HAE_UN_DAE_SIGNATURE_SALES_LIST = "해운대시그니처";
    private final static String DIRECTORY_PATH = "signature/";
    private final static String[] IMAGE_EXTENSION = {"png", "jpg", "jpeg", "gif"}; // 이미지 확장자

    private final int COUNT_PER_PAGE = 10;  //페이징
    private final String DEFAULT_PAGE_STR = "1";    //페이징


    @Value("${cloud.aws.s3Url}")
    private String cloudUrl;

    /**
     * 그래프 데이터 ajax로 받아오기
     * @param chartData
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/signatureChart", method = RequestMethod.POST)
    public List<SignatureDto> getSignatureSalesChartByMonth (@RequestParam(value = "category", required = false) Integer category,
                                                             @RequestParam(value = "chartData") String chartData) {

        return signatureService.getSignatureSalesChartByMonth(category, chartData);
    }

    @PostMapping("/updateSignatureSales")
    public String updateSignatureSales (@ModelAttribute(value = "SignatureDto") SignatureDto signatureDto,
                                        List<MultipartFile> file, HttpServletRequest request) {

        int signatureSalesNo = signatureDto.getSignatureSalesNo();
        List<String> fileNameList = signatureService.getSignatureSalesInfoBySignatureSalesNo(signatureSalesNo).getFileNameList();
        List<String> filePath = new ArrayList<>();
        List<String> fileNameDbList = new ArrayList<>();

        if (request.getParameterValues("fileNameDb") != null) {
            fileNameDbList = List.of(request.getParameterValues("fileNameDb"));
        }

        // 파일 목록 동일할 경우 cloud 삭제 x
        for (String fileDb : fileNameList) {
            String queryFileDb = StringUtils.replace(fileDb, cloudUrl,"");
            if (!fileNameDbList.contains(queryFileDb)) {
                cloudService.deleteAndReplaceUrl(fileDb);
            }
        }

        String directoryPath = DIRECTORY_PATH;

        // 파일 추가
        if (CollectionUtils.isNotEmpty(file) && !file.get(0).isEmpty()) {
            filePath = cloudService.upload(file, directoryPath);
        }
        signatureService.updateSignatureSales(signatureDto, filePath, fileNameDbList);
        return "redirect:/worksheet/signature/signatureSalesInfo?signatureSalesNo=" + signatureSalesNo;
    }

    @GetMapping("/updateSignatureSales")
    public String updateSignatureSalesForm (Model model, RedirectAttributes reAttr,
                                            @RequestParam(value = "signatureSalesNo") int signatureSalesNo) {

        /* 권한 체크 */
        boolean isAuth = authService.hasAuth(AuthNameEnum.SIGNATURE_SALES);
        if (!isAuth) {
            reAttr.addAttribute("message", "게시글 권한이 없습니다.");
            reAttr.addAttribute("isSuccess", "false");
            return "redirect:/index";
        }

        SignatureDto signatureDto = signatureService.getSignatureSalesInfoBySignatureSalesNo(signatureSalesNo);
        model.addAttribute("signatureDto", signatureDto);

        List<SignatureCategoryEnum> signatureCategoryList = SignatureCategoryEnum.getAllCategoryEnum();
        model.addAttribute("signatureCategoryList", signatureCategoryList);

        // 첨부파일
        List<String> fileList = cloudService.removeUrl(signatureDto.getAttacheFiles());
        model.addAttribute("fileList", fileList);

        model.addAttribute("urlName", SIGNATURE_SALES_INFO);
        model.addAttribute("title", SIGNATURE_SALES_INFO);
        return "worksheet/signature/updateSignatureSales";
    }


    @GetMapping("/signatureSalesList")
    public String getSignatureSalesList (Model model, RedirectAttributes reAttr,
                                         @RequestParam(value = "category", required = false) Integer category,
                                         @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum) {

        /* 권한 체크 */
        boolean isAuth = authService.hasAuth(AuthNameEnum.SIGNATURE_SALES);
        if (!isAuth) {
            reAttr.addAttribute("message", "게시글 권한이 없습니다.");
            reAttr.addAttribute("isSuccess", "false");
            return "redirect:/index";
        }

        /* 시그니처 카테고리*/
        List<SignatureCategoryEnum> signatureCategoryList = SignatureCategoryEnum.getAllCategoryEnum();
        model.addAttribute("signatureCategoryList", signatureCategoryList);

        PageInfo<SignatureDto> signatureDtoList = PageInfo.of(signatureService.getSignatureSalesList(category, null, pageNum, COUNT_PER_PAGE), COUNT_PER_PAGE);
        model.addAttribute("signatureDtoList", signatureDtoList);

        // 페이징 start, end 세팅
        signatureDtoList = PageInfoUtil.setPageNation(signatureDtoList, pageNum, COUNT_PER_PAGE);
        // 페이징에서 사용할 리스트 세팅
        model.addAttribute("pageList", signatureDtoList);
        model.addAttribute("pageNum", pageNum);

        if(category != null) {
            String categoryMeaning = SignatureCategoryEnum.getMeaning(category);
            model.addAttribute("categoryMeaning", categoryMeaning);
            model.addAttribute("category", category);
        }

        if(category == null) {
            model.addAttribute("urlName", SIGNATURE_SALES_LIST);
            model.addAttribute("title", SIGNATURE_SALES_LIST);
        } else if (category == 1) {
            model.addAttribute("urlName", GANG_NAME_SIGNATURE_SALES_LIST);
            model.addAttribute("title", GANG_NAME_SIGNATURE_SALES_LIST);
        } else if (category == 2) {
            model.addAttribute("urlName", HAE_UN_DAE_SIGNATURE_SALES_LIST);
            model.addAttribute("title", HAE_UN_DAE_SIGNATURE_SALES_LIST);
        }
        return "worksheet/signature/signatureSalesList";
    }

    @PostMapping("/addSignatureSales")
    public String addSignatureSales (@ModelAttribute(value = "SignatureDto") SignatureDto signatureDto,
                                     List<MultipartFile> multipartFile) {

        signatureService.addSignatureSales(signatureDto, multipartFile);

        return "redirect:/worksheet/signature/signatureSalesList";
    }

    @GetMapping("/addSignatureSales")
    public String addSignatureSalesForm (Model model, RedirectAttributes reAttr) {

        /* 권한 체크 */
        boolean isAuth = authService.hasAuth(AuthNameEnum.SIGNATURE_SALES);
        if (!isAuth) {
            reAttr.addAttribute("message", "게시글 권한이 없습니다.");
            reAttr.addAttribute("isSuccess", "false");
            return "redirect:/index";
        }

        /* 시그니처 카테고리*/
        List<SignatureCategoryEnum> signatureCategoryList = SignatureCategoryEnum.getAllCategoryEnum();
        model.addAttribute("signatureCategoryList", signatureCategoryList);

        model.addAttribute("urlName", ADD_SIGNATURE_SALES);
        model.addAttribute("title", ADD_SIGNATURE_SALES);
        return "worksheet/signature/addSignatureSales";
    }

    @GetMapping("/signatureSalesInfo")
    public String getSignatureSalesInfo (Model model, RedirectAttributes reAttr,
                                         @RequestParam(value = "signatureSalesNo") int signatureSalesNo) {

        /* 권한 체크 */
        boolean isAuth = authService.hasAuth(AuthNameEnum.SIGNATURE_SALES);
        if (!isAuth) {
            reAttr.addAttribute("message", "게시글 권한이 없습니다.");
            reAttr.addAttribute("isSuccess", "false");
            return "redirect:/index";
        }

        SignatureDto signatureDto = signatureService.getSignatureSalesInfoBySignatureSalesNo(signatureSalesNo);
        model.addAttribute("signatureDto", signatureDto);

        // 첨부파일
        List<String> fileList = cloudService.removeUrl(signatureDto.getAttacheFiles());
        model.addAttribute("imgFileUrl", getImgFileUrl(fileList)); //이미지 파일 출력
        model.addAttribute("fileList", fileList);
        model.addAttribute("cloudUrl", cloudUrl);

        // 댓글 조회를 위한 게시물 번호
        model.addAttribute("currentBoardNo", signatureSalesNo);

        model.addAttribute("urlName", SIGNATURE_SALES_INFO);
        model.addAttribute("title", SIGNATURE_SALES_INFO);
        
        return "worksheet/signature/signatureSalesInfo";
    }

    @DeleteMapping("/deleteSignatureSales")
    public String deleteSignatureSales (RedirectAttributes reAttr,
                                        @RequestParam (value = "signatureSalesNo") int signatureSalesNo) {

        /* 권한 체크 */
        boolean isAuth = authService.hasAuth(AuthNameEnum.SIGNATURE_SALES);
        if (!isAuth) {
            reAttr.addAttribute("message", "게시글 권한이 없습니다.");
            reAttr.addAttribute("isSuccess", "false");
            return "redirect:/index";
        }

        signatureService.deleteSignatureSales(signatureSalesNo);
        return "redirect:/worksheet/signature/signatureSalesList";
    }

    /**
     * 확장자 조건에 맞을 경우
     * 이미지 파일을 출력한다.
     * @param fileNameList
     * @return
     */
    public List<String> getImgFileUrl (List<String> fileNameList) {
        boolean isContain = false;

        String [] arrExt = IMAGE_EXTENSION; // 확장자 배열

        List<String> imgFileUrl = new ArrayList<>();

        for(String fileUrl : fileNameList) {
            String ext = fileUrl.substring(fileUrl.lastIndexOf(".") + 1); //확장자 추출
            isContain = Arrays.asList(arrExt).contains(ext);

            if(isContain) {
                imgFileUrl.add(cloudUrl + fileUrl);
            }
        }
        return imgFileUrl;
    }
}
