using Homecare.Model;

namespace Homecare.Repository
{
    public interface IUnitOfWork:IDisposable
    {
        public IRepository<Patient> Patients { get;  }
        public IRepository<Physician> Physicians { get;  }
        public IRepository<Appointment> Appointments { get; }
        public IRepository<Medication> Medications { get;  }
        public IRepository<Report> Reports { get;  }
        public IRepository<Specialization> Specializations { get;}


        public Task<int> SaveDbAsync();
    }
}
