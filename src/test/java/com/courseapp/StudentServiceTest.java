package com.courseapp;

import com.courseapp.model.Course;
import com.courseapp.model.Student;
import com.courseapp.repository.StudentRepository;
import com.courseapp.service.CourseService;
import com.courseapp.service.StudentService;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Student Service Tests")
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private CourseService courseService;

    @InjectMocks
    private StudentService studentService;

    private Student sampleStudent;
    private Course sampleCourse;

    @BeforeEach
    void setUp() {
        sampleCourse = Course.builder()
                .id(1L).name("CS101").code("CS101")
                .instructor("Dr. Smith").credits(3)
                .capacity(30).enrolled(5).status("OPEN").schedule("Mon")
                .build();

        sampleStudent = Student.builder()
                .id(1L).name("Alice").email("alice@uni.edu")
                .studentId("STU001").department("CS")
                .registeredCourses(new HashSet<>())
                .build();
    }

    @Test
    @DisplayName("Should create student successfully")
    void testCreateStudent() {
        when(studentRepository.existsByEmail("alice@uni.edu")).thenReturn(false);
        when(studentRepository.existsByStudentId("STU001")).thenReturn(false);
        when(studentRepository.save(sampleStudent)).thenReturn(sampleStudent);
        Student created = studentService.createStudent(sampleStudent);
        assertNotNull(created);
        assertEquals("Alice", created.getName());
    }

    @Test
    @DisplayName("Should throw when email already exists")
    void testCreateStudentDuplicateEmail() {
        when(studentRepository.existsByEmail("alice@uni.edu")).thenReturn(true);
        assertThrows(RuntimeException.class, () -> studentService.createStudent(sampleStudent));
    }

    @Test
    @DisplayName("Should register student for a course")
    void testRegisterForCourse() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(sampleStudent));
        when(courseService.getCourseById(1L)).thenReturn(Optional.of(sampleCourse));
        when(courseService.hasAvailableSeats(sampleCourse)).thenReturn(true);
        when(courseService.incrementEnrollment(sampleCourse)).thenReturn(sampleCourse);
        when(studentRepository.save(sampleStudent)).thenReturn(sampleStudent);

        Student result = studentService.registerForCourse(1L, 1L);
        assertNotNull(result);
        assertTrue(result.getRegisteredCourses().contains(sampleCourse));
    }

    @Test
    @DisplayName("Should throw when course is full")
    void testRegisterForFullCourse() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(sampleStudent));
        when(courseService.getCourseById(1L)).thenReturn(Optional.of(sampleCourse));
        when(courseService.hasAvailableSeats(sampleCourse)).thenReturn(false);
        assertThrows(RuntimeException.class, () -> studentService.registerForCourse(1L, 1L));
    }

    @Test
    @DisplayName("Should drop course successfully")
    void testDropCourse() {
        sampleStudent.getRegisteredCourses().add(sampleCourse);
        when(studentRepository.findById(1L)).thenReturn(Optional.of(sampleStudent));
        when(courseService.getCourseById(1L)).thenReturn(Optional.of(sampleCourse));
        when(courseService.decrementEnrollment(sampleCourse)).thenReturn(sampleCourse);
        when(studentRepository.save(sampleStudent)).thenReturn(sampleStudent);

        Student result = studentService.dropCourse(1L, 1L);
        assertFalse(result.getRegisteredCourses().contains(sampleCourse));
    }

    @Test
    @DisplayName("Should get all students")
    void testGetAllStudents() {
        when(studentRepository.findAll()).thenReturn(List.of(sampleStudent));
        List<Student> students = studentService.getAllStudents();
        assertEquals(1, students.size());
    }

    @Test
    @DisplayName("Should delete student")
    void testDeleteStudent() {
        when(studentRepository.existsById(1L)).thenReturn(true);
        doNothing().when(studentRepository).deleteById(1L);
        assertDoesNotThrow(() -> studentService.deleteStudent(1L));
    }
}
