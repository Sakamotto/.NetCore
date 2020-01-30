using System;
using System.Collections.Generic;
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