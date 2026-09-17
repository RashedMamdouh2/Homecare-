using System.ComponentModel.DataAnnotations;

namespace Homecare.Validation
{
    public class FutureDateAttribute:ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {

            if (value is not DateTime appointmentDate)
            {
                return new ValidationResult("Invalid Date For Appointment");
            }

            var appointmentDay = DateOnly.FromDateTime(appointmentDate);
            if (appointmentDay < DateOnly.FromDateTime(DateTime.Today))
            {
                return new ValidationResult("Invalid Date For Appointment");
            }
            return ValidationResult.Success;
        }
    }
}
