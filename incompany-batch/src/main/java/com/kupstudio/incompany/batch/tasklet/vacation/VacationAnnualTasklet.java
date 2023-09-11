package com.kupstudio.incompany.batch.tasklet.vacation;

import com.kupstudio.incompany.service.vacation.VacationBatchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.StepContribution;
import org.springframework.batch.core.configuration.annotation.StepScope;
import org.springframework.batch.core.scope.context.ChunkContext;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.repeat.RepeatStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@StepScope
@RequiredArgsConstructor
public class VacationAnnualTasklet implements Tasklet {

    @Value("#{jobParameters[requestDate]}")
    private String requestDate;

    private final VacationBatchService vacationBatchService;

    @Override
    public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) throws Exception {
        log.info(">>>>> This is vacationAnnualTasklet");
        log.info(">>>>> This is requestDate = {}", requestDate);
        vacationBatchService.vacationAnnual(requestDate);
        return RepeatStatus.FINISHED;
    }
}
