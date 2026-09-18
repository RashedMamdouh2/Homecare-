using Homecare.Model;
using Homecare.Validation;
using System.ComponentModel.DataAnnotations;

namespace Homecare.DTO
{
    public class PatientCreateDto
    {
        public string Name { get; set; }
        [Phone]
        public string Phone { get; set; }
        public string Gender { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string UserName { get; set; }
        [Range(typeof(DateOnly), "1970-01-01", "2026-01-01")]
        public DateOnly DateOfBirth { get; set; }
        [FileValidation(new string[] { "image/jpeg", "image/png", "image/jpg" }, 1024)]
        public IFormFile Image { get; set; }
   
       
    }
}
