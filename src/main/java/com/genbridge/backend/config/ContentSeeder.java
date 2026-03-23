package com.genbridge.backend.config;

import com.genbridge.backend.entity.Content;
import com.genbridge.backend.entity.Lesson;
import com.genbridge.backend.repository.ContentRepository;
import com.genbridge.backend.repository.LessonRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ContentSeeder implements ApplicationRunner {

    private final LessonRepository lessonRepository;
    private final ContentRepository contentRepository;

    public ContentSeeder(LessonRepository lessonRepository, ContentRepository contentRepository) {
        this.lessonRepository = lessonRepository;
        this.contentRepository = contentRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (lessonRepository.count() > 0) {
            return;
        }

        Lesson lesson1 = lessonRepository.save(new Lesson(
                "What is Gen Alpha?",
                "Introduction to Gen Alpha values, behavior and digital culture.",
                1
        ));

        Lesson lesson2 = lessonRepository.save(new Lesson(
                "Social Media Trends",
                "How short-form content, creators and online communities shape trends.",
                2
        ));

        Lesson lesson3 = lessonRepository.save(new Lesson(
                "Digital Wellbeing",
                "Healthy screen habits, boundaries and balanced online activity.",
                3
        ));

        List<Content> seedContent = List.of(
                createContent(lesson1.getId(), "Gen Alpha", "Gen Alpha", "People born from around 2010 onward.", "Raised fully in the digital era.", 1),
                createContent(lesson1.getId(), "Digital Native", "Digital Native", "Someone who grows up with digital tech as normal.", "Uses apps naturally from a young age.", 2),
                createContent(lesson2.getId(), "Short-form Video", "Short-form", "Video content that is brief and highly engaging.", "15-60 second trend videos.", 1),
                createContent(lesson2.getId(), "Creator Economy", "Creator", "A system where creators monetize content and communities.", "Influencer courses, live gifts, brand deals.", 2),
                createContent(lesson3.getId(), "Screen Time", "Screen Time", "The amount of time spent using digital screens.", "Tracking daily app usage.", 1),
                createContent(lesson3.getId(), "Digital Balance", "Balance", "Combining online and offline life in a healthy way.", "Taking breaks and doing offline hobbies.", 2)
        );

        contentRepository.saveAll(seedContent);
    }

    private Content createContent(Long lessonId,
                                  String title,
                                  String term,
                                  String description,
                                  String example,
                                  int orderIndex) {
        Content content = new Content();
        content.setLessonId(lessonId);
        content.setTitle(title);
        content.setTerm(term);
        content.setDescription(description);
        content.setExample(example);
        content.setOrderIndex(orderIndex);
        return content;
    }
}