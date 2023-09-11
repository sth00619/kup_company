package com.kupstudio.incompany.controller.contractFortune;

import com.github.pagehelper.PageInfo;
import com.kupstudio.incompany.dto.contractStatus.ContractStatusDto;
import com.kupstudio.incompany.dto.event.EventDto;
import com.kupstudio.incompany.enumClass.AuthNameEnum;
import com.kupstudio.incompany.enumClass.event.*;
import com.kupstudio.incompany.service.DepartmentSelectService;
import com.kupstudio.incompany.service.auth.AuthService;
import com.kupstudio.incompany.service.contractStatus.ContractStatusService;
import com.kupstudio.incompany.service.event.EventService;
import com.kupstudio.incompany.util.PageInfoUtil;
import com.kupstudio.incompany.util.StringCustomUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Controller
@RequestMapping("/event")
@RequiredArgsConstructor
public class EventController {
    private final AuthService authService;
    private final EventService eventService;
    private final DepartmentSelectService departmentSelectService;
    private final ContractStatusService contractStatusService;
    private final Integer RESIGN_NUM = 2;   // 0 = 근무자, 1 = 퇴사자, 2 = 전체 조회
    private final int COUNT_PER_PAGE = 10;
    private final String EVENT_OPERATION = "이벤트 관리";
    private final String KH_PROMOTION = "KH 프로모션";
    private final String BRANCH_PROMOTION = "지점 프로모션";
    private final String ALL_EVENT = "EVENT";
    private final String ADD_EVENT = "이벤트 추가";
    private final String UPDATE_EVENT = "이벤트 수정";
    private final String EVENT_INFO_LIST = "순위 리스트";
    private final String COMMON_FILE_URL = "contractFortune/event";
    private final String NOT_AUTH_MESSAGE = "권한이 없습니다.";

    // 운영툴 > 이벤트 관리 시작 -- START

    /**
     * 이벤트 리스트 조회 model 세팅
     * @param model
     * @param eventDto
     */
    private void setEventModel(Model model, EventDto eventDto) throws Exception {

        String loginEmployeeCode = authService.getEmployeeCode();
        model.addAttribute("loginEmployeeCode", loginEmployeeCode);

        // 머리말
        model.addAttribute("category", eventDto.getCategory());

        // 부서 선택 권한에 따라 선택
        int headType = eventDto.getHeadType();
        List<EventCategoryEnum> eventCategoryEnum = authService.hasAuth(AuthNameEnum.CONTRACT_ALL) ? EventCategoryEnum.getAllMeaning(headType) : EventCategoryEnum.getAllMeaningNotAuth(headType, authService.getDepartmentCode());
        model.addAttribute("eventCategoryEnum", eventCategoryEnum);

        // 로그인한 사원에게 CONTRACT_LEADER 권한이 있을 경우 리더 부서 코드 세팅
        String leaderDepartmentCode = authService.getDepartmentCodeByIsAuth(AuthNameEnum.CONTRACT_LEADER);

        // 검색조건 리스트 조회
        List<EventSearchCateEnum> searchCateList = EventSearchCateEnum.getAllMeaning();
        model.addAttribute("searchCateList", searchCateList);
        model.addAttribute("searchKey", eventDto.getSearchKey());
        model.addAttribute("searchValue", eventDto.getSearchValue());
        model.addAttribute("startDate", eventDto.getStartDate());
        model.addAttribute("endDate", eventDto.getEndDate());

        // 리스트 조회
        PageInfo<EventDto> eventList = PageInfo.of(eventService.getEventList(eventDto, COUNT_PER_PAGE),COUNT_PER_PAGE);
        model.addAttribute("eventList", eventList);

        // 페이징 start, end 세팅
        eventList = PageInfoUtil.setPageNation(eventList, eventDto.getPageNum(), COUNT_PER_PAGE);
        model.addAttribute("pageList", eventList);
        model.addAttribute("pageNum", eventDto.getPageNum());

        // 리더권한의 사원이 담당자를 선택하지 않았을 경우 본인의 부서 코드로 세팅
        if (StringUtils.isEmpty(eventDto.getDepartmentCode()) && StringUtils.isNotEmpty(leaderDepartmentCode))
            eventDto.setDepartmentCode(leaderDepartmentCode);

        model.addAttribute("departmentCode", eventDto.getDepartmentCode());
        model.addAttribute("employeeCode", eventDto.getEmployeeCode());

        model.addAttribute("isSuccess", eventDto.getIsSuccess());
        model.addAttribute("message", eventDto.getMessage());
    }

    /**
     * 운영툴 > 이벤트 관리
     * @param model
     * @return
     */
    @GetMapping("/eventOperation")
    public String eventOperation(Model model, RedirectAttributes reAttr, @ModelAttribute EventDto eventDto) throws Exception {
        // 접근 권한 체크 > false -> 홈 화면 이동
        if(!authService.hasAuth(AuthNameEnum.ROOT_ADMIN)) {
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", NOT_AUTH_MESSAGE);
            return "redirect:/index";
        }

        eventDto.setHeadType(EventHeadTypeEnum.ALL.index);
        setEventModel(model, eventDto);

        model.addAttribute("urlName", EVENT_OPERATION);
        model.addAttribute("title", EVENT_OPERATION);

        return COMMON_FILE_URL + "/eventOperation";
    }

    /**
     * 운영툴 > 이벤트 관리 > 이벤트 추가
     * @return
     */
    @GetMapping("/addEvent")
    public String addEvent(Model model){

        // 분류
        model.addAttribute("eventHeadTypeEnum", EventHeadTypeEnum.getAllMeaning());

        // 머리말
        model.addAttribute("eventCategoryEnum", EventCategoryEnum.getAllMeaning(EventHeadTypeEnum.ALL.index));

        // 적용 필드 (목돈, 부동산, 보험)
        model.addAttribute("eventFieldEnum", EventFieldEnum.getAllMeaning());

        // 적용 범위
        model.addAttribute("eventCoverageEnum", EventCoverageEnum.getAllMeaning());

        // 적용 조건
        model.addAttribute("eventConditionEnum", EventConditionEnum.getAllMeaning());

        model.addAttribute("urlName", ADD_EVENT);
        model.addAttribute("title", ADD_EVENT);

        return COMMON_FILE_URL + "/addEvent";
    }

    /**
     * 이벤트 등록
     * @param eventDto
     * @return
     */
    @PostMapping("/addEvent")
    public String addEvent(EventDto eventDto, RedirectAttributes reAttr){
        // 접근 권한 체크 > false -> 홈 화면 이동
        if(!authService.hasAuth(AuthNameEnum.ROOT_ADMIN)) {
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", NOT_AUTH_MESSAGE);
            return "redirect:/index";
        }

        eventService.addEvent(eventDto);
        return "redirect:/event/eventOperation";
    }

    /**
     * 운영툴 > 이벤트 관리 > 이벤트 수정
     * @return
     */
    @GetMapping("/updateEvent")
    public String updateEvent(Model model, @ModelAttribute EventDto eventDto, RedirectAttributes reAttr){
        // 접근 권한 체크 > false -> 홈 화면 이동
        if(!authService.hasAuth(AuthNameEnum.ROOT_ADMIN)) {
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", NOT_AUTH_MESSAGE);
            return "redirect:/index";
        }

        // 이벤트 하나 조회
        EventDto event = eventService.getEvent(eventDto);
        model.addAttribute("eventDto", event);
        log.info("@@@ {} / EventController / updateEvent - event : {}", StringCustomUtil.getTodayDateTime(), event);


        // 분류
        model.addAttribute("eventHeadTypeEnum", EventHeadTypeEnum.getAllMeaning());

        // 머리말
        model.addAttribute("eventCategoryEnum", EventCategoryEnum.getAllMeaning(EventHeadTypeEnum.ALL.index));

        // 적용 필드 (목돈, 부동산, 보험)
        model.addAttribute("eventFieldEnum", EventFieldEnum.getAllMeaning());

        // 적용 범위
        model.addAttribute("eventCoverageEnum", EventCoverageEnum.getAllMeaning());

        // 적용 조건
        model.addAttribute("eventConditionEnum", EventConditionEnum.getAllMeaning());

        model.addAttribute("urlName", UPDATE_EVENT);
        model.addAttribute("title", UPDATE_EVENT);

        return COMMON_FILE_URL + "/updateEvent";
    }

    /**
     * 이벤트 수정 처리
     * @param eventDto
     * @return
     */
    @PostMapping("/updateEvent")
    public String updateEvent(EventDto eventDto, RedirectAttributes reAttr){
        // 접근 권한 체크 > false -> 홈 화면 이동
        if(!authService.hasAuth(AuthNameEnum.ROOT_ADMIN)) {
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", NOT_AUTH_MESSAGE);
            return "redirect:/index";
        }

        eventService.updateEvent(eventDto);
        return "redirect:/event/eventOperation";
    }

    /**
     * 이벤트 삭제 처리
     * @param eventDto
     * @return
     */
    @GetMapping("/deleteEvent")
    public String deleteEvent(EventDto eventDto, RedirectAttributes reAttr){
        // 접근 권한 체크 > false -> 홈 화면 이동
        if(!authService.hasAuth(AuthNameEnum.ROOT_ADMIN)) {
            reAttr.addAttribute("isSuccess", false);
            reAttr.addAttribute("message", NOT_AUTH_MESSAGE);
            return "redirect:/index";
        }

        eventService.deleteEvent(eventDto);
        return "redirect:/event/eventOperation";
    }

    // 운영툴 > 이벤트 관리 종료                -- END

    // 계약관리 > EVENT 시작                   -- START

    /**
     * 계약 관리 > EVENT
     * @return
     */
    @GetMapping("/eventAll")
    public String eventAll(Model model, @ModelAttribute EventDto eventDto) throws Exception {

        eventDto.setHeadType(EventHeadTypeEnum.ALL.index);
        setEventModel(model, eventDto);

        model.addAttribute("urlName", ALL_EVENT);
        model.addAttribute("title", ALL_EVENT);

        return COMMON_FILE_URL + "/eventAll";
    }

    /**
     * 계약 관리 > EVENT > KH 프로모션
     * @return
     */
    @GetMapping("/promotionByKh")
    public String promotionByKh(Model model, @ModelAttribute EventDto eventDto) throws Exception {

        eventDto.setHeadType(EventHeadTypeEnum.HEAD.index);
        setEventModel(model, eventDto);

        model.addAttribute("urlName", KH_PROMOTION);
        model.addAttribute("title", KH_PROMOTION);

        return COMMON_FILE_URL + "/promotionByKh";
    }

    /**
     * 계약 관리 > EVENT > 지점 프로모션
     * @return
     */
    @GetMapping("/promotionByBranch")
    public String promotionByBranch(Model model, @ModelAttribute EventDto eventDto) throws Exception {

        eventDto.setHeadType(EventHeadTypeEnum.BRANCH.index);
        setEventModel(model, eventDto);

        model.addAttribute("urlName", BRANCH_PROMOTION);
        model.addAttribute("title", BRANCH_PROMOTION);

        return COMMON_FILE_URL + "/promotionByBranch";
    }

    /**
     * 이벤트 내의 순위 리스트
     * @return
     */
    @GetMapping("/eventInfoList")
    public String eventInfoList(Model model, @ModelAttribute EventDto eventDto, HttpServletRequest request) throws Exception {
        String loginEmployeeCode = authService.getEmployeeCode();
        model.addAttribute("loginEmployeeCode", loginEmployeeCode);

        // 이전 페이지 경로
        String preRequestUrl = request.getHeader("referer");
        Boolean hasPreRequest = StringUtils.isEmpty(preRequestUrl) ? null : preRequestUrl.contains("eventOperation");
        model.addAttribute("hasPreRequest", hasPreRequest);

        // 로그인한 사원에게 CONTRACT_LEADER 권한이 있을 경우 리더 부서 코드 세팅
        String leaderDepartmentCode = authService.getDepartmentCodeByIsAuth(AuthNameEnum.CONTRACT_LEADER);

        // 본부, 지점, 팀, 담당자 리스트 : 권한별 select box 영역 세팅
        Map<String, Object> selectDepartmentMap = departmentSelectService.getSelectDepartment(eventDto.getDepartmentCode(), RESIGN_NUM);
        if (selectDepartmentMap == null) selectDepartmentMap = new HashMap<>();
        model.addAttribute("selectDepartmentMap", selectDepartmentMap);

        // 리스트 조회
        EventDto event = eventService.getEvent(eventDto);
        List<ContractStatusDto> statusList = contractStatusService.getStatusListForEvent(event);
        model.addAttribute("statusList", statusList);

        // 검색조건 리스트 조회
        List<EventSearchCateEnum> searchCateList = EventSearchCateEnum.getAllMeaning();
        model.addAttribute("searchCateList", searchCateList);
        model.addAttribute("searchKey", eventDto.getSearchKey());
        model.addAttribute("searchValue", eventDto.getSearchValue());
        model.addAttribute("startDate", event.getStartDate());
        model.addAttribute("endDate", event.getEndDate());

        // 리더권한의 사원이 담당자를 선택하지 않았을 경우 본인의 부서 코드로 세팅
        if (StringUtils.isEmpty(eventDto.getDepartmentCode()) && StringUtils.isNotEmpty(leaderDepartmentCode))
            eventDto.setDepartmentCode(leaderDepartmentCode);

        model.addAttribute("departmentCode", eventDto.getDepartmentCode());
        model.addAttribute("employeeCode", eventDto.getEmployeeCode());

        model.addAttribute("isSuccess", eventDto.getIsSuccess());
        model.addAttribute("message", eventDto.getMessage());

        model.addAttribute("urlName", EVENT_INFO_LIST);
        model.addAttribute("title", EVENT_INFO_LIST);

        return COMMON_FILE_URL + "/eventInfoList";
    }
    // 계약관리 이벤트 종료 -- END
}
