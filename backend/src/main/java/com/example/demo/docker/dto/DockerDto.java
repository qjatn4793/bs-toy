package com.example.demo.docker.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DockerDto {
	private String containerId;
    private int port;
}
