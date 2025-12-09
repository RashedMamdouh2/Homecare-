namespace Homecare.Model
{
    public class Report {
        public int Id { get; set; }
        public string Descritpion { get; set; }

        public int PatientId { get; set; }
        public Patient Patient { get; set; }

        public int PhysicianId { get; set; }
        public Physician Physician { get; set; } 

        public byte[] Pdf { get; set; }
        
    }

}
