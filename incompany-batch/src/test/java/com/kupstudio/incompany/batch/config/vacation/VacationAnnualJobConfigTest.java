package com.kupstudio.incompany.batch.config.vacation;

import com.kupstudio.incompany.batch.config.TestBatchLegacyConfig;
import org.assertj.core.api.Assertions;
import org.junit.Before;
import org.junit.jupiter.api.Test;
import org.springframework.batch.core.*;
import org.springframework.batch.test.JobLauncherTestUtils;
import org.springframework.batch.test.context.SpringBatchTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * 연차 지급 Job 통합 테스트
 */
@SpringBatchTest
@SpringBootTest(
        classes = {VacationAnnualJobConfig.class, TestBatchLegacyConfig.class},
        properties = {"spring.profiles.active:test", "jasypt.encryptor.password=encryptCode", "job.name=vacationAnnualJob"})
public class VacationAnnualJobConfigTest {

    @Autowired
    private Job vacationAnnualJob;

    @Autowired
    private JobLauncherTestUtils jobLauncherTestUtils;

    @Before
    public void setUp() {
        jobLauncherTestUtils.setJob(vacationAnnualJob);
    }

    @Test
    public void jobTest() throws Exception {
        // given
        JobParameters jobParameters = new JobParametersBuilder()
                .addString("requestDate", "2022-01-01")
                .addString("version", "1")
                .toJobParameters();

        // when
        JobExecution jobExecution1 = jobLauncherTestUtils.launchJob(jobParameters);

        // then
        Assertions.assertThat(jobExecution1.getStatus()).isEqualTo(BatchStatus.COMPLETED);
        Assertions.assertThat(jobExecution1.getExitStatus()).isEqualTo(ExitStatus.COMPLETED);

    }
}