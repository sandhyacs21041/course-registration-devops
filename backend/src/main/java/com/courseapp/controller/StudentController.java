package com.courseapp.controller;

import com.courseapp.model.Student;
import com.courseapp.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStudentById(@PathVariable Long id) {
        return studentService.getStudentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createStudent(@Valid @RequestBody Student student) {
        try {
            Student created = studentService.createStudent(student);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @Valid @RequestBody Student student) {
        try {
            return ResponseEntity.ok(studentService.updateStudent(id, student));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        try {
            studentService.deleteStudent(id);
            return ResponseEntity.ok().body("Student deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{studentId}/register/{courseId}")
    public ResponseEntity<?> registerForCourse(@PathVariable Long studentId, @PathVariable Long courseId) {
        try {
            Student student = studentService.registerForCourse(studentId, courseId);
            return ResponseEntity.ok(student);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{studentId}/drop/{courseId}")
    public ResponseEntity<?> dropCourse(@PathVariable Long studentId, @PathVariable Long courseId) {
        try {
            Student student = studentService.dropCourse(studentId, courseId);
            return ResponseEntity.ok(student);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
