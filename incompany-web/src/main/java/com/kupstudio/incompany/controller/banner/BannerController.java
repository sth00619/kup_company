package com.kupstudio.incompany.controller.banner;

import com.kupstudio.incompany.dto.DepartmentDto;
import com.kupstudio.incompany.dto.banner.BannerImgCategoryDto;
import com.kupstudio.incompany.dto.banner.BannerImgDto;
import com.kupstudio.incompany.dto.banner.BannerYoutubeDto;
import com.kupstudio.incompany.service.DepartmentService;
import com.kupstudio.incompany.service.banner.BannerService;
import com.kupstudio.incompany.service.cloud.CloudService;
import com.kupstudio.incompany.service.department.DepartmentSearchService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Slf4j
@Controller
@RequestMapping("/banner")
public class BannerController {
    private final static String DIRECTORY_PATH = "bannerImg/";
    private final static String NOT_EXIST_DEPARTMENT = "부서코드";
    @Autowired
    BannerService bannerService;
    @Autowired
    CloudService cloudService;
    @Autowired
    DepartmentService departmentService;
    @Autowired
    DepartmentSearchService departmentSearchService;

    @Value("${cloud.aws.s3Url}")
    private String cloudUrl;


    // 영상 배너
    @GetMapping("/youtube")
    public String bannerYoutube(Model model) {
        List<BannerYoutubeDto> bannerYoutubeList = bannerService.getBannerYoutubeList();
        model.addAttribute("bannerYoutubeList", bannerYoutubeList);

        return "banner/youtube";
    }

    @ResponseBody
    @RequestMapping(value = "/addBannerYoutube", method = RequestMethod.POST)
    public boolean addBannerYoutube(@RequestParam(value = "videoTitle") String videoTitle,
                                    @RequestParam(value = "videoId") String videoId,
                                    @RequestParam(value = "endTime") String endTime,
                                    @RequestParam(value = "showCheck") String showCheck) {
        try {
            bannerService.addBannerYoutube(videoTitle, videoId, endTime, showCheck);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @ResponseBody
    @RequestMapping(value = "/updateBannerYoutube", method = RequestMethod.POST)
    public boolean updateBannerYoutube(@RequestParam(value = "videoNo") int videoNo,
                                       @RequestParam(value = "videoTitle") String videoTitle,
                                       @RequestParam(value = "videoId") String videoId,
                                       @RequestParam(value = "endTime") String endTime,
                                       @RequestParam(value = "showCheck") String showCheck) {
        try {
            bannerService.updateBannerYoutube(videoNo, videoTitle, videoId, endTime, showCheck);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @ResponseBody
    @DeleteMapping("/deleteBannerYoutube")
    public void deleteBannerYoutube(int videoNo) {

        bannerService.deleteBannerYoutube(videoNo);

    }

    // 이미지 배너
    @GetMapping("/img")
    public String bannerImg(Model model) throws JSONException {
        List<BannerImgDto> bannerImgList = bannerService.getBannerImgList();
        List<BannerImgCategoryDto> bannerImgCategoryList = bannerService.getBannerImgCategoryList();
        for (int i = 0; i < bannerImgList.size(); i++) {
            List<String> fileList = cloudService.removeUrl(bannerImgList.get(i).getImgFile());
            bannerImgList.get(i).setCloudFile(fileList.toString().replaceAll("[\\[\\]]", ""));
            for (int n = 0; n < bannerImgCategoryList.size(); n++) {
                if (bannerImgList.get(i).getCategoryNo() == bannerImgCategoryList.get(n).getCategoryNo()) {
                    bannerImgList.get(i).setCategoryName(bannerImgCategoryList.get(n).getCategoryName());
                }
            }
        }

        List<DepartmentDto> twoDepth = departmentService.getTwoDepthDepartmentList();

        model.addAttribute("twoDepth", twoDepth);
        model.addAttribute("bannerImgList", bannerImgList);
        model.addAttribute("bannerImgCategoryList", bannerImgCategoryList);
        return "banner/img";
    }


    @ResponseBody
    @RequestMapping(value = "/addBannerImg", method = RequestMethod.POST)
    public String addBannerImg(@RequestParam(value = "categoryNo") int categoryNo,
                               @RequestParam(value = "imgName") String imgName,
                               @RequestParam(value = "imgFile") MultipartFile imgFile,
                               @RequestParam(value = "urlKey") String urlKey,
                               @RequestParam(value = "ordering") int ordering,
                               @RequestParam(value = "departmentCode") String departmentCode) {
        return bannerService.addBannerImg(categoryNo, imgName, imgFile, urlKey, ordering, departmentCode);
    }

    @ResponseBody
    @RequestMapping(value = "/updateBannerImg", method = RequestMethod.POST)
    public String updateBannerImg(@RequestParam(value = "imgNo") int imgNo,
                                  @RequestParam(value = "categoryNo") int categoryNo,
                                  @RequestParam(value = "imgName") String imgName,
                                  @RequestParam(value = "imgFile", required = false) MultipartFile imgFile,
                                  @RequestParam(value = "urlKey") String urlKey,
                                  @RequestParam(value = "ordering") int ordering,
                                  @RequestParam(value = "departmentCode") String departmentCode,
                                  HttpServletRequest request) {
        try {
            String checkExistCode = null;
            if (!StringUtils.isEmpty(departmentCode)) {
                if (!departmentSearchService.existsDepartment(departmentCode)) {
                    checkExistCode = NOT_EXIST_DEPARTMENT;
                }
            }
            if (checkExistCode == null) {

                String fileNameList = bannerService.getBannerImg(imgNo).getFileNameList().toString().replaceAll("[\\[\\]]", "");
                String fileNameDbList = null;
                String fileNameBanner = null;
                String filePath = null;
                if (imgFile != null) {
                    String file = imgFile.getOriginalFilename();
                    fileNameDbList = file.substring(0, imgFile.getOriginalFilename().lastIndexOf("."));

                    String queryFileDb = StringUtils.replace(fileNameList, cloudUrl, "");
                    int firstIdx = fileNameList.lastIndexOf(DIRECTORY_PATH) + DIRECTORY_PATH.length();
                    int endIndex = fileNameList.indexOf("-");
                    String queryFileDbName = fileNameList.substring(firstIdx, endIndex);

                    // 업로드한 파일이 기존 파일과 다를 경우, 파일 삭제 후 파일 업로드
                    if (!(queryFileDb.contains(fileNameDbList)) || !(fileNameDbList.equals(queryFileDbName))) {
                        // 파일 삭제
                        cloudService.deleteAndReplaceUrl(fileNameList);
                        // 파일 업로드
                        fileNameBanner = cloudService.bannerImgUpload(imgFile, DIRECTORY_PATH);
                        try {
                            filePath = bannerService.parseJson(fileNameBanner);
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }
                if (filePath == null) {
                    try {
                        filePath = bannerService.parseJson(fileNameList);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
                bannerService.updateBannerImg(imgNo, categoryNo, imgName, filePath, urlKey, ordering, departmentCode);
            }
            return checkExistCode;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @ResponseBody
    @DeleteMapping("/deleteBannerImg")
    public void deleteBannerImg(int imgNo) {
        List<String> fileNameBanner = bannerService.getBannerImg(imgNo).getFileNameList();
        if (!fileNameBanner.isEmpty()) {
            fileNameBanner.forEach(name -> cloudService.deleteAndReplaceUrl(name));
        }
        bannerService.deleteBannerImg(imgNo);
    }

    // 이미지 카테고리
    @GetMapping("/imgCategory")
    public String bannerImgCategory(Model model) {
        List<BannerImgCategoryDto> bannerImgCategoryList = bannerService.getBannerImgCategoryList();
        model.addAttribute("bannerImgCategoryList", bannerImgCategoryList);

        return "banner/img_category";
    }

    @ResponseBody
    @RequestMapping(value = "/updateBannerImgCategory", method = RequestMethod.POST)
    public boolean updateBannerImgCategory(@RequestParam(value = "categoryNo") int categoryNo,
                                           @RequestParam(value = "categoryName") String categoryName) {
        try {
            bannerService.updateBannerImgCategory(categoryNo, categoryName);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}

