package com.genbridge.backend.services;

import com.genbridge.backend.dto.ContentRequest;
import com.genbridge.backend.entity.Content;
import com.genbridge.backend.repository.ContentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ContentServiceTest {

    @Mock
    private ContentRepository contentRepository;

    @InjectMocks
    private ContentServiceImpl contentService;

    private Content sampleContent;
    private ContentRequest sampleRequest;

    @BeforeEach
    void setUp() {
        sampleContent = new Content();
        sampleContent.setLessonId(1L);
        sampleContent.setTerm("rizz");
        sampleContent.setDescription("Natural charm or charisma");
        sampleContent.setExample("He has unspoken rizz.");
        sampleContent.setSource("Urban Dictionary");
        sampleContent.setOrderIndex(1);

        sampleRequest = new ContentRequest();
        sampleRequest.setLessonId(1L);
        sampleRequest.setTerm("rizz");
        sampleRequest.setDescription("Natural charm or charisma");
        sampleRequest.setExample("He has unspoken rizz.");
        sampleRequest.setSource("Urban Dictionary");
        sampleRequest.setOrderIndex(1);
    }

    @Test
    void createContent_validRequest_savesAndReturnsContent() {
        when(contentRepository.save(any(Content.class))).thenReturn(sampleContent);

        Content result = contentService.createContent(sampleRequest);

        assertThat(result.getTerm()).isEqualTo("rizz");
        assertThat(result.getSource()).isEqualTo("Urban Dictionary");
        verify(contentRepository).save(any(Content.class));
    }

    @Test
    void getContentByLesson_returnsTermsForLesson() {
        Content term2 = new Content();
        term2.setTerm("slay");
        term2.setLessonId(1L);

        when(contentRepository.findByLessonIdOrderByOrderIndex(1L))
                .thenReturn(List.of(sampleContent, term2));

        List<Content> result = contentService.getContentByLesson(1L);

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getTerm()).isEqualTo("rizz");
        assertThat(result.get(1).getTerm()).isEqualTo("slay");
    }

    @Test
    void getAllContent_returnsAllTermsAlphabetically() {
        Content termB = new Content();
        termB.setTerm("bussin");

        Content termR = new Content();
        termR.setTerm("rizz");

        when(contentRepository.findAllByOrderByTermAsc()).thenReturn(List.of(termB, termR));

        List<Content> result = contentService.getAllContent();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getTerm()).isEqualTo("bussin");
        assertThat(result.get(1).getTerm()).isEqualTo("rizz");
    }

    @Test
    void updateContent_contentNotFound_throwsException() {
        when(contentRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> contentService.updateContent(99L, sampleRequest))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Content not found");
    }

    @Test
    void updateContent_existingContent_updatesFields() {
        when(contentRepository.findById(1L)).thenReturn(Optional.of(sampleContent));
        when(contentRepository.save(any(Content.class))).thenAnswer(inv -> inv.getArgument(0));

        ContentRequest updateRequest = new ContentRequest();
        updateRequest.setTerm("rizz");
        updateRequest.setDescription("Updated description");
        updateRequest.setSource("Wikipedia");
        updateRequest.setOrderIndex(1);

        Content result = contentService.updateContent(1L, updateRequest);

        assertThat(result.getDescription()).isEqualTo("Updated description");
        assertThat(result.getSource()).isEqualTo("Wikipedia");
    }

    @Test
    void deleteContent_contentNotFound_throwsException() {
        when(contentRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> contentService.deleteContent(99L))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Content not found");

        verify(contentRepository, never()).deleteById(any());
    }

    @Test
    void deleteContent_existingContent_callsDeleteById() {
        when(contentRepository.existsById(1L)).thenReturn(true);

        contentService.deleteContent(1L);

        verify(contentRepository).deleteById(1L);
    }
}
