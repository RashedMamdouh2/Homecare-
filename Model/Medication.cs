using System.ComponentModel.DataAnnotations;

namespace Homecare.Model
{
    public class Medication
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }

        public string ?Description { get; set; }

        public int? DoseFrequency { get; set; }
        public decimal? Dose { get; set; }
        public List<TimeOnly>? UsageTimes { get; set; }
    }
   
}
