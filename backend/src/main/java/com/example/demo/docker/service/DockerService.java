package com.example.demo.docker.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.demo.docker.dto.DockerDto;

import java.io.*;
import java.net.ServerSocket;
import java.util.Random;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class DockerService {
    @Value("${project.path}")
    private String PROJECT_PATH;

    // 프로젝트 빌드 (백엔드)
    public boolean buildProjectWithGradle() {
        try {
            String gradleCommand = System.getProperty("os.name").toLowerCase().contains("win") ? "gradlew.bat" : "./gradlew";
            ProcessBuilder processBuilder = new ProcessBuilder(gradleCommand, "clean", "build");
            processBuilder.directory(new File(PROJECT_PATH + "/backend"));
            processBuilder.redirectErrorStream(true);

            Process process = processBuilder.start();
            String output = readProcessOutput(process);
            int exitCode = process.waitFor();
            log.info("Gradle 빌드 출력:\n{}", output);
            return exitCode == 0;
        } catch (IOException | InterruptedException e) {
            log.error("Gradle 빌드 중 오류가 발생했습니다.", e);
            return false;
        }
    }

    // nginx.conf 파일 생성
    public void createNginxConfig() {
        String nginxConfigContent = 
                "server {\n" +
                "    listen 80;\n" +
                "    server_name localhost;\n" +
                "\n" +
                "    location / {\n" +
                "        root /usr/share/nginx/html;\n" +
                "        index index.html index.htm;\n" +
                "        try_files $uri $uri/ /index.html;\n" + // 리액트 라우팅 지원
                "    }\n" +
                "}\n";

        File nginxConfigFile = new File(PROJECT_PATH + "/docker/nginx.conf");
        try {
            File directory = nginxConfigFile.getParentFile();
            if (!directory.exists()) {
                boolean dirCreated = directory.mkdirs();
                if (dirCreated) {
                    log.info("nginx.conf 디렉토리가 성공적으로 생성되었습니다: {}", directory.getAbsolutePath());
                } else {
                    log.error("nginx.conf 디렉토리 생성에 실패했습니다: {}", directory.getAbsolutePath());
                    return;
                }
            }

            try (BufferedWriter writer = new BufferedWriter(new FileWriter(nginxConfigFile))) {
                writer.write(nginxConfigContent);
                log.info("nginx.conf 파일이 성공적으로 생성되었습니다. 경로: {}", nginxConfigFile.getAbsolutePath());
            }
        } catch (IOException e) {
            log.error("nginx.conf 파일 생성 중 오류가 발생했습니다.", e);
        }
    }

    // 도커파일 생성
    public void createDockerfile() {
        String dockerfileContent =
                "FROM openjdk:17 AS backend\n" +
                "COPY backend/build/libs/backend-0.0.1-SNAPSHOT.jar app.jar\n" +
                "EXPOSE 8888\n" +
                "CMD [\"java\", \"-jar\", \"app.jar\"]\n" +
                "\n" +
                "FROM node:16 AS frontend\n" +
                "WORKDIR /app\n" +
                "COPY front/package*.json ./\n" +
                "RUN npm install\n" +
                "COPY front/ ./\n" +
                "RUN npm run build\n" +
                "\n" +
                "FROM nginx:alpine\n" +
                "COPY --from=frontend /app/build /usr/share/nginx/html\n" +
                "COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf\n" +
                "COPY --from=backend /app.jar /usr/src/app/app.jar\n" +
                "CMD [\"nginx\", \"-g\", \"daemon off;\"]";

        File dockerFile = new File(PROJECT_PATH + "/docker/Dockerfile");
        File directory = dockerFile.getParentFile();
        if (!directory.exists()) {
            boolean dirCreated = directory.mkdirs();
            if (dirCreated) {
                log.info("디렉토리가 성공적으로 생성되었습니다: {}", directory.getAbsolutePath());
            } else {
                log.error("디렉토리 생성에 실패했습니다: {}", directory.getAbsolutePath());
                return;
            }
        }

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(dockerFile))) {
            writer.write(dockerfileContent);
            log.info("도커파일이 성공적으로 생성되었습니다. 경로: {}", dockerFile.getAbsolutePath());
        } catch (IOException e) {
            log.error("도커파일 생성 중 오류가 발생했습니다.", e);
        }
    }

    // 도커 컨테이너 실행
    public DockerDto startDockerContainer() {
        String containerName = "my_combined_service_" + UUID.randomUUID().toString().substring(0, 8); // 컨테이너 이름 생성
        String imageName = "my_app_" + UUID.randomUUID().toString().substring(0, 8);
        int randomPort = getAvailablePort();

        try {
            // 도커 이미지 빌드
            ProcessBuilder buildProcess = new ProcessBuilder("docker", "build", "-t", imageName, "-f", PROJECT_PATH + "/docker/Dockerfile", PROJECT_PATH);
            Process buildProcessInstance = buildProcess.start();

            // 빌드 로그 출력
            String buildOutput = readProcessOutput(buildProcessInstance);
            int buildExitCode = buildProcessInstance.waitFor();
            log.info("도커 이미지 빌드 로그:\n{}", buildOutput);

            if (buildExitCode != 0) {
                log.error("도커 이미지 빌드 실패. 종료 코드: {}", buildExitCode);
                return null; // 이미지 빌드 실패 시 null 반환
            }

            // 도커 컨테이너 실행
            ProcessBuilder processBuilder = new ProcessBuilder("docker", "run", "-d", "--name", containerName, "-p", randomPort + ":80", imageName); // 이미지 이름 사용
            Process process = processBuilder.start();
            String containerId = new BufferedReader(new InputStreamReader(process.getInputStream())).readLine();

            if (containerId == null || containerId.isEmpty()) {
                log.error("도커 컨테이너 실행에 실패했습니다. 컨테이너 ID가 null 또는 비어 있습니다.");
                return null; // 컨테이너 실행 실패 시 null 반환
            }

            log.info("도커 컨테이너가 성공적으로 시작되었습니다. 컨테이너 ID: {} 및 포트: {}", containerId, randomPort);
            
            DockerDto testDto = new DockerDto();
            testDto.setContainerId(containerId);
            testDto.setPort(randomPort);
            
            return testDto;
        } catch (Exception e) {
            log.error("도커 컨테이너 시작 중 오류가 발생했습니다.", e);
            return null; // 예외 발생 시 null 반환
        }
    }

    public int getAvailablePort() {
        Random random = new Random();
        int port;

        while (true) {
            // 20000부터 29999까지의 랜덤 포트 생성
            port = random.nextInt(10000) + 20000;
            if (isPortAvailable(port)) {
                return port; // 사용 가능한 포트 반환
            }
        }
    }

    // 포트가 사용 가능한지 확인하는 메서드
    private boolean isPortAvailable(int port) {
        try (ServerSocket socket = new ServerSocket(port)) {
            return true; // 포트가 사용 가능함
        } catch (IOException e) {
            return false; // 포트가 이미 사용 중
        }
    }

    // Process의 출력 결과를 읽어오는 메서드
    private String readProcessOutput(Process process) throws IOException {
        StringBuilder output = new StringBuilder();
        BufferedReader outputReader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        BufferedReader errorReader = new BufferedReader(new InputStreamReader(process.getErrorStream()));

        String line;
        while ((line = outputReader.readLine()) != null) {
            output.append(line).append("\n");
        }
        while ((line = errorReader.readLine()) != null) {
            output.append(line).append("\n"); // 에러 로그도 추가
        }

        return output.toString();
    }

    public String getContainerUrl(int port) {
        return "http://localhost:" + port; // 로컬에서 접근할 수 있는 URL 반환
    }

    // 리액트 앱 빌드
    public boolean buildReactApp() {
        try {
            String npmCommand = System.getProperty("os.name").toLowerCase().contains("win") ? "npm.cmd" : "npm";

            ProcessBuilder processBuilder = new ProcessBuilder(npmCommand, "run", "build");
            processBuilder.directory(new File(PROJECT_PATH + "/front"));
            processBuilder.redirectErrorStream(true);

            Process process = processBuilder.start();
            String output = readProcessOutput(process);
            int exitCode = process.waitFor();
            log.info("리액트 앱 빌드 출력:\n{}", output);
            return exitCode == 0;
        } catch (IOException | InterruptedException e) {
            log.error("리액트 앱 빌드 중 오류가 발생했습니다.", e);
            return false;
        }
    }
}