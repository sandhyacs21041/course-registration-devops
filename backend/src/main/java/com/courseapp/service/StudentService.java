package com.courseapp.service;

import com.courseapp.model.Course;
import com.courseapp.model.Student;
import com.courseapp.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseService courseService;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    public Student createStudent(Student student) {
        if (studentRepository.existsByEmail(student.getEmail())) {
            throw new RuntimeException("Student with email " + student.getEmail() + " already exists");
        }
        if (studentRepository.existsByStudentId(student.getStudentId())) {
            throw new RuntimeException("Student ID " + student.getStudentId() + " already exists");
        }
        return studentRepository.save(student);
    }

    public Student updateStudent(Long id, Student updatedStudent) {
        return studentRepository.findById(id).map(student -> {
            student.setName(updatedStudent.getName());
            student.setDepartment(updatedStudent.getDepartment());
            return studentRepository.save(student);
        }).orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
    }

    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
    }

    public Student registerForCourse(Long studentId, Long courseId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Course course = courseService.getCourseById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (!courseService.hasAvailableSeats(course)) {
            throw new RuntimeException("Course is full");
        }

        boolean alreadyRegistered = student.getRegisteredCourses().stream()
                .anyMatch(c -> c.getId().equals(courseId));
        if (alreadyRegistered) {
            throw new RuntimeException("Student already registered for this course");
        }

        student.getRegisteredCourses().add(course);
        courseService.incrementEnrollment(course);
        return studentRepository.save(student);
    }

    public Student dropCourse(Long studentId, Long courseId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Course course = courseService.getCourseById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        boolean wasRegistered = student.getRegisteredCourses().removeIf(c -> c.getId().equals(courseId));
        if (!wasRegistered) {
            throw new RuntimeException("Student is not registered for this course");
        }

        courseService.decrementEnrollment(course);
        return studentRepository.save(student);
    }
}
