package com.kupstudio.incompany.batch.config.vacation;

import com.kupstudio.incompany.batch.tasklet.vacation.VacationDailyTasklet;
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
public class VacationDailyJobConfig {

    private final JobBuilderFactory jobBuilderFactory;
    private final StepBuilderFactory stepBuilderFactory;
    private final VacationDailyTasklet vacationDailyTasklet;

    /**
     * 매일 입사 후 1년 만근 사원 첫 연차 일괄 지급
     * 연차 계산 > 1년 만근 직원 조회 > 전년도 근무일 수 기준으로 첫 연차 계산
     */
    @Bean
    public Job vacationDailyJob() {
        return jobBuilderFactory.get("vacationDailyJob")
                .start(vacationDailyStep(null))
                .build();
    }

    @Bean
    @JobScope
    public Step vacationDailyStep(@Value("#{jobParameters[requestDate]}") String requestDate) {
        log.info("/VacationDailyJobConfig/vacationDailyStep : SPRING BATCH VACATION DAILY STEP");
        return stepBuilderFactory.get("vacationDailyStep")
                .tasklet(vacationDailyTasklet)
                .build();
    }
}
