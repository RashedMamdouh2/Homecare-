using System.ComponentModel.DataAnnotations;

namespace Homecare.Validation
{
    public class FileValidationAttribute:ValidationAttribute
    {
        private readonly string[] allowedTypes;
        private readonly int allowedSize;

        public FileValidationAttribute(string[] allowedTypes,int allowedSize)
        {
            this.allowedTypes = allowedTypes;
            this.allowedSize = allowedSize;
        }
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if(value is not IFormFile image) return new ValidationResult("Image Should be png, jpg or jpeg of Maximum 1000 KB Size");
            if (image != null && (!allowedTypes.Contains(image.ContentType.ToLower()) || image.Length > 1024 * allowedSize))
            {
                return new ValidationResult("Image Should be png, jpg or jpeg of Maximum 1000 KB Size");
            }

            return ValidationResult.Success;
        }
    }
}
