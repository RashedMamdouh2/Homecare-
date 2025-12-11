using Homecare.DTO;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Homecare.Services
{
    public interface IPDFService
    {
        byte[] CreateReportPDF(ReportCreateDto report);
    }

    public class PDFService : IPDFService
    {
        public byte[] CreateReportPDF(ReportCreateDto report)
        {
            QuestPDF.Settings.License = QuestPDF.Infrastructure.LicenseType.Community;

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(50);
                    page.Size(PageSizes.A4);
                    page.PageColor(Colors.White);

                    page.Header().Text($"Patient Report - ID: {report.patientId}")
                        .FontSize(18)
                        .Bold()
                        .FontColor(Colors.Blue.Medium);

                    page.Content().Column(column =>
                    {
                        column.Spacing(10);

                        // Description Section
                        column.Item().Text("Report Description")
                            .FontSize(14).Bold();
                        column.Item().Text(report.Descritpion ?? "No description provided.");

                        // Physician Info
                        column.Item().Text($"Physician ID: {report.PhysicianId}");

                        // Medications Section
                        if (report.Medications != null && report.Medications.Any())
                        {
                            column.Item().Text("Prescribed Medications").FontSize(14).Bold().Underline();

                            column.Item().Table(table =>
                            {
                                table.ColumnsDefinition(columns =>
                                {
                                    columns.ConstantColumn(40); // #
                                    columns.RelativeColumn(2); // Name
                                    columns.RelativeColumn(3); // Description
                                    columns.ConstantColumn(60); // Dose
                                    columns.ConstantColumn(80); // Frequency
                                    columns.RelativeColumn(3); // Usage Times
                                });

                                // Header Row
                                table.Header(header =>
                                {
                                    header.Cell().Text("#").Bold();
                                    header.Cell().Text("Name").Bold();
                                    header.Cell().Text("Description").Bold();
                                    header.Cell().Text("Dose").Bold();
                                    header.Cell().Text("Frequency").Bold();
                                    header.Cell().Text("Usage Times").Bold();
                                });

                                // Data Rows
                                int i = 1;
                                foreach (var med in report.Medications)
                                {
                                    table.Cell().Text(i++.ToString());
                                    table.Cell().Text(med.Name);
                                    table.Cell().Text(med.Description ?? "-");
                                    table.Cell().Text(med.Dose?.ToString() ?? "-");
                                    table.Cell().Text(med.DoseFrequency?.ToString() ?? "-");

                                    var usageTimes = med.UsageTimes != null && med.UsageTimes.Any()
                                        ? string.Join(", ", med.UsageTimes.Select(t => t.ToString("HH:mm")))
                                        : "-";
                                    table.Cell().Text(usageTimes);
                                }
                            });
                        }
                        else
                        {
                            column.Item().Text("No medications listed.").Italic();
                        }

                        // Footer
                        column.Item().Text($"Generated on: {DateTime.Now}")
                            .FontSize(10)
                            .AlignRight();
                    });

                    page.Footer().AlignCenter().Text(x =>
                    {
                        x.Span("© Homecare System 2025").FontSize(9);
                    });
                });
            });

            return document.GeneratePdf();
        }
    }
}