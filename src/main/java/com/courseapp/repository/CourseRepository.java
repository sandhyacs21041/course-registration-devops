package com.courseapp.repository;

import com.courseapp.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByCode(String code);
    List<Course> findByStatus(String status);
    List<Course> findByInstructor(String instructor);
    boolean existsByCode(String code);
}
