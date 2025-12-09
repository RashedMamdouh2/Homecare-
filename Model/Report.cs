using Homecare.DTO;
using System.ComponentModel.DataAnnotations.Schema;

namespace Homecare.Model
{
    public class Report {
        public int Id { get; set; }
        public string Descritpion { get; set; }

        public int PatientId { get; set; }
        public Patient Patient { get; set; }

        public int PhysicianId { get; set; }
        public Physician Physician { get; set; } 
        public List<Medication>Medications { get; set; }
        public byte[] Pdf { get; set; }

        [ForeignKey(nameof(Appointment))]
        public Guid AppointmentId { get; set; }
        public Appointment Appointment { get; set; }
        
    }
    

}
