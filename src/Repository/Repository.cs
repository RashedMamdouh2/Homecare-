
using Homecare.Model;
using Homecare.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Runtime.CompilerServices;

namespace Homecare.Repository
{
    public class Repository<TEntity> : IRepository<TEntity> where TEntity : class
    {
        protected readonly ApplicationDbContext context;
        protected readonly DbSet<TEntity> DbSet;


        public Repository(ApplicationDbContext context)
        {
            this.context = context;
            DbSet=context.Set<TEntity>();
            
        }
        public async Task<TEntity>GetByIdAsync(int id)
        {
            return await DbSet.FindAsync(id);
        }
        public IEnumerable<TEntity> GetAll()
        {
            return DbSet.AsNoTracking();
        }
        public async Task<TEntity> GetAsync(Expression<Func<TEntity, bool>> filter, string[] includes) 
        {
            Expression<Func<TEntity, bool>> ex = filter;

            var query = DbSet.AsQueryable();
            foreach (var include in includes)
            {
                query = query.Include(include);
            }

            return (await query.FirstOrDefaultAsync(ex));
        }
        public async Task<TEntity> FindAsync(Expression<Func<TEntity, bool>> filter, string[]? includes)
        {
            Expression<Func<TEntity, bool>> ex = filter;

            var query = DbSet.AsQueryable().AsNoTracking();
            foreach (var include in includes)
            {
                query = query.Include(include);
            }
            
            return (await query.FirstOrDefaultAsync(ex));
        }
        public IEnumerable<TEntity> FindAll(Expression<Func<TEntity, bool>> filter, string[]? includes ,int take = -1, int skip = -1)
        {

            Expression<Func<TEntity, bool>> ex = filter;

            var query = DbSet.AsQueryable();
            foreach (var include in includes)
            {
                query = query.Include(include).AsNoTracking();
            }
            query = query.Where(ex);
            var res = query;
            if (skip >= 0)
            {
                res = res.Skip(skip);
                
            }
            if (take >= 0)
            {
                res = res.Take(take);
            }
            return res.AsEnumerable();
        }
        public int Count(Expression<Func<TEntity, bool>> ? filter = null)
        {
            if (filter is null) return DbSet.Count();
            return DbSet.Count(filter);
        }
        public async Task AddAsync(TEntity entity)
        {
            await DbSet.AddAsync(entity);
        }
        public async Task AddRangeAsync(List<TEntity> entities)
        {
            await DbSet.AddRangeAsync(entities);
        }
        public void Update(TEntity entity)
        {
            DbSet.Update(entity);
        }
        public async Task DeleteAsync(int id)
        {
            var obj = await GetByIdAsync(id);
            DbSet.Remove(obj);
        }

    }
}
