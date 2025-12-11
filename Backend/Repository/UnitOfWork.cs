using Homecare.Model;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Homecare.Repository
{
    public class UnitOfWork:IUnitOfWork
    {
        private readonly ApplicationDbContext context;
        public IRepository<Patient> Patients { get; private set; }
        public IRepository<Physician> Physicians { get; private set; }
        public IRepository<Appointment> Appointments { get;private set; }
        public IRepository<Medication> Medications { get;private set; }
        public IRepository<Report> Reports { get;private set; }
        public IRepository<Specialization> Specializations { get;private set; }


        public UnitOfWork(ApplicationDbContext context)
        {
            this.context = context;
            Patients       = new Repository<Patient>(context);
            Physicians      = new Repository<Physician>(context);
            Appointments    = new Repository<Appointment>(context);
            Medications     = new Repository<Medication>(context);
            Reports         = new Repository<Report>(context);
            Specializations = new Repository<Specialization>(context);
           
        }
        public async Task<int> SaveDbAsync()
        {
            return await context.SaveChangesAsync();
        }
        public void Dispose()
        {
           context.Dispose();
        }
    }
}
