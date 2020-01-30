using System.Linq;
using AutoMapper;
using ProAgil.Domain;
using ProjAgil.WebAPI.Dtos;

namespace ProjAgil.WebAPI.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Evento, EventoDto>()
                .ForMember(dest => dest.Palestrantes, opt =>
                {
                    opt.MapFrom(src => src.PalestranteEventos.Select(x => x.Palestrante).ToList());
                }).ReverseMap();

            CreateMap<Palestrante, PalestranteDto>()
                .ForMember(dest => dest.Eventos, opt =>
                {
                    opt.MapFrom(src => src.PalestrantesEventos.Select(x => x.Evento).ToList());
                }).ReverseMap();

            CreateMap<RedeSocial, RedeSocialDto>().ReverseMap();
            CreateMap<Lote, LoteDto>().ReverseMap();
        }
    }
}