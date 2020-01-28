using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProAgil.Domain;
using ProAgil.Repository;

namespace ProjAgil.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventoController : ControllerBase
    {
        public readonly IProAgilRepository Repository;

        public EventoController(IProAgilRepository repository)
        {
            Repository = repository;
        }


        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var results = await Repository.GetAllEventosAsync(true);
                return Ok(results);
            }
            catch (Exception e)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                "Erro ao recuperar os eventos");
            }
        }


        [HttpGet("{EventoId}")]
        public async Task<IActionResult> Get(int EventoId)
        {
            try
            {
                var results = await Repository.GetEventosAsyncById(EventoId, true);
                return Ok(results);
            }
            catch (Exception e)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                "Erro ao recuperar os eventos");
            }
        }

        [HttpGet("{Tema}")]
        public async Task<IActionResult> Get(string Tema)
        {
            try
            {
                var results = await Repository.GetAllEventosAsyncByTema(Tema, true);
                return Ok(results);
            }
            catch (Exception e)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                "Erro ao recuperar os eventos");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post(Evento model)
        {
            try
            {
                Repository.Add(model);

                if (await Repository.SaveChangesAsync())
                {
                    return Created($"/api/evento/{model.Id}", model);
                }
            }
            catch (Exception e)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                "Erro ao recuperar os eventos");
            }

            return BadRequest();
        }


        [HttpPut("{EventoId}")]
        public async Task<IActionResult> Put(int EventoId, Evento model)
        {
            try
            {
                var evento = await Repository.GetEventosAsyncById(EventoId, false);

                if (evento == null)
                {
                    return NotFound();
                }

                Repository.Update(model);

                if (await Repository.SaveChangesAsync())
                {
                    return Created($"/api/evento/{model.Id}", model);
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