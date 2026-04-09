package com.genbridge.backend.services;

import com.genbridge.backend.dto.CreateReportRequest;
import com.genbridge.backend.entity.ContentReport;
import com.genbridge.backend.user.User;

import java.util.List;

/** Defines operations for learner-submitted content error reports. */
public interface ContentReportService {
    ContentReport createReport(Long lessonId, CreateReportRequest request, User user);
    List<ContentReport> getAllReports();
    ContentReport resolveReport(Long reportId);
}
