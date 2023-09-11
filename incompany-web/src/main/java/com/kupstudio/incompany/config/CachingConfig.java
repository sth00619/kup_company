package com.kupstudio.incompany.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.util.Arrays;

@Slf4j
@Configuration
@EnableCaching
@EnableScheduling
public class CachingConfig {
    public static final String SEARCH_EMPLOYEE_LIST = "searchEmployeeNameList";
    public static final String SEARCH_ALL_EMPLOYEE_LIST = "searchAllEmployeeList";
    public static final String SEARCH_SUPERIOR_EMPLOYEE_LIST = "searchSuperiorEmployeeList";
    public static final String RANKING_CONTRACT_LIST = "rankingByContractList";
    public static final String RANKING_INSURANCE_LIST = "rankingByInsuranceList";
    public static final String ALL_COMPANY_LIST = "allCompanyList";
    public static final String ALL_DEPARTMENT_LIST = "allDepartmentList";
    public static final String STATISTICS_LIST = "statistics";
    public static final String TOTAL_STATISTICS = "totalStatistics";
    public static final String STATISTICS_DEPARTMENT_LIST = "statisticsDepartmentList";
    public static final String STATISTICS_TEAM = "StatisticsByTeamList";
    public static final String CONTRACT_STATUS_RANKING = "rankingAtContractStatus";
    public static final String EMPLOYEE_INFO_WITH_DEPARTMENT_SET = "getEmployeeInfoWithDepartmentSet";
    public static final String EMPLOYEE_INFO_WITH_DEPARTMENT_SET_LIST = "getEmployeeInfoWithDepartmentSetList";
    public static final String ADDITIONAL_SCORE_LIST = "additionalScoreList";
    private final static String DEPARTMENT_LIST_WITH_ALL_DATA_SET = "departmentListWithAllDataSet";
    private final static String EMPLOYEE_INFO = "getEmployeeInfoDto";
    private final static String KOREA_HOLIDAY = "koreaHoliday";
    private final static String SEARCH_EMPLOYEE_BY_WORKING_STATUS = "searchEmployeeByWorkingStatus";
//    private final static String ALL_SALES_TARGET_LIST = "allSalesTargetList";
//    private final static String INDIVIDUAL_SALES_TARGET_LIST = "individualSalesTargetList";

    @Bean
    public CacheManager cacheManager() {

        SimpleCacheManager cacheManager = new SimpleCacheManager();

        cacheManager.setCaches(Arrays.asList(
                new ConcurrentMapCache(SEARCH_EMPLOYEE_LIST),
                new ConcurrentMapCache(SEARCH_ALL_EMPLOYEE_LIST),
                new ConcurrentMapCache(SEARCH_SUPERIOR_EMPLOYEE_LIST),
                new ConcurrentMapCache(RANKING_CONTRACT_LIST),
                new ConcurrentMapCache(RANKING_INSURANCE_LIST),
                new ConcurrentMapCache(ALL_COMPANY_LIST),
                new ConcurrentMapCache(ALL_DEPARTMENT_LIST),
                new ConcurrentMapCache(STATISTICS_LIST),
                new ConcurrentMapCache(TOTAL_STATISTICS),
                new ConcurrentMapCache(STATISTICS_DEPARTMENT_LIST),
                new ConcurrentMapCache(STATISTICS_TEAM),
                new ConcurrentMapCache(CONTRACT_STATUS_RANKING),
                new ConcurrentMapCache(EMPLOYEE_INFO_WITH_DEPARTMENT_SET),
                new ConcurrentMapCache(EMPLOYEE_INFO_WITH_DEPARTMENT_SET_LIST),
                new ConcurrentMapCache(DEPARTMENT_LIST_WITH_ALL_DATA_SET),
                new ConcurrentMapCache(EMPLOYEE_INFO),
                new ConcurrentMapCache(KOREA_HOLIDAY),
                new ConcurrentMapCache(ADDITIONAL_SCORE_LIST),
                new ConcurrentMapCache(SEARCH_EMPLOYEE_BY_WORKING_STATUS)
//                new ConcurrentMapCache(ALL_SALES_TARGET_LIST),
//                new ConcurrentMapCache(TEAM_SALES_TARGET_LIST),
//                new ConcurrentMapCache(INDIVIDUAL_SALES_TARGET_LIST)
        ));

        // 캐시 추가할때 마다 캐시이름 추가
        return cacheManager;
    }

    @CacheEvict(allEntries = true, value = {SEARCH_EMPLOYEE_LIST, SEARCH_ALL_EMPLOYEE_LIST, SEARCH_EMPLOYEE_BY_WORKING_STATUS, EMPLOYEE_INFO_WITH_DEPARTMENT_SET, EMPLOYEE_INFO_WITH_DEPARTMENT_SET_LIST, EMPLOYEE_INFO})
    @Scheduled(fixedDelay = 10 * 60 * 1000, initialDelay = 500)
    public void reportCacheEvict() {
        log.debug("♻ 사원 정보 캐쉬를 삭제합니다. - [ " + SEARCH_EMPLOYEE_LIST + " ], [ " + SEARCH_ALL_EMPLOYEE_LIST + " ], [ " + SEARCH_EMPLOYEE_BY_WORKING_STATUS + " ], [ " + EMPLOYEE_INFO_WITH_DEPARTMENT_SET + " ], [ " + EMPLOYEE_INFO + " ]");
    }

    @CacheEvict(allEntries = true, value = {SEARCH_EMPLOYEE_LIST, SEARCH_SUPERIOR_EMPLOYEE_LIST, SEARCH_EMPLOYEE_BY_WORKING_STATUS, EMPLOYEE_INFO_WITH_DEPARTMENT_SET, EMPLOYEE_INFO_WITH_DEPARTMENT_SET_LIST, EMPLOYEE_INFO})
    @Scheduled(fixedDelay = 10 * 60 * 1000, initialDelay = 500)
    public void reportSuperiorCacheEvict() {
        log.debug("♻ 상위 사원 정보 캐쉬를 삭제합니다. - [ " + SEARCH_EMPLOYEE_LIST + " ], [ " + SEARCH_SUPERIOR_EMPLOYEE_LIST + " ], [ " + SEARCH_EMPLOYEE_BY_WORKING_STATUS + " ], [ " + EMPLOYEE_INFO_WITH_DEPARTMENT_SET + " ], [ " + EMPLOYEE_INFO + " ]");
    }

    @CacheEvict(allEntries = true, value = {ALL_COMPANY_LIST, ALL_DEPARTMENT_LIST})
    @Scheduled(fixedDelay = 10 * 60 * 1000, initialDelay = 500)
    public void companyAndDepartmentReportCacheEvict() {
        log.debug("♻ 조직 정보 캐쉬를 삭제합니다. - [ " + ALL_DEPARTMENT_LIST + " ], [ " + ALL_COMPANY_LIST + " ], [ " + DEPARTMENT_LIST_WITH_ALL_DATA_SET + " ]");
    }

    @CacheEvict(allEntries = true, value = {KOREA_HOLIDAY})
    @Scheduled(cron = "0 0 0 1 * *")
    public void googleCalendarCacheEvict() {
        log.debug("♻ 구글 휴일 캘린더  캐쉬를 삭제합니다. - [ " + KOREA_HOLIDAY + " ]");
    }

    @CacheEvict(allEntries = true, value = {CONTRACT_STATUS_RANKING})
    @Scheduled(cron = "0 */10 * * * *")
    public void contractStatusRankingCacheEvict() {
        log.info("♻ 계약 현황 캐쉬를 삭제합니다. - [ " + CONTRACT_STATUS_RANKING + " ]");
    }

    /**
     * 해당 캐쉬 전체 삭제
     */
    @CacheEvict(allEntries = true, value = {ADDITIONAL_SCORE_LIST})
    @Scheduled(cron = "0 */10 * * * *")
    public void additionalScoreListCacheEvict() {
        log.info("♻ 상담, 로그인 점수 캐쉬를 삭제합니다. - [ " + ADDITIONAL_SCORE_LIST + " ]");
    }

    /**
     * 해당 캐쉬 전체 삭제
     */
    @CacheEvict(allEntries = true, value = {RANKING_CONTRACT_LIST, RANKING_INSURANCE_LIST})
    @Scheduled(cron = "0 * * * * *")
    public void rankingContractAndInsuranceCacheEvict() {
        log.info("♻ 계약 랭킹 캐쉬를 삭제합니다. - [ " + RANKING_CONTRACT_LIST + " ], [ " + RANKING_INSURANCE_LIST + " ]");
    }


    /**
     * 해당 캐쉬 전체 삭제
     */
    @CacheEvict(allEntries = true, value = {STATISTICS_LIST, TOTAL_STATISTICS})
    @Scheduled(cron = "0 * * * * *")
    public void statisticsAndTotalCacheEvict() {
        log.info("♻ 계약 통계 캐쉬를 삭제합니다. - [ " + STATISTICS_LIST + " ], [ " + TOTAL_STATISTICS + " ]");
    }

    /**
     * 영업 통계 해당 캐쉬 전체 삭제
     */
    @CacheEvict(allEntries = true, value = {STATISTICS_DEPARTMENT_LIST})
    @Scheduled(cron = "0 * * * * *")
    public void statisticsDepartmentCacheEvict() {
        log.info("♻ 영업 통계 캐쉬를 삭제합니다. - [ " + STATISTICS_DEPARTMENT_LIST + " ]");
    }

    /**
     * 팀별 영업 통계 해당 캐쉬 전체 삭제
     */
    @CacheEvict(allEntries = true, value = {STATISTICS_TEAM})
    @Scheduled(cron = "0 * * * * *")
    public void statisticsTeamCacheEvict() {
        log.info("♻ 팀별 영업 합계 캐쉬를 삭제합니다. - [ " + STATISTICS_TEAM + " ]");
    }


//    /**
//     * 팀별 영업 통계 해당 캐쉬 전체 삭제
//     */
//    @CacheEvict(allEntries = true, value = {STATISTICS_TEAM})
//    @Scheduled(cron = "0 * * * * *")
//    public void statisticsTeamCacheEvict() {
//        log.info("♻ 팀별 영업 통계 캐쉬를 삭제합니다. - [ " + STATISTICS_TEAM + " ]");
//    }

//    /**
//     * 지점 영업 목표 해당 캐쉬 전체 삭제
//     * 개인 영업 목표 해당 캐쉬 전체 삭제
//     */
//    @CacheEvict(allEntries = true, value = {ALL_SALES_TARGET_LIST, TEAM_SALES_TARGET_LIST, INDIVIDUAL_SALES_TARGET_LIST})
//    @Scheduled(fixedDelay = 3 * 60 * 1000, initialDelay = 500)
//    public void allSalesTargetListCacheEvict() {
//        log.info("♻ 지점 영업 목표 캐쉬를 삭제합니다. - [ " + ALL_SALES_TARGET_LIST + " ]");
//        log.info("♻ 팀 영업 목표 캐쉬를 삭제합니다. - [ " + TEAM_SALES_TARGET_LIST + " ]");
//        log.info("♻ 개인 영업 목표 캐쉬를 삭제합니다. - [ " + INDIVIDUAL_SALES_TARGET_LIST + " ]");
//    }

}
