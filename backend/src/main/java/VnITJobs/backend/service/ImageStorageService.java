package VnITJobs.backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;

@Service
public class ImageStorageService {
    private static final long MAX_SIZE = 15L * 1024 * 1024;
    private static final Set<String> TYPES = Set.of("avatar", "logo", "job");
    private final Path root = Paths.get("uploads").toAbsolutePath().normalize();

    public String storeImage(MultipartFile file, String type) {
        if (!TYPES.contains(type))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Loai anh khong hop le");
        if (file == null || file.isEmpty())
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vui long chon anh");
        if (file.getSize() > MAX_SIZE)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Anh khong duoc vuot qua 15 MB");

        try (InputStream in = file.getInputStream()) {
            byte[] h = in.readNBytes(12);
            String ext = detectExt(h);
            if (ext == null)
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chi chap nhan PNG, JPG, WEBP");

            Path dir = root.resolve(type);
            Files.createDirectories(dir);
            String name = UUID.randomUUID() + "." + ext;
            try (InputStream in2 = file.getInputStream()) {
                Files.copy(in2, dir.resolve(name));
            }
            return "/uploads/" + type + "/" + name;
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Khong the luu anh", e);
        }
    }

    // Kiểm tra theo nội dung file (magic bytes), không tin vào tên file
    private String detectExt(byte[] h) {
        if (h.length >= 8 && (h[0] & 0xFF) == 0x89 && h[1] == 'P' && h[2] == 'N' && h[3] == 'G') return "png";
        if (h.length >= 3 && (h[0] & 0xFF) == 0xFF && (h[1] & 0xFF) == 0xD8 && (h[2] & 0xFF) == 0xFF) return "jpg";
        if (h.length >= 12 && h[0] == 'R' && h[1] == 'I' && h[2] == 'F' && h[3] == 'F'
                && h[8] == 'W' && h[9] == 'E' && h[10] == 'B' && h[11] == 'P') return "webp";
        return null;
    }
}