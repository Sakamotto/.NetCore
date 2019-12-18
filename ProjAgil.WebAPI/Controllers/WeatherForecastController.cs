using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ProjAgil.WebAPI.Model;

namespace ProjAgil.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Evento>> Get()
        {
            return new Evento[] {
                new Evento() {
                    EventoId = 1,
                    Tema = "Angular e .Net Core",
                    Local = "Aevo",
                    Lote = "1º Lote",
                    QtdPessoas = 125,
                    DataEvento = DateTime.Now.AddDays(2).ToString("dd/MM/yyyy")
                },
                new Evento() {
                    EventoId = 2,
                    Tema = "Angular e suas Novidades",
                    Local = "Vitória",
                    Lote = "2º Lote",
                    QtdPessoas = 350,
                    DataEvento = DateTime.Now.AddDays(3).ToString("dd/MM/yyyy")
                }
            };
        }


        [HttpGet("{id}")]
        public ActionResult<Evento> Get(int id)
        {
            return new Evento[] {
                new Evento() {
                    EventoId = 1,
                    Tema = "Angular e .Net Core",
                    Local = "Aevo",
                    Lote = "1º Lote",
                    QtdPessoas = 125,
                    DataEvento = DateTime.Now.AddDays(2).ToString("dd/MM/yyyy")
                },
                new Evento() {
                    EventoId = 2,
                    Tema = "Angular e suas Novidades",
                    Local = "Vitória",
                    Lote = "2º Lote",
                    QtdPessoas = 350,
                    DataEvento = DateTime.Now.AddDays(3).ToString("dd/MM/yyyy")
                }
            }.FirstOrDefault(x => x.EventoId == id);
        }

    }
}
