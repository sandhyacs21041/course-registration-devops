package com.courseapp.service;

import com.courseapp.model.Course;
import com.courseapp.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    public Optional<Course> getCourseByCode(String code) {
        return courseRepository.findByCode(code);
    }

    public Course createCourse(Course course) {
        if (courseRepository.existsByCode(course.getCode())) {
            throw new RuntimeException("Course with code " + course.getCode() + " already exists");
        }
        return courseRepository.save(course);
    }

    public Course updateCourse(Long id, Course updatedCourse) {
        return courseRepository.findById(id).map(course -> {
            course.setName(updatedCourse.getName());
            course.setInstructor(updatedCourse.getInstructor());
            course.setCredits(updatedCourse.getCredits());
            course.setCapacity(updatedCourse.getCapacity());
            course.setDescription(updatedCourse.getDescription());
            course.setSchedule(updatedCourse.getSchedule());
            course.setStatus(updatedCourse.getStatus());
            return courseRepository.save(course);
        }).orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
    }

    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new RuntimeException("Course not found with id: " + id);
        }
        courseRepository.deleteById(id);
    }

    public List<Course> getOpenCourses() {
        return courseRepository.findByStatus("OPEN");
    }

    public boolean hasAvailableSeats(Course course) {
        return course.getEnrolled() < course.getCapacity();
    }

    public Course incrementEnrollment(Course course) {
        course.setEnrolled(course.getEnrolled() + 1);
        if (course.getEnrolled() >= course.getCapacity()) {
            course.setStatus("FULL");
        }
        return courseRepository.save(course);
    }

    public Course decrementEnrollment(Course course) {
        if (course.getEnrolled() > 0) {
            course.setEnrolled(course.getEnrolled() - 1);
            course.setStatus("OPEN");
        }
        return courseRepository.save(course);
    }
}
