using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProAgil.Domain;
using ProAgil.Repository;
using ProjAgil.WebAPI.Dtos;

namespace ProjAgil.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventoController : ControllerBase
    {
        public readonly IProAgilRepository Repository;
        private readonly IMapper Mapper;

        public EventoController(IProAgilRepository repository, IMapper mapper)
        {
            Repository = repository;
            Mapper = mapper;
        }


        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var eventos = await Repository.GetAllEventosAsync(true);

                var results = Mapper.Map<IEnumerable<EventoDto>>(eventos);

                return Ok(results);
            }
            catch (Exception e)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                $"Erro ao recuperar os eventos: {e.Message}");
            }
        }


        [HttpPost("Upload")]
        public async Task<IActionResult> Upload()
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Resources", "Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                if (file.Length > 0)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName;
                    var fullPath = Path.Combine(pathToSave, fileName.Replace("\"", "").Trim());

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }

                return Ok();
            }
            catch (Exception e)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                                "Erro ao tentar realizar upload");
            }
        }


        [HttpGet("{EventoId}")]
        public async Task<IActionResult> Get(int EventoId)
        {
            try
            {
                var evento = await Repository.GetEventosAsyncById(EventoId, true);

                var result = Mapper.Map<EventoDto>(evento);

                return Ok(result);
            }
            catch (Exception e)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                "Erro ao recuperar os eventos");
            }
        }

        [HttpGet("tema/{Tema}")]
        public async Task<IActionResult> Get(string Tema)
        {
            try
            {
                var eventos = await Repository.GetAllEventosAsyncByTema(Tema, true);

                var results = Mapper.Map<EventoDto[]>(eventos);

                return Ok(results);
            }
            catch (Exception e)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                "Erro ao recuperar os eventos");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(EventoDto model)
        {
            try
            {
                var evento = Mapper.Map<Evento>(model);
                Repository.Add(evento);

                if (await Repository.SaveChangesAsync())
                {
                    return Created($"/api/evento/{evento.Id}", Mapper.Map<EventoDto>(evento));
                }
            }
            catch (Exception e)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                $"Erro ao recuperar os eventos: {e.Message}");
            }

            return BadRequest();
        }


        [HttpPut("{EventoId}")]
        public async Task<IActionResult> Put(int EventoId, EventoDto model)
        {
            try
            {
                var evento = await Repository.GetEventosAsyncById(EventoId, false);

                if (evento == null)
                {
                    return NotFound();
                }

                var idLotes = new List<int>();
                var idRedesSociais = new List<int>();

                model.Lotes.ForEach(item => idLotes.Add(item.Id));
                model.RedesSociais.ForEach(item => idRedesSociais.Add(item.Id));

                var lotes = evento.Lotes.Where(
                    lote => !idLotes.Contains(lote.Id)
                ).ToArray();

                var redesSociais = evento.RedesSociais.Where(
                    rede => !idLotes.Contains(rede.Id)
                ).ToArray();

                if (lotes.Length > 0) Repository.DeleteRange(lotes);
                if (redesSociais.Length > 0) Repository.Delete(redesSociais);

                Mapper.Map(model, evento);

                Repository.Update(evento);

                if (await Repository.SaveChangesAsync())
                {
                    return Created($"/api/evento/{evento.Id}", Mapper.Map<EventoDto>(evento));
                }
            }
            catch (Exception e)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                "Erro ao recuperar os eventos");
            }

            return BadRequest();
        }

        [HttpDelete("{EventoId}")]
        public async Task<IActionResult> Delete(int EventoId)
        {
            try
            {
                var evento = await Repository.GetEventosAsyncById(EventoId, false);
                if (evento == null) return NotFound();

                Repository.Delete(evento);

                if (await Repository.SaveChangesAsync())
                {
                    return Ok();
                }
            }
            catch (Exception e)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                "Erro ao recuperar os eventos");
            }

            return BadRequest();
        }

    }
}