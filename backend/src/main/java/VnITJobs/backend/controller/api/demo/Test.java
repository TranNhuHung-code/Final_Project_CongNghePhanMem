package VnITJobs.backend.controller.api.demo;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/demo")
public class Test {
    @GetMapping("/protect")
    public ResponseEntity<String> test(){
        return ResponseEntity.ok("Oke");
    }
}
