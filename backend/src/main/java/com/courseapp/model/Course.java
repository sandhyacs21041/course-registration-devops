package com.courseapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Course name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Course code is required")
    @Column(nullable = false, unique = true)
    private String code;

    @NotBlank(message = "Instructor name is required")
    private String instructor;

    @Min(value = 1, message = "Credits must be at least 1")
    @Max(value = 6, message = "Credits cannot exceed 6")
    private int credits;

    @Min(value = 1, message = "Capacity must be at least 1")
    private int capacity;

    @Builder.Default
    private int enrolled = 0;

    private String description;

    @NotBlank(message = "Schedule is required")
    private String schedule;

    @Builder.Default
    private String status = "OPEN";
}
