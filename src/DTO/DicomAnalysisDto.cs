using Homecare.Model;

namespace Homecare.DTO
{
    public class DicomAnalysisDto
    {
       public string Id{get;set;}
       public string FileName{get;set;}
       public string Findings{get;set;}
       public decimal Confidence{get;set;}
       public string Recommendations{get;set;}
       public string AnalyzedAt{get;set;}
       public int PhysicianId{get;set;}
       public int PatientId { get; set; }
    }
}
