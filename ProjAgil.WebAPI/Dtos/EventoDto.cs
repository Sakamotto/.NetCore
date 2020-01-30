using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProjAgil.WebAPI.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }

        public string Local { get; set; }

        public string DataEvento { get; set; }

        [Required(ErrorMessage = "O Tema deve ser preenchido")]
        public string Tema { get; set; }

        [Range(2, 120000, ErrorMessage = "Quantidade de pessoas deve ser entre 2 e 120000")]
        public int QtdPessoas { get; set; }

        public string ImagemURL { get; set; }

        public string Telefone { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        public List<LoteDto> Lotes { get; set; }

        public List<RedeSocialDto> RedesSociais { get; set; }

        public List<PalestranteDto> Palestrantes { get; set; }
    }
}