
using Microsoft.EntityFrameworkCore;

namespace ProjAgil.WebAPI.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options): base(options)
        {
            
        }
    }
}