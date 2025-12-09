using Homecare.Model;
using System.ComponentModel.DataAnnotations;

namespace Homecare.DTO
{
    public class PhysicianCreateDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public int SpecializationId { get; set; }
        [Required]
        public string ClinicalAddress { get; set; }
        [Required]
        public IFormFile Image { get; set; }
    }
}
