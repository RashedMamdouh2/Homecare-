using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Homecare.Model
{
    public class Patient
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        [Phone]
        public string Phone { get; set; }
        [Required]
        public string Gender { get; set; }
        [Required]
        public string Address { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
       
        public byte [] Image { get; set; }
        
        public Subscription Subscription { get; set; }
        [ForeignKey(nameof(Subscription))]
        public int SubscriptionId { get; set; }
        public List<Appointment> Appointements { get; set; }
        public List<Medication>Medications { get; set; }
        public Patient()
        {
            Appointements = new();
            Medications = new();
            SubscriptionId = 1;
        }
    }
   
}
