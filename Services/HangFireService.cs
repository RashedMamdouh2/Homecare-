using Hangfire;
using Homecare.Model;
using Homecare.Repository;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace Homecare.Services
{
    public class HangFireService : IHangFireService
        
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly string _accountSid = "ACa9cfc0fcdf26e8c7ab895fcec13a99ee";
        private readonly string _authToken = "cf51f5c5417dd1f5ce06d43bf8805d8c";

        public void SendWhatsApp(string to, string message)
        {
            TwilioClient.Init(_accountSid, _authToken);

            var msg = MessageResource.Create(
                from: new PhoneNumber("whatsapp:+14155238886"),
                body: message,
                to: new PhoneNumber($"whatsapp:+2{to}")
            );

            Console.WriteLine($"WhatsApp message sent! SID: {msg.Sid}");
        }
        public HangFireService(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
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


                SendWhatsApp(patientPhone, message);
                }    
            }
            //unitOfWork.Patients.FindAll(p => p.Medications.Contains(medications), new string[] { nameof(Patient.Medications)});
        }
    }
}
