
using Microsoft.EntityFrameworkCore;
using ProAgil.Domain;

namespace ProjAgil.Repository
{
    public class ProAgilContext : DbContext
    {
        public ProAgilContext(DbContextOptions<ProAgilContext> options): base(options) { }

        public DbSet<Evento> Eventos { get; set; }

        public DbSet<Palestrante> Palestrantes { get; set; }

        public DbSet<RedeSocial> RedeSociais { get; set; }

        public DbSet<PalestranteEvento> PalestranteEventos { get; set; }

        public DbSet<Lote> Lotes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder) {

            modelBuilder.Entity<PalestranteEvento>()
            .HasKey(pe => new { pe.EventoId, pe.PalestranteId });

        }

    }
}