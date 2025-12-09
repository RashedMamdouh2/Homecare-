using System.ComponentModel.DataAnnotations;

namespace Homecare.Model
{
    public class Physician {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }

        public int SpecializationId { get; set; }
        public Specialization Specialization { get; set; }
        [Required]
        public string ClinicalAddress {  get; set; }
        [Required]
        public byte[] Image { get; set; }
        public List<Appointment> Appointements {  get; set; }
        public Physician()
        {
            Appointements = new List<Appointment>();
        }
    }

}
