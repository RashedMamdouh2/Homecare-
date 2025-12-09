using Microsoft.EntityFrameworkCore;

namespace Homecare.Model
{
    public class ApplicationDbContext:DbContext 
    {
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Physician> Physicians { get; set; }
        public DbSet<Appointment> Appointements { get; set; }
        //public DbSet<Medication> Medications { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<Specialization> Specializations { get; set; }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) :base(options)
        {
            
        }
    }
}
