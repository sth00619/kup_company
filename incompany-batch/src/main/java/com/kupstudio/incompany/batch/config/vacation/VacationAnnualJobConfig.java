package com.kupstudio.incompany.batch.config.vacation;

import com.kupstudio.incompany.batch.tasklet.vacation.VacationAnnualTasklet;
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
import org.springframework.context.annotation.Primary;

@Slf4j
@RequiredArgsConstructor
@Configuration
@Primary
public class VacationAnnualJobConfig {

    private final JobBuilderFactory jobBuilderFactory;
    private final StepBuilderFactory stepBuilderFactory;
    private final VacationAnnualTasklet vacationAnnualTasklet;

    /**
     * 매년 1월 1일 정기 연차 지급 구현
     */
    @Bean
    public Job vacationAnnualJob() {
        return jobBuilderFactory.get("vacationAnnualJob")
                .start(vacationAnnualStep(null))
                .build();
    }

    @Bean
    @JobScope
    public Step vacationAnnualStep(@Value("#{jobParameters[requestDate]}") String requestDate) {
        log.info("/VacationJobConfig/vacationAnnualStep : SPRING BATCH VACATION ANNUAL STEP");
        return stepBuilderFactory.get("vacationAnnualStep")
                .tasklet(vacationAnnualTasklet)
                .build();
    }
}
