package com.kupstudio.incompany;

import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;


@SpringBootApplication
@EnableBatchProcessing
public class IncompanyApplication {

    public static void main(String[] args) {
        new SpringApplicationBuilder(IncompanyApplication.class)
                .web(WebApplicationType.NONE)
                .run(args);
    }

}
