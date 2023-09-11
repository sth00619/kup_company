package com.kupstudio.incompany.controller.candidateEmployee;

import com.kupstudio.incompany.dto.candidateEmployee.CandidateEmployeeCounselingDto;
import com.kupstudio.incompany.service.candidateEmployee.CandidateEmployeeCounselingAndDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/candidate/counseling")
@RequiredArgsConstructor
public class CandidateEmployeeCounselingController {

    private final CandidateEmployeeCounselingAndDetailService counselingService;

    @GetMapping("/detail")
    public String getCounselingDetailList(Model model, @RequestParam(value = "candidateEmployeeNo") Integer candidateEmployeeNo,
                                          @RequestParam(value = "isForm", required = false) String isForm) {

        List<CandidateEmployeeCounselingDto> counselingList = counselingService.getCounselingList(candidateEmployeeNo, isForm);


        model.addAttribute("candidateEmployeeNo", candidateEmployeeNo);

        model.addAttribute("counselingList", counselingList);

        if (isForm != null) {

            return "potential/candidate/list :: #counselingFormList";
        } else {

            return "potential/candidate/list :: #counselingList";
        }
    }

    @PostMapping("/addCounseling")
    public String addCounseling(Model model, @RequestBody Map<String, Object> param,
                                @RequestParam(value = "isForm", required = false) String isForm) {

        Integer candidateEmployeeNo = Integer.parseInt(String.valueOf(param.get("candidateEmployeeNo")));

        counselingService.insertAndUpdateAndDeleteCounseling(param);


        List<CandidateEmployeeCounselingDto> counselingList = counselingService.getCounselingList(candidateEmployeeNo, isForm);
        model.addAttribute("counselingList", counselingList);

        return "potential/candidate/list :: #counselingList";
    }


}
