using Homecare.Model;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Homecare.Repository
{
    public class UnitOfWork:IUnitOfWork
    {
        private readonly ApplicationDbContext context;
        

        public UnitOfWork(ApplicationDbContext context)
        {
            this.context = context;
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
