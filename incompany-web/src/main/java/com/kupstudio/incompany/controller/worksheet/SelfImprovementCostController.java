package com.kupstudio.incompany.controller.worksheet;

import com.github.pagehelper.PageInfo;
import com.kupstudio.incompany.cacheService.employee.EmployeeCacheService;
import com.kupstudio.incompany.dto.EmployeeDto;
import com.kupstudio.incompany.dto.payment.PaymentDto;
import com.kupstudio.incompany.dto.worksheet.SelfImprovementCostDto;
import com.kupstudio.incompany.enumClass.payment.PaymentBoardTypeEnum;
import com.kupstudio.incompany.enumClass.payment.PaymentStatusEnum;
import com.kupstudio.incompany.security.EmployeePrincipal;
import com.kupstudio.incompany.service.EmployeeService;
import com.kupstudio.incompany.service.auth.AuthService;
import com.kupstudio.incompany.service.cloud.CloudService;
import com.kupstudio.incompany.service.payment.CommonPaymentService;
import com.kupstudio.incompany.service.worksheet.SelfImprovementCostService;
import com.kupstudio.incompany.util.PageInfoUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Slf4j
@Controller
@RequestMapping("/worksheet/selfImprovementCost")
@RequiredArgsConstructor
public class SelfImprovementCostController {

    private final AuthService authService;
    private final EmployeeService employeeService;
    private final SelfImprovementCostService selfImprovementCostService;
    private final CloudService cloudService;
    private final EmployeeCacheService employeeCacheService;
    private final CommonPaymentService commonPaymentService;

    private static final PaymentBoardTypeEnum BOARD_ENUM = PaymentBoardTypeEnum.SELF_IMPROVEMENT_COST;
    private static final int BOARD_TYPE = BOARD_ENUM.getBoardType();
    private final static String DIRECTORY_PATH = "self_improvement_cost/";
    private String ADD = "자기계발비 신청";
    private String INFO = "자기계발비";
    private String LIST = "신청 내역";
    private String UPDATE = "자기계발비 수정";
    private final int COUNT_PER_PAGE = 10;  //페이징
    private final String DEFAULT_PAGE_STR = "1";    //페이징
    private final static String[] IMAGE_EXTENSION = {"png", "jpg", "jpeg", "gif"}; // 이미지 확장자
    @Value("${cloud.aws.s3Url}")
    private String cloudUrl;


    @PostMapping("/updateSelfImprovementCost")
    public String updateSelfImprovementCost(@RequestParam(value = "selfImprovementCostNo") int selfImprovementCostNo
                                            ,@ModelAttribute(value = "SelfImprovementCostDto") SelfImprovementCostDto selfImprovementCostDto,
                                            List<MultipartFile> file, HttpServletRequest request,
                                            @AuthenticationPrincipal EmployeePrincipal employee){

        String loginEmployeeCode = employee.getUsername();
        boolean isModify = true;
        String title = selfImprovementCostDto.getTitle();

        List<String> fileNameDbList = new ArrayList<>();
        if (request.getParameterValues("fileNameDb") != null) {
            fileNameDbList = List.of(request.getParameterValues("fileNameDb"));
        }

        // 파일 목록 동일할 경우 cloud 삭제 x
        List<String> fileNameList = selfImprovementCostService.getSelfImprovementCostInfo(selfImprovementCostNo).getFileNameList();
        for (String fileDb : fileNameList) {
            String queryFileDb = StringUtils.replace(fileDb, cloudUrl,"");
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

        selfImprovementCostService.updateSelfImprovementCost(selfImprovementCostDto, filePathList, fileNameDbList, loginEmployeeCode, isModify, title);

        return "redirect:/worksheet/selfImprovementCost/selfImprovementCostInfo?selfImprovementCostNo="+selfImprovementCostNo;
    }

    @GetMapping("/updateSelfImprovementCost")
    public String updateSelfImprovementCostForm(Model model,
                                            @RequestParam(value = "selfImprovementCostNo") int selfImprovementCostNo){

        SelfImprovementCostDto selfImprovementCostDto = selfImprovementCostService.getSelfImprovementCostInfo(selfImprovementCostNo);
        model.addAttribute("selfImprovementCostDto", selfImprovementCostDto);

        // 작성자 정보
        String createECode = selfImprovementCostDto.getEmployeeCode();
        String createEName = employeeService.getEmployeeNameByEmployeeCode(createECode);
        model.addAttribute("createEName", createEName);

        // 게시글 작성자 정보
        String employeeCode = selfImprovementCostDto.getEmployeeCode();
        EmployeeDto employeeDto = employeeService.getOneEmployeeInfo(employeeCode);

        // 첨부파일
        List<String> fileList = cloudService.removeUrl(selfImprovementCostDto.getAttacheFiles());
        model.addAttribute("fileList", fileList);

        // 결재 > 결재자, 참조자 리스트를 위한 모든 사원 리스트
        model.addAttribute("allEmployee", employeeCacheService.getAllEmployee());

        // 결재 > 결재자, 참조자 조회
        PaymentDto payment = commonPaymentService.getPaymentEmployee(selfImprovementCostNo, BOARD_TYPE);
        payment = payment != null ? payment : new PaymentDto();
        model.addAttribute("payment", payment);

        // 결재 > 필수 정보
        model.addAttribute("loginEmployeeCode", authService.getEmployeeCode());
        model.addAttribute("boardType", BOARD_TYPE);
        model.addAttribute("no", selfImprovementCostDto.getSelfImprovementCostNo());

        model.addAttribute("urlName", UPDATE);
        model.addAttribute("title", UPDATE);

        return "worksheet/selfImprovementCost/updateSelfImprovementCost";
    }

    @GetMapping("/selfImprovementCostList")
    public String getSelfImprovementCostList(Model model,
                                             @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum){

        PageInfo<SelfImprovementCostDto> selfImprovementCostList = PageInfo.of(selfImprovementCostService.getSelfImprovementCostList(pageNum, COUNT_PER_PAGE), COUNT_PER_PAGE);
        model.addAttribute("selfImprovementCostList", selfImprovementCostList);

        // 페이징 start, end 세팅
        selfImprovementCostList = PageInfoUtil.setPageNation(selfImprovementCostList, pageNum, COUNT_PER_PAGE);
        // 페이징에서 사용할 리스트 세팅
        model.addAttribute("pageList", selfImprovementCostList);
        model.addAttribute("pageNum", pageNum);

        model.addAttribute("urlName", LIST);
        model.addAttribute("title", LIST);
        return "worksheet/selfImprovementCost/selfImprovementCostList";
    }

    @GetMapping("/payment/selfImprovementCostList")
    public String getSelfImprovementCostListOfAdmin(Model model,
                                             @RequestParam(value = "pageNum", required = false, defaultValue = DEFAULT_PAGE_STR) int pageNum){

        PageInfo<SelfImprovementCostDto> selfImprovementCostList = PageInfo.of(selfImprovementCostService.getSelfImprovementCostListFromPayment(pageNum, COUNT_PER_PAGE), COUNT_PER_PAGE);
        model.addAttribute("selfImprovementCostList", selfImprovementCostList);

        // 페이징 start, end 세팅
        selfImprovementCostList = PageInfoUtil.setPageNation(selfImprovementCostList, pageNum, COUNT_PER_PAGE);
        // 페이징에서 사용할 리스트 세팅
        model.addAttribute("pageList", selfImprovementCostList);
        model.addAttribute("pageNum", pageNum);

        model.addAttribute("urlName", LIST);
        model.addAttribute("title", LIST);

        return "worksheet/selfImprovementCost/selfImprovementCostList";
    }

    @GetMapping("/selfImprovementCostInfo")
    public String getSelfImprovementCostInfo(@RequestParam(value = "selfImprovementCostNo") int selfImprovementCostNo,
                                             Model model){

        SelfImprovementCostDto selfImprovementCostDto = selfImprovementCostService.getSelfImprovementCostInfo(selfImprovementCostNo);
        model.addAttribute("selfImprovementCostDto", selfImprovementCostDto);
        String employeeCode = selfImprovementCostDto.getEmployeeCode();

        // 첨부파일
        List<String> fileList = cloudService.removeUrl(selfImprovementCostDto.getAttacheFiles());
        model.addAttribute("imgFileUrl", getImgFileUrl(fileList)); //이미지 파일 출력
        model.addAttribute("fileList", fileList);
        model.addAttribute("cloudUrl", cloudUrl);

        // 결재 > 결재자, 참조자 조회 (결재 fragment 에서 사용할 데이터 세팅)
        PaymentDto payment = commonPaymentService.getPaymentEmployee(selfImprovementCostNo, BOARD_TYPE);
        payment = payment != null ? payment : new PaymentDto();
        payment.setPaymentNo(selfImprovementCostNo);
        payment.setDraftEmployeeCode(employeeCode);
        payment.setStatus(selfImprovementCostDto.getStatus());
        model.addAttribute("payment", payment);

        // 결재 > 필수 정보
        model.addAttribute("loginEmployeeCode", authService.getEmployeeCode());
        model.addAttribute("boardType", BOARD_TYPE);
        model.addAttribute("no", selfImprovementCostDto.getSelfImprovementCostNo());

        model.addAttribute("urlName", INFO);
        model.addAttribute("title", INFO);
        model.addAttribute("paymentTitle" , selfImprovementCostDto.getTitle());
        return "worksheet/selfImprovementCost/selfImprovementCostInfo";
    }


    @PostMapping("/addSelfImprovementCost")
    public String addSelfImprovementCost(@ModelAttribute(value = "SelfImprovementCostDto") SelfImprovementCostDto selfImprovementCostDto,
                                         List<MultipartFile> multipartFile,
                                         @AuthenticationPrincipal EmployeePrincipal employee) {

        String loginEmployeeCode = employee.getUsername();
        boolean isModify = false;
        String title = selfImprovementCostDto.getTitle();

        // 자기계발비 add
        selfImprovementCostService.addSelfImprovementCost(selfImprovementCostDto, multipartFile);

        // 결재자, 참조자 add
        List<String> approverList = selfImprovementCostDto.getApproverList();
        List<String> referrerList = selfImprovementCostDto.getReferrerList();
        int selfImprovementCostNo = selfImprovementCostDto.getSelfImprovementCostNo();
        String employeeCode = selfImprovementCostDto.getEmployeeCode();

        // 결재자, 참조자 등록(INSERT - myPayment, paymentAction)
        commonPaymentService.addPayment(approverList, referrerList, selfImprovementCostNo, employeeCode, BOARD_ENUM, PaymentStatusEnum.PAYMENT_ADD, loginEmployeeCode, isModify, title);

        return "redirect:/worksheet/selfImprovementCost/selfImprovementCostList";
    }

    @GetMapping("/addSelfImprovementCost")
    public String addSelfImprovementCostForm(Model model){

        //로그인한 사원의 정보
        String loginECode = authService.getEmployeeCode();
        EmployeeDto employeeDto = employeeService.getOneEmployeeInfo(loginECode);

        model.addAttribute("loginECode", loginECode);
        model.addAttribute("employeeDto", employeeDto);

        // 결재자, 참조자 리스트를 위한 모든 사원 리스트
        model.addAttribute("allEmployee", employeeCacheService.getAllEmployee());
        model.addAttribute("payment", new PaymentDto());

        model.addAttribute("urlName", ADD);
        model.addAttribute("title", ADD);

        return "worksheet/selfImprovementCost/addSelfImprovementCost";
    }


    @DeleteMapping("/deleteSelfImprovementCost")
    public String deleteSelfImprovementCost(@RequestParam(value = "selfImprovementCostNo") int selfImprovementCostNo){
        selfImprovementCostService.deleteSelfImprovementCost(selfImprovementCostNo, BOARD_ENUM);
        return "redirect:/worksheet/selfImprovementCost/selfImprovementCostList";
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
