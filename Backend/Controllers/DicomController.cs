using Homecare.DTO;
using Homecare.Model;
using Homecare.Repository;
using Homecare.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Homecare.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DicomController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IImageServices _imageServices;

        public DicomController(IUnitOfWork unitOfWork, IImageServices imageServices)
        {
            _unitOfWork = unitOfWork;
            _imageServices = imageServices;
        }

        [HttpPost("upload")]
        [Authorize]
        public async Task<IActionResult> UploadDicomFile([FromForm] DicomFileCreateDto dicomDto)
        {
            try
            {
                // Validate patient and physician exist
                var patient = await _unitOfWork.Patients.FindAsync(p => p.Id == dicomDto.PatientId);
                if (patient == null)
                    return NotFound("Patient not found");

                var physician = await _unitOfWork.Physicians.FindAsync(p => p.Id == dicomDto.PhysicianId);
                if (physician == null)
                    return NotFound("Physician not found");

                // Validate file
                if (dicomDto.File == null || dicomDto.File.Length == 0)
                    return BadRequest("No file uploaded");

                // Check file type (DICOM files typically don't have standard extensions)
                var allowedTypes = new[] { "application/octet-stream", "application/dicom" };
                if (!allowedTypes.Contains(dicomDto.File.ContentType.ToLower()) &&
                    !dicomDto.File.FileName.ToLower().EndsWith(".dcm") &&
                    !dicomDto.File.FileName.ToLower().EndsWith(".dicom"))
                {
                    // Allow any file for now, but log the content type
                    Console.WriteLine($"DICOM upload with content type: {dicomDto.File.ContentType}");
                }

                if (dicomDto.File.Length > 50 * 1024 * 1024) // 50MB limit
                    return BadRequest("File size must be less than 50MB");

                // Create uploads directory if it doesn't exist
                var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "dicom");
                Directory.CreateDirectory(uploadsDir);

                // Generate unique filename
                var fileName = $"{Guid.NewGuid()}_{dicomDto.File.FileName}";
                var filePath = Path.Combine(uploadsDir, fileName);

                // Save file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dicomDto.File.CopyToAsync(stream);
                }

                // Create DICOM file record
                var dicomFile = new DicomFile
                {
                    PatientId = dicomDto.PatientId,
                    PhysicianId = dicomDto.PhysicianId,
                    FileName = fileName,
                    OriginalFileName = dicomDto.File.FileName,
                    FilePath = filePath,
                    FileSize = dicomDto.File.Length,
                    ContentType = dicomDto.File.ContentType,
                    Notes = dicomDto.Notes
                };

                await _unitOfWork.DicomFiles.AddAsync(dicomFile);
                await _unitOfWork.SaveDbAsync();

                // TODO: Trigger AI analysis in background
                // This would typically be done with a background job

                return CreatedAtAction(nameof(GetDicomFile), new { id = dicomFile.Id }, dicomFile);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetDicomFile(int id)
        {
            var dicomFile = await _unitOfWork.DicomFiles.FindAsync(d => d.Id == id,
                new[] { nameof(DicomFile.Patient), nameof(DicomFile.Physician), nameof(DicomFile.Annotations) });

            if (dicomFile == null)
                return NotFound("DICOM file not found");

            var dicomDto = new DicomFileSendDto
            {
                Id = dicomFile.Id,
                PatientId = dicomFile.PatientId,
                PatientName = dicomFile.Patient.Name,
                PhysicianId = dicomFile.PhysicianId,
                PhysicianName = dicomFile.Physician.Name,
                FileName = dicomFile.FileName,
                OriginalFileName = dicomFile.OriginalFileName,
                FileSize = dicomFile.FileSize,
                UploadDate = dicomFile.UploadDate,
                StudyInstanceUID = dicomFile.StudyInstanceUID,
                Modality = dicomFile.Modality,
                BodyPart = dicomFile.BodyPart,
                StudyDescription = dicomFile.StudyDescription,
                AnalysisStatus = dicomFile.AnalysisStatus,
                AIAnalysisResult = dicomFile.AIAnalysisResult,
                ConfidenceScore = dicomFile.ConfidenceScore,
                AnalysisDate = dicomFile.AnalysisDate,
                Notes = dicomFile.Notes,
                CreatedAt = dicomFile.CreatedAt,
                UpdatedAt = dicomFile.UpdatedAt,
                Annotations = dicomFile.Annotations.Select(a => new DicomAnnotationSendDto
                {
                    Id = a.Id,
                    DicomFileId = a.DicomFileId,
                    PhysicianId = a.PhysicianId,
                    PhysicianName = a.Physician.Name,
                    AnnotationType = a.AnnotationType,
                    AnnotationData = a.AnnotationData,
                    Description = a.Description,
                    CreatedDate = a.CreatedDate,
                    ModifiedDate = a.ModifiedDate,
                    CreatedAt = a.CreatedAt,
                    UpdatedAt = a.UpdatedAt
                }).ToList()
            };

            return Ok(dicomDto);
        }

        [HttpGet("patient/{patientId}")]
        [Authorize]
        public async Task<IActionResult> GetPatientDicomFiles(int patientId)
        {
            var dicomFiles = _unitOfWork.DicomFiles.FindAll(d => d.PatientId == patientId,
                new[] { nameof(DicomFile.Patient), nameof(DicomFile.Physician) })
                .OrderByDescending(d => d.UploadDate);

            var dicomDtos = dicomFiles.Select(dicomFile => new DicomFileSendDto
            {
                Id = dicomFile.Id,
                PatientId = dicomFile.PatientId,
                PatientName = dicomFile.Patient.Name,
                PhysicianId = dicomFile.PhysicianId,
                PhysicianName = dicomFile.Physician.Name,
                FileName = dicomFile.FileName,
                OriginalFileName = dicomFile.OriginalFileName,
                FileSize = dicomFile.FileSize,
                UploadDate = dicomFile.UploadDate,
                Modality = dicomFile.Modality,
                BodyPart = dicomFile.BodyPart,
                StudyDescription = dicomFile.StudyDescription,
                AnalysisStatus = dicomFile.AnalysisStatus,
                AIAnalysisResult = dicomFile.AIAnalysisResult,
                ConfidenceScore = dicomFile.ConfidenceScore,
                AnalysisDate = dicomFile.AnalysisDate,
                Notes = dicomFile.Notes,
                CreatedAt = dicomFile.CreatedAt,
                UpdatedAt = dicomFile.UpdatedAt
            });

            return Ok(dicomDtos);
        }

        [HttpGet("download/{id}")]
        [Authorize]
        public async Task<IActionResult> DownloadDicomFile(int id)
        {
            var dicomFile = await _unitOfWork.DicomFiles.FindAsync(d => d.Id == id);

            if (dicomFile == null)
                return NotFound("DICOM file not found");

            if (!System.IO.File.Exists(dicomFile.FilePath))
                return NotFound("File not found on disk");

            var fileBytes = await System.IO.File.ReadAllBytesAsync(dicomFile.FilePath);
            return File(fileBytes, "application/octet-stream", dicomFile.OriginalFileName);
        }

        [HttpPost("{dicomFileId}/annotation")]
        [Authorize]
        public async Task<IActionResult> AddAnnotation(int dicomFileId, [FromBody] DicomAnnotationCreateDto annotationDto)
        {
            var dicomFile = await _unitOfWork.DicomFiles.FindAsync(d => d.Id == dicomFileId);
            if (dicomFile == null)
                return NotFound("DICOM file not found");

            // Get current user (physician)
            var physicianIdClaim = User.FindFirst("PhysicianId")?.Value;
            if (string.IsNullOrEmpty(physicianIdClaim) || !int.TryParse(physicianIdClaim, out int physicianId))
                return Unauthorized("Physician ID not found in token");

            var physician = await _unitOfWork.Physicians.FindAsync(p => p.Id == physicianId);
            if (physician == null)
                return NotFound("Physician not found");

            var annotation = new DicomAnnotation
            {
                DicomFileId = dicomFileId,
                PhysicianId = physicianId,
                AnnotationType = annotationDto.AnnotationType,
                AnnotationData = annotationDto.AnnotationData,
                Description = annotationDto.Description
            };

            await _unitOfWork.DicomAnnotations.AddAsync(annotation);
            await _unitOfWork.SaveDbAsync();

            return CreatedAtAction(nameof(GetDicomFile), new { id = dicomFileId }, annotation);
        }

        [HttpPut("annotation/{annotationId}")]
        [Authorize]
        public async Task<IActionResult> UpdateAnnotation(int annotationId, [FromBody] DicomAnnotationCreateDto annotationDto)
        {
            var annotation = await _unitOfWork.DicomAnnotations.FindAsync(a => a.Id == annotationId,
                new[] { nameof(DicomAnnotation.Physician) });

            if (annotation == null)
                return NotFound("Annotation not found");

            // Check if current user owns this annotation
            var physicianIdClaim = User.FindFirst("PhysicianId")?.Value;
            if (string.IsNullOrEmpty(physicianIdClaim) || !int.TryParse(physicianIdClaim, out int physicianId))
                return Unauthorized("Physician ID not found in token");

            if (annotation.PhysicianId != physicianId)
                return Forbid("You can only edit your own annotations");

            annotation.AnnotationType = annotationDto.AnnotationType;
            annotation.AnnotationData = annotationDto.AnnotationData;
            annotation.Description = annotationDto.Description;
            annotation.ModifiedDate = DateTime.UtcNow;
            annotation.UpdatedAt = DateTime.UtcNow;

            _unitOfWork.DicomAnnotations.UpdateById(annotation);
            await _unitOfWork.SaveDbAsync();

            return Ok(annotation);
        }

        [HttpDelete("annotation/{annotationId}")]
        [Authorize]
        public async Task<IActionResult> DeleteAnnotation(int annotationId)
        {
            var annotation = await _unitOfWork.DicomAnnotations.FindAsync(a => a.Id == annotationId);

            if (annotation == null)
                return NotFound("Annotation not found");

            // Check if current user owns this annotation
            var physicianIdClaim = User.FindFirst("PhysicianId")?.Value;
            if (string.IsNullOrEmpty(physicianIdClaim) || !int.TryParse(physicianIdClaim, out int physicianId))
                return Unauthorized("Physician ID not found in token");

            if (annotation.PhysicianId != physicianId)
                return Forbid("You can only delete your own annotations");

            _unitOfWork.DicomAnnotations.RemoveById(annotation);
            await _unitOfWork.SaveDbAsync();

            return NoContent();
        }
    }
}