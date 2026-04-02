package com.courseapp;

import com.courseapp.model.Course;
import com.courseapp.repository.CourseRepository;
import com.courseapp.service.CourseService;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Course Service Tests")
class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @InjectMocks
    private CourseService courseService;

    private Course sampleCourse;

    @BeforeEach
    void setUp() {
        sampleCourse = Course.builder()
                .id(1L)
                .name("Introduction to Computer Science")
                .code("CS101")
                .instructor("Dr. Smith")
                .credits(3)
                .capacity(30)
                .enrolled(0)
                .schedule("Mon/Wed 9:00-10:30 AM")
                .status("OPEN")
                .build();
    }

    @Test
    @DisplayName("Should return all courses")
    void testGetAllCourses() {
        when(courseRepository.findAll()).thenReturn(List.of(sampleCourse));
        List<Course> courses = courseService.getAllCourses();
        assertNotNull(courses);
        assertEquals(1, courses.size());
        assertEquals("CS101", courses.get(0).getCode());
        verify(courseRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Should create a new course successfully")
    void testCreateCourse() {
        when(courseRepository.existsByCode("CS101")).thenReturn(false);
        when(courseRepository.save(sampleCourse)).thenReturn(sampleCourse);
        Course created = courseService.createCourse(sampleCourse);
        assertNotNull(created);
        assertEquals("CS101", created.getCode());
        verify(courseRepository).save(sampleCourse);
    }

    @Test
    @DisplayName("Should throw exception when course code already exists")
    void testCreateCourseWithDuplicateCode() {
        when(courseRepository.existsByCode("CS101")).thenReturn(true);
        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                courseService.createCourse(sampleCourse));
        assertTrue(ex.getMessage().contains("already exists"));
    }

    @Test
    @DisplayName("Should return course by ID")
    void testGetCourseById() {
        when(courseRepository.findById(1L)).thenReturn(Optional.of(sampleCourse));
        Optional<Course> result = courseService.getCourseById(1L);
        assertTrue(result.isPresent());
        assertEquals("CS101", result.get().getCode());
    }

    @Test
    @DisplayName("Should return empty when course not found")
    void testGetCourseByIdNotFound() {
        when(courseRepository.findById(99L)).thenReturn(Optional.empty());
        Optional<Course> result = courseService.getCourseById(99L);
        assertFalse(result.isPresent());
    }

    @Test
    @DisplayName("Should delete course by ID")
    void testDeleteCourse() {
        when(courseRepository.existsById(1L)).thenReturn(true);
        doNothing().when(courseRepository).deleteById(1L);
        assertDoesNotThrow(() -> courseService.deleteCourse(1L));
        verify(courseRepository).deleteById(1L);
    }

    @Test
    @DisplayName("Should throw exception when deleting non-existent course")
    void testDeleteNonExistentCourse() {
        when(courseRepository.existsById(99L)).thenReturn(false);
        assertThrows(RuntimeException.class, () -> courseService.deleteCourse(99L));
    }

    @Test
    @DisplayName("Should check available seats correctly")
    void testHasAvailableSeats() {
        sampleCourse.setEnrolled(29);
        assertTrue(courseService.hasAvailableSeats(sampleCourse));
        sampleCourse.setEnrolled(30);
        assertFalse(courseService.hasAvailableSeats(sampleCourse));
    }

    @Test
    @DisplayName("Should increment enrollment and mark as FULL when capacity reached")
    void testIncrementEnrollment() {
        sampleCourse.setEnrolled(29);
        when(courseRepository.save(any(Course.class))).thenReturn(sampleCourse);
        courseService.incrementEnrollment(sampleCourse);
        assertEquals(30, sampleCourse.getEnrolled());
        assertEquals("FULL", sampleCourse.getStatus());
    }

    @Test
    @DisplayName("Should decrement enrollment and re-open course")
    void testDecrementEnrollment() {
        sampleCourse.setEnrolled(5);
        sampleCourse.setStatus("FULL");
        when(courseRepository.save(any(Course.class))).thenReturn(sampleCourse);
        courseService.decrementEnrollment(sampleCourse);
        assertEquals(4, sampleCourse.getEnrolled());
        assertEquals("OPEN", sampleCourse.getStatus());
    }

    @Test
    @DisplayName("Should get open courses only")
    void testGetOpenCourses() {
        when(courseRepository.findByStatus("OPEN")).thenReturn(List.of(sampleCourse));
        List<Course> open = courseService.getOpenCourses();
        assertEquals(1, open.size());
        assertEquals("OPEN", open.get(0).getStatus());
    }
}
