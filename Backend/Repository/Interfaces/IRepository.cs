using System.Linq.Expressions;

namespace Homecare.Repository.Interfaces
{
    public interface IRepository<TEntity> where TEntity : class
    {
        public Task<TEntity> GetByIdAsync(int id);
        public Task<TEntity> GetAsync(Expression<Func<TEntity, bool>> filter, string[]? includes);
        public IEnumerable<TEntity> GetAll();
        public int Count(Expression<Func<TEntity, bool>> ? filter =null);
        public IEnumerable<TEntity> FindAll(Expression<Func<TEntity, bool>> filter, string[] ?includes, int take = -1, int skip = -1);
        public  Task<TEntity> FindAsync(Expression<Func<TEntity, bool>> filter, string[]? includes);
        public Task AddAsync(TEntity entity);
        public  Task AddRangeAsync(List<TEntity> entities);
        public void Update(TEntity entity);
        public Task DeleteAsync(int id);
        


    }
}
