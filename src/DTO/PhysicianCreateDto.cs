using Homecare.Model;
using Homecare.Validation;
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
        public string Email { get; set; }
        public string Password { get; set; }
        public string Phone { get; set; }
        public string UserName { get; set; }
        [Range(typeof(DateOnly), "1970-01-01", "2004-01-01")]
        public DateOnly DateOfBirth { get; set; }
        [Required]
        [FileValidation(new string[] { "image/jpeg", "image/png", "image/jpg" }, 1024)]
        public IFormFile Image { get; set; }
        public decimal SessionPrice { get; set; }

    }
}
