namespace Homecare.Repository
{
    public interface IUnitOfWork:IDisposable
    {
        public  Task<int> SaveDbAsync();
    }
}
