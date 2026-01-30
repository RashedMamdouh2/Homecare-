using System.ComponentModel.DataAnnotations;

namespace Homecare.Validation
{
    public class FutureDateAttribute:ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            var appointmentDate = (DateOnly)value;
            if (appointmentDate < DateOnly.FromDateTime(DateTime.Today))
            {
                return new ValidationResult("Invalid Date For Appointment");
            }
            return ValidationResult.Success;
        }
    }
}
