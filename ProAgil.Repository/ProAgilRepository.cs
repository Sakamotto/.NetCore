using System.Linq;
using System.Threading.Tasks;
using ProAgil.Domain;
using ProjAgil.Repository;
using Microsoft.EntityFrameworkCore;

namespace ProAgil.Repository
{
    public class ProAgilRepository : IProAgilRepository
    {
        private readonly ProAgilContext Context;

        public ProAgilRepository(ProAgilContext context)
        {
            Context = context;
        }

        // GERAIS
        public void Add<T>(T entity) where T : class
        {
            Context.Add(entity);
        }

        public void Update<T>(T entity) where T : class
        {
            Context.Update(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            Context.Remove(entity);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return (await Context.SaveChangesAsync()) > 0;
        }

        // EVENTO
        public async Task<Evento> GetEventosAsyncById(int eventoId, bool includePalestrantes)
        {
            IQueryable<Evento> query = Context.Eventos
                .Include(c => c.Lotes)
                .Include(c => c.RedesSociais);

            if (includePalestrantes)
            {
                query.Include(pe => pe.PalestranteEventos)
                    .ThenInclude(p => p.Palestrante);
            }

            return await query.AsNoTracking().OrderByDescending(c => c.DataEvento)
                .FirstOrDefaultAsync(c => c.Id == eventoId);
        }

        public async Task<Evento[]> GetAllEventosAsync(bool includePalestrantes = false)
        {
            IQueryable<Evento> query = Context.Eventos
                .Include(c => c.Lotes)
                .Include(c => c.RedesSociais);

            if (includePalestrantes)
            {
                query.Include(pe => pe.PalestranteEventos)
                .ThenInclude(p => p.Palestrante);
            }

            query = query.AsNoTracking().OrderByDescending(c => c.DataEvento);

            return await query.ToArrayAsync();

        }

        public async Task<Evento[]> GetAllEventosAsyncByTema(string tema, bool includePalestrantes)
        {
            IQueryable<Evento> query = Context.Eventos
                .Include(c => c.Lotes)
                .Include(c => c.RedesSociais);

            if (includePalestrantes)
            {
                query.Include(pe => pe.PalestranteEventos)
                .ThenInclude(p => p.Palestrante);
            }

            query = query.AsNoTracking().OrderByDescending(c => c.DataEvento)
                .Where(c => c.Tema.ToLower().Contains(tema.ToLower()));

            return await query.ToArrayAsync();
        }

        // PALESTRANTE

        public async Task<Palestrante[]> GetAllPalestrantesAsyncByName(string name, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = Context.Palestrantes
                .Include(p => p.RedesSociais);

            if (includeEventos)
            {
                query.Include(pe => pe.PalestrantesEventos)
                    .ThenInclude(p => p.Evento);
            }

            return await query.AsNoTracking().OrderBy(p => p.Nome)
                .Where(p => p.Nome.ToLower().Contains(name.ToLower())).ToArrayAsync();
        }


        public async Task<Palestrante> GetPalestranteAsyncById(int palestranteId, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = Context.Palestrantes
                .Include(p => p.RedesSociais);

            if (includeEventos)
            {
                query.Include(pe => pe.PalestrantesEventos)
                    .ThenInclude(p => p.Evento);
            }

            return await query.AsNoTracking().OrderBy(p => p.Nome).FirstOrDefaultAsync(p => p.Id == palestranteId);
        }

    }
}