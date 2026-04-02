package com.courseapp;

import com.courseapp.model.Course;
import com.courseapp.model.Student;
import com.courseapp.repository.CourseRepository;
import com.courseapp.repository.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(CourseRepository courseRepo, StudentRepository studentRepo) {
        return args -> {
            // Sample Courses
            Course c1 = Course.builder()
                .name("Introduction to Computer Science")
                .code("CS101")
                .instructor("Dr. Smith")
                .credits(3)
                .capacity(30)
                .description("Fundamentals of programming and computational thinking.")
                .schedule("Mon/Wed 9:00-10:30 AM")
                .status("OPEN")
                .build();

            Course c2 = Course.builder()
                .name("Data Structures & Algorithms")
                .code("CS201")
                .instructor("Dr. Johnson")
                .credits(4)
                .capacity(25)
                .description("Advanced data structures and algorithm design.")
                .schedule("Tue/Thu 11:00-12:30 PM")
                .status("OPEN")
                .build();

            Course c3 = Course.builder()
                .name("Web Development")
                .code("CS301")
                .instructor("Prof. Williams")
                .credits(3)
                .capacity(20)
                .description("Frontend and backend web development technologies.")
                .schedule("Mon/Wed/Fri 2:00-3:00 PM")
                .status("OPEN")
                .build();

            Course c4 = Course.builder()
                .name("Database Management")
                .code("CS401")
                .instructor("Dr. Brown")
                .credits(3)
                .capacity(30)
                .description("Relational databases, SQL, and NoSQL systems.")
                .schedule("Tue/Thu 2:00-3:30 PM")
                .status("OPEN")
                .build();

            Course c5 = Course.builder()
                .name("Machine Learning")
                .code("CS501")
                .instructor("Dr. Davis")
                .credits(4)
                .capacity(20)
                .description("Supervised and unsupervised learning algorithms.")
                .schedule("Mon/Wed 3:30-5:00 PM")
                .status("OPEN")
                .build();

            courseRepo.save(c1);
            courseRepo.save(c2);
            courseRepo.save(c3);
            courseRepo.save(c4);
            courseRepo.save(c5);

            // Sample Students
            Student s1 = Student.builder()
                .name("Alice Sharma")
                .email("alice@university.edu")
                .studentId("STU001")
                .department("Computer Science")
                .build();

            Student s2 = Student.builder()
                .name("Bob Kumar")
                .email("bob@university.edu")
                .studentId("STU002")
                .department("Information Technology")
                .build();

            studentRepo.save(s1);
            studentRepo.save(s2);

            System.out.println("✅ Sample data initialized successfully!");
        };
    }
}
