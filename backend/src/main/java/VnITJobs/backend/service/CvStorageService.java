package VnITJobs.backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.UUID;

@Service
public class CvStorageService {

    private static final long MAX_FILE_SIZE = 5L * 1024 * 1024;

    private final Path uploadDir =
            Paths.get("uploads", "cv").toAbsolutePath().normalize();

    public CvStorageService() {
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            throw new IllegalStateException("Khong the tao thu muc CV", e);
        }
    }

    public String storePdf(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Vui long chon file CV"
            );
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "File CV khong duoc vuot qua 5 MB"
            );
        }

        String originalName = file.getOriginalFilename();

        if (originalName == null
                || !originalName.toLowerCase(Locale.ROOT).endsWith(".pdf")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Chi chap nhan file PDF"
            );
        }

        String storedName = UUID.randomUUID() + ".pdf";
        Path destination = uploadDir.resolve(storedName).normalize();

        try (InputStream input = file.getInputStream()) {
            byte[] signature = input.readNBytes(5);

            if (!"%PDF-".equals(
                    new String(signature, StandardCharsets.US_ASCII))) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "File PDF khong hop le"
                );
            }
        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Khong doc duoc file CV", e
            );
        }

        try (InputStream input = file.getInputStream()) {
            Files.copy(input, destination);
        } catch (IOException e) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Khong the luu file CV", e
            );
        }

        return "/uploads/cv/" + storedName;
    }
}