package com.example.demo.test.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class TestService {
	@Value("${project.path}")
    private String PROJECT_PATH;

    public boolean buildProjectWithGradle() {
        try {
            String gradleCommand = System.getProperty("os.name").toLowerCase().contains("win") ? "gradlew.bat" : "./gradlew";

            ProcessBuilder processBuilder = new ProcessBuilder(gradleCommand, "clean", "build");
            processBuilder.directory(new File(PROJECT_PATH));
            processBuilder.redirectErrorStream(true);

            Process process = processBuilder.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            StringBuilder output = new StringBuilder();
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
            int exitCode = process.waitFor();
            log.info("Gradle 빌드 출력:\n{}", output.toString());
            return exitCode == 0;
        } catch (IOException | InterruptedException e) {
            log.error("Gradle 빌드 중 오류가 발생했습니다.", e);
            return false;
        }
    }

    public void createDockerfile() {
        String dockerfileContent = "FROM openjdk:17\n" +
                "COPY build/libs/backend-0.0.1-SNAPSHOT.jar app.jar\n" + 
                "ENTRYPOINT [\"java\",\"-jar\",\"/app.jar\"]";

        File directory = new File(PROJECT_PATH + "/docker/Dockerfile").getParentFile();
        if (!directory.exists()) {
            boolean dirCreated = directory.mkdirs();
            if (dirCreated) {
                log.info("디렉토리가 성공적으로 생성되었습니다: {}", directory.getAbsolutePath());
            } else {
                log.error("디렉토리 생성에 실패했습니다: {}", directory.getAbsolutePath());
                return;
            }
        }

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(PROJECT_PATH + "/docker/Dockerfile"))) {
            writer.write(dockerfileContent);
            log.info("도커파일이 성공적으로 생성되었습니다. 경로: {}", PROJECT_PATH + "/docker/Dockerfile");
        } catch (IOException e) {
            log.error("도커파일 생성 중 오류가 발생했습니다.", e);
        }
    }

    public String startDockerContainer() {
        String containerName = "my_service_" + UUID.randomUUID().toString();

        try {
            // 도커 이미지 빌드
            ProcessBuilder buildProcess = new ProcessBuilder("docker", "build", "-t", "my_image", "-f", PROJECT_PATH + "/docker/Dockerfile", PROJECT_PATH);
            buildProcess.directory(new File(PROJECT_PATH));  // 빌드 컨텍스트는 프로젝트 루트로 설정
            Process buildProcessInstance = buildProcess.start();
            
            // 빌드 로그 출력
            BufferedReader buildReader = new BufferedReader(new InputStreamReader(buildProcessInstance.getInputStream()));
            BufferedReader errorReader = new BufferedReader(new InputStreamReader(buildProcessInstance.getErrorStream()));
            String buildLine;
            StringBuilder buildOutput = new StringBuilder();
            while ((buildLine = buildReader.readLine()) != null) {
                buildOutput.append(buildLine).append("\n");
            }
            while ((buildLine = errorReader.readLine()) != null) {
                buildOutput.append(buildLine).append("\n");  // 에러 스트림도 함께 읽음
            }

            int buildExitCode = buildProcessInstance.waitFor();
            log.info("도커 이미지 빌드 로그:\n{}", buildOutput.toString());
            if (buildExitCode != 0) {
                log.error("도커 이미지 빌드 실패. 종료 코드: {}", buildExitCode);
                return null;  // 이미지 빌드 실패 시 null 반환
            }

            // 도커 컨테이너 실행
            ProcessBuilder processBuilder = new ProcessBuilder("docker", "run", "-d", "--name", containerName, "-p", "0:8888", "my_image");
            Process process = processBuilder.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String containerId = reader.readLine();
            log.info("도커 컨테이너가 성공적으로 시작되었습니다. 컨테이너 ID: {}", containerId);
            return containerId;
        } catch (Exception e) {
            log.error("도커 컨테이너 시작 중 오류가 발생했습니다.", e);
            return null;
        }
    }

    public String getContainerUrl(String containerId) {
        try {
            ProcessBuilder processBuilder = new ProcessBuilder("docker", "port", containerId);
            Process process = processBuilder.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            String line;
            String port = "";
            while ((line = reader.readLine()) != null) {
                if (line.contains("8888")) {
                    port = line.split(":")[1].trim();
                }
            }
            String url = "http://localhost:" + port;
            log.info("컨테이너 URL이 성공적으로 가져와졌습니다: {}", url);
            return url;
        } catch (Exception e) {
            log.error("컨테이너 URL을 가져오는 중 오류가 발생했습니다.", e);
            return "Error retrieving container URL";
        }
    }

}
