package com.kupstudio.incompany.batch.config.vacation;

import com.kupstudio.incompany.batch.tasklet.vacation.SetDefaultVacationTasklet;
import com.kupstudio.incompany.batch.tasklet.vacation.VacationAnnualTasklet;
import com.kupstudio.incompany.batch.tasklet.vacation.VacationDailyFirstRunTasklet;
import com.kupstudio.incompany.batch.tasklet.vacation.VacationMonthlyTasklet;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.JobBuilderFactory;
import org.springframework.batch.core.configuration.annotation.JobScope;
import org.springframework.batch.core.configuration.annotation.StepBuilderFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@RequiredArgsConstructor
@Configuration
public class VacationFirstRunJobConfig {

    private final JobBuilderFactory jobBuilderFactory;
    private final StepBuilderFactory stepBuilderFactory;
    private final VacationAnnualTasklet vacationAnnualTasklet;
    private final VacationMonthlyTasklet vacationMonthlyTasklet;
    private final SetDefaultVacationTasklet setDefaultVacationTasklet;
    private final VacationDailyFirstRunTasklet vacationDailyFirstRunTasklet;

    /**
     * 연차 지급 최초 실행 시 실행 (아무 연차 정보가 없을 때)
     */
    @Bean
    public Job vacationFirstRunJob() {
        return jobBuilderFactory.get("vacationFirstRunJob")
                .start(vacationAnnualFirstRunStep(null))
                .next(vacationMonthlyFirstRunStep(null))
                .next(vacationDailyFirstRunStep(null))
                .next(setDefaultVacationStep(null))
                .build();
    }

    @Bean
    @JobScope
    public Step vacationAnnualFirstRunStep(@Value("#{jobParameters[requestDate]}") String requestDate) {
        log.info("/VacationFirstRunJobConfig/vacationAnnualFirstRunStep : SPRING BATCH VACATION ANNUAL FIRST RUN STEP");
        return stepBuilderFactory.get("vacationAnnualFirstRunStep")
                .tasklet(vacationAnnualTasklet)
                .build();
    }

    @Bean
    @JobScope
    public Step vacationMonthlyFirstRunStep(@Value("#{jobParameters[requestDate]}") String requestDate) {
        log.info("/VacationFirstRunJobConfig/vacationMonthlyFirstRunStep : SPRING BATCH VACATION MONTHLY FIRST RUN STEP");
        return stepBuilderFactory.get("vacationMonthlyFirstRunStep")
                .tasklet(vacationMonthlyTasklet)
                .build();
    }

    @Bean
    @JobScope
    public Step vacationDailyFirstRunStep(@Value("#{jobParameters[requestDate]}") String requestDate) {
        log.info("/VacationFirstRunJobConfig/vacationDailyFirstRunStep : SPRING BATCH VACATION DAILY FIRST RUN STEP");
        return stepBuilderFactory.get("vacationDailyFirstRunStep")
                .tasklet(vacationDailyFirstRunTasklet)
                .build();
    }

    @Bean
    @JobScope
    public Step setDefaultVacationStep(@Value("#{jobParameters[requestDate]}") String requestDate) {
        log.info("/VacationFirstRunJobConfig/setDefaultVacationStep : SPRING BATCH SET DEFAULT VACATION STEP");
        return stepBuilderFactory.get("setVacationDefaultStep")
                .tasklet(setDefaultVacationTasklet)
                .build();
    }
}
