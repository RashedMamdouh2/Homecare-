using Homecare.Model;
using System.ComponentModel.DataAnnotations;

namespace Homecare.DTO
{
    public class PhysicianDto
    {
        public string Name { get; set; }

        public int SpecializationId { get; set; }
        public Specialization Specialization { get; set; }
        [Required]
        public string ClinicalAddress { get; set; }
        public byte[] Image { get; set; }
    }
}
