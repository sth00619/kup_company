package com.kupstudio.incompany.batch.config.vacation;

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
public class VacationMonthlyJobConfig {

    private final JobBuilderFactory jobBuilderFactory;
    private final StepBuilderFactory stepBuilderFactory;
    private final VacationMonthlyTasklet vacationMonthlyTasklet;

    /**
     * 매월 1일 월차 일괄 지급
     * 월차 계산 > 실행 일자 기준 1년 미만 직원 > 월차 계산하여 지급
     */
    @Bean
    public Job vacationMonthlyJob() {
        return jobBuilderFactory.get("vacationMonthlyJob")
                .start(vacationMonthlyStep(null))
                .build();
    }

    @Bean
    @JobScope
    public Step vacationMonthlyStep(@Value("#{jobParameters[requestDate]}") String requestDate) {
        log.info("/VacationMonthlyJobConfig/vacationMonthlyStep : SPRING BATCH VACATION MONTHLY STEP");
        return stepBuilderFactory.get("vacationMonthlyStep")
                .tasklet(vacationMonthlyTasklet)
                .build();
    }
}
