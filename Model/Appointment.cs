namespace Homecare.Model
{
    public class Appointment
    {
        public Guid Id { get; set; }
        public DateTime AppointmentDate { get; set; }
        public TimeOnly StartTime {  get; set; }
        public TimeOnly EndTime {  get; set; }
        
        public Patient Patient { get; set; }
        public int PatientId { get; set; }
        
        public Physician Physician { get; set; }
        public int PhysicianId { get; set; }
        
        public int ReportId { get; set; }
        public Report Report { get; set; }
        
        public Appointment()
        {
            Id = Guid.NewGuid();
        }
    }

}
