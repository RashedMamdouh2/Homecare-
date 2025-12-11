using Hangfire;
using Homecare.Model;
using Homecare.Repository;
using Microsoft.Identity.Client;

namespace Homecare.Services
{
    public class HangFireService : IHangFireService
        
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IMessagingService messagingService;
       

        
        public HangFireService(IUnitOfWork unitOfWork,IMessagingService messagingService)
        {
            this.unitOfWork = unitOfWork;
            this.messagingService = messagingService;
        }
        public void CheckMedicaitions()
        {
            var now = TimeOnly.FromDateTime(DateTime.Now);
             
            var medications = unitOfWork.Medications.FindAll(md => true, new string[] { nameof(Medication.Patient) }).ToList();
            foreach (var medication in medications)
            {
                if (medication.UsageTimes.Any(t => Math.Abs((t.ToTimeSpan() - now.ToTimeSpan()).TotalMinutes) < 1))
                {

                var patientPhone = medication.Patient.Phone;
                string message = $"Hello {medication.Patient.Name}! Don't forget to take {medication.Name} Now with Dose {medication.Dose}";


                messagingService.SendWhatsApp(patientPhone, message);
                }    
            }
            //unitOfWork.Patients.FindAll(p => p.Medications.Contains(medications), new string[] { nameof(Patient.Medications)});
        }
    }
}
