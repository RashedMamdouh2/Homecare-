using Homecare.DTO;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Homecare.Services
{

    public class QuestPDFService : IPDFService
    {
        private readonly IWebHostEnvironment _env;

        public QuestPDFService(IWebHostEnvironment environment)
        {
            this._env = environment;
        }
        public async Task <string> CreateReportPDF(ReportCreateDto report)
        {
            QuestPDF.Settings.License = QuestPDF.Infrastructure.LicenseType.Community;

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(40);
                    page.PageColor(Colors.White);

                    // ================= HEADER =================
                    page.Header().Column(header =>
                    {
                        header.Item().Text("Patient Medical Report")
                            .FontSize(20)
                            .Bold()
                            .FontColor(Colors.Blue.Darken2);

                        header.Item().LineHorizontal(1)
                            .LineColor(Colors.Grey.Lighten2);
                    });

                    // ================= CONTENT =================
                    page.Content().Column(column =>
                    {
                        column.Spacing(20);

                        // -------- Patient & Physician Info --------
                        column.Item().Background(Colors.Grey.Lighten4).Padding(15).Column(info =>
                        {
                            info.Spacing(5);

                            info.Item().Text($"Patient Name: {report.PatientName ?? "N/A"}")
                                .FontSize(12).Bold();

                            info.Item().Text($"Attending Physician: {report.PhysicianName ?? "N/A"}")
                                .FontSize(12);

                            info.Item().Text($"Report Date: {DateTime.Now:dd MMM yyyy}")
                                .FontSize(10)
                                .FontColor(Colors.Grey.Darken1);
                        });

                        // -------- Diagnosis Section --------
                        column.Item().Column(diagnosis =>
                        {
                            diagnosis.Spacing(8);

                            diagnosis.Item().Text("Diagnosis")
                                .FontSize(15)
                                .Bold()
                                .FontColor(Colors.Blue.Darken1);

                            diagnosis.Item().Text(
                                report.Descritpion ?? "No diagnosis description provided."
                            )
                            .FontSize(12)
                            .LineHeight(1.4f);
                        });

                        // -------- Medications Section --------
                        column.Item().Column(meds =>
                        {
                            meds.Spacing(10);

                            meds.Item().Text("Prescribed Medications")
                                .FontSize(15)
                                .Bold()
                                .FontColor(Colors.Blue.Darken1);

                            if (report.Medications != null && report.Medications.Any())
                            {
                                meds.Item().Table(table =>
                                {
                                    table.ColumnsDefinition(columns =>
                                    {
                                        columns.ConstantColumn(30);   // #
                                        columns.RelativeColumn(2);    // Name
                                        columns.RelativeColumn(3);    // Description
                                        columns.ConstantColumn(60);   // Dose
                                        columns.ConstantColumn(80);   // Frequency
                                        columns.RelativeColumn(2);    // Usage Times
                                    });

                                    // Table Header
                                    table.Header(header =>
                                    {
                                        header.Cell().Background(Colors.Blue.Lighten4).Padding(5).Text("#").Bold();
                                        header.Cell().Background(Colors.Blue.Lighten4).Padding(5).Text("Medication").Bold();
                                        header.Cell().Background(Colors.Blue.Lighten4).Padding(5).Text("Description").Bold();
                                        header.Cell().Background(Colors.Blue.Lighten4).Padding(5).Text("Dose").Bold();
                                        header.Cell().Background(Colors.Blue.Lighten4).Padding(5).Text("Frequency").Bold();
                                        header.Cell().Background(Colors.Blue.Lighten4).Padding(5).Text("Usage Time").Bold();
                                    });

                                    int index = 1;
                                    foreach (var med in report.Medications)
                                    {
                                        table.Cell().Padding(5).Text(index++.ToString());
                                        table.Cell().Padding(5).Text(med.Name);
                                        table.Cell().Padding(5).Text(med.Description ?? "-");
                                        table.Cell().Padding(5).Text(med.Dose?.ToString() ?? "-");
                                        table.Cell().Padding(5).Text(med.DoseFrequency?.ToString() ?? "-");

                                        var usageTimes = med.UsageTimes != null && med.UsageTimes.Any()
                                            ? string.Join(", ", med.UsageTimes.Select(t => t.ToString("HH:mm")))
                                            : "-";

                                        table.Cell().Padding(5).Text(usageTimes);
                                    }
                                });
                            }
                            else
                            {
                                meds.Item().Text("No medications prescribed.")
                                    .Italic()
                                    .FontColor(Colors.Grey.Darken1);
                            }
                        });
                    });

                    // ================= FOOTER =================
                    page.Footer().AlignCenter().Text(text =>
                    {
                        text.Span("© Homecare System 2025")
                            .FontSize(9)
                            .FontColor(Colors.Grey.Darken2);
                    });
                });
            });

            var generatedPdf = document.GeneratePdf();
            return await ReadPdf(generatedPdf);
        }
        public async Task<string> ReadPdf(byte[] report)
        {
            string shortPath = Path.Combine("Pdf", Guid.NewGuid().ToString()+".pdf");
            string fullPath = Path.Combine(_env.WebRootPath, shortPath);
            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await stream.WriteAsync(report);


            }
            return '/' + shortPath.Replace("\\", "/"); ;
        }
    }
}