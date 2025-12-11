using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Homecare.Model
{
    public class ApplicationDbContext :IdentityDbContext<ApplicationUser>
    {
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Physician> Physicians { get; set; }
        public DbSet<Appointment> Appointements { get; set; }
        public DbSet<Medication> Medication { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<Specialization> Specializations { get; set; }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) :base(options)
        {
            
        }
    }
 
}
