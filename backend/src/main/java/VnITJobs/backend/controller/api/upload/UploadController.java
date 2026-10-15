package VnITJobs.backend.controller.api.upload;

import VnITJobs.backend.service.ImageStorageService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/upload")
public class UploadController {
    private final ImageStorageService imageStorageService;
    public UploadController(ImageStorageService s) { this.imageStorageService = s; }

    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, String> uploadImage(@RequestParam("file") MultipartFile file,
                                           @RequestParam("type") String type) {
        return Map.of("url", imageStorageService.storeImage(file, type));
    }
}