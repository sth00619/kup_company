package com.kupstudio.incompany.batch.config.vacation;

import com.kupstudio.incompany.cacheService.employee.EmployeeCacheService;
import com.kupstudio.incompany.service.vacation.VacationBatchService;
import com.kupstudio.incompany.service.vacation.VacationRecordService;
import com.kupstudio.incompany.service.vacation.VacationService;
import com.kupstudio.incompany.util.StringCustomUtil;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.junit.jupiter.params.provider.ValueSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.junit.jupiter.params.provider.Arguments.arguments;

/**
 * 연차 계산 단위 테스트
 */
@AutoConfigureMockMvc
@SpringBootTest(classes = VacationBatchService.class, properties = {"spring.profiles.active=dev", "jasypt.encryptor.password=encryptCode"})
class VacationBatchServiceTest {

    public static final String REQUEST_DATE = StringCustomUtil.getToday();
    @Autowired
    VacationBatchService vacationBatchService;

    @MockBean
    EmployeeCacheService employeeCacheService;

    @MockBean
    VacationRecordService vacationRecordService;

    @MockBean
    VacationService vacationService;

    private static final Logger log = LoggerFactory.getLogger(VacationBatchServiceTest.class);

    private static final String JOIN_ONE_YEAR_OVER_EXCEPTION_MESSAGE = "입사일자가 1년 이상입니다.";

    @DisplayName("매년 > 연차 계산 > 입사일자와 실행 일자를 비교하여 정기 연차를 계산한다.")
    @ParameterizedTest
    @MethodSource("compareDateAndResultAnnual")
    public void vacationAnnalTest(String joinDate, int result) {

        assertThat(vacationBatchService.calculateAnnualVacation(REQUEST_DATE, joinDate)).isEqualTo(result);

        assertThatCode(() -> vacationBatchService.calculateAnnualVacation(REQUEST_DATE, joinDate))
                .doesNotThrowAnyException();
    }

    @DisplayName("매월 > 월차 계산 > 입사일자와 실행 일자를 비교 하여 1년 미만 직원 조회 > 최종 지급 할 월차계산 성공 & 예외가 발생 없음")
    @ParameterizedTest
    @MethodSource("compareDateAndResultIn")
    public void vacationMonthlyTest(String requestDate, String joinDate, int result) throws Exception {
        assertThat(vacationBatchService.calculateMonthlyVacation(requestDate, joinDate)).isEqualTo(result);

        assertThatCode(() -> vacationBatchService.calculateMonthlyVacation(requestDate, joinDate))
                .doesNotThrowAnyException();
    }

    @DisplayName("매월 > 월차 계산 > 1년 이상 직원 > IllegalArgumentException 예외가 발생 & JOIN_ONE_YEAR_OVER_EXCEPTION_MESSAGE 랑 같은 Exception Message 발생")
    @ParameterizedTest
    @MethodSource("compareDateAndResultOver")
    public void vacationMonthlyTest2(String requestDate, String joinDate) {
        assertThatCode(() -> vacationBatchService.calculateMonthlyVacation(requestDate, joinDate))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage(JOIN_ONE_YEAR_OVER_EXCEPTION_MESSAGE);
    }


    @DisplayName("매일 > 연차 계산 > 1년 만근 직원 조회 > 전년도 근무일 수 기준으로 첫 연차 계산에 성공 & 예외 발생 없음")
    @ParameterizedTest
    @ValueSource(doubles = {1.5, 3.0, 10.0, 13.5, 42.5})
    public void vacationDailyTest(double minusDays) {

        // minusDays = 전년도 기준 차감할 근무 일 수
        assertThatCode(() -> vacationBatchService.calculateFirstAnnual(REQUEST_DATE, minusDays))
                .doesNotThrowAnyException();
    }

    /**
     * 재직기간 1년 미만의 직원기준 예시 데이터 세팅
     * arguments("실행일자", "입사일자", 최종지급월차수)
     * @return 테스트 입력 할 parameter 들
     */
    private static Stream<Arguments> compareDateAndResultIn() {
        return Stream.of(
                arguments("2022-09-01", "2022-05-03", 3),
                arguments("2022-10-01", "2022-04-01", 6),
                arguments("2022-07-01", "2021-07-02", 11)
        );
    }

    /**
     * 재직기간 1년 만근한 사원
     * 첫 연차 계산 식
     * 전년도 입사일자 ~ 전년도 말일 까지의 일자 수 / 365 * 15
     * 결과값 소수점 한자리 0.5단위 반올림
     * arguments("실행일자", "입사일자", 최종지급연차수)
     * @return 테스트 입력 할 parameter 들
     */
    private static Stream<Arguments> compareDateAndResultOver() {
        return Stream.of(
                arguments("2022-09-01", "2021-09-01", 5.0),
                arguments("2022-10-13", "2021-10-13", 3.5),
                arguments("2022-03-02", "2021-03-02", 13.0)
        );
    }
//"2021-01-01", "2021-05-23", "2020-01-01", "2020-08-19", "2019-01-01", "2019-07-03", "2013-04-20"
    private static Stream<Arguments> compareDateAndResultAnnual() {
        return Stream.of(
                arguments("2021-01-01", 15),
                arguments("2021-09-21", 0),
                arguments("2020-01-01", 15),
                arguments("2020-08-19", 15),
                arguments("2019-01-01", 16),
                arguments("2019-07-03", 15),
                arguments("2013-04-20", 18),
                arguments("2010-02-20", 20),
                arguments("2002-08-15", 24),
                arguments("1994-05-28", 25),
                arguments("1922-01-01", 25)
        );
    }
}