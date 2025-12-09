using Homecare.Model;
using System.ComponentModel.DataAnnotations;

namespace Homecare.DTO
{
    public class PatientDto
    {
        public string Name { get; set; }
        [Phone]
        public string Phone { get; set; }
        public string Gender { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public byte[] Image { get; set; }
        public List<Appointment>? Appointements { get; set; }
        public List<Medication>? Medications { get; set; }
    }
}
