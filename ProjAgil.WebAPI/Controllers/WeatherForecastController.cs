﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ProjAgil.Repository;

namespace ProjAgil.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        public readonly ProAgilContext Context;

        public WeatherForecastController(ProAgilContext context)
        {
            Context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var results = await Context.Eventos.ToListAsync();
                return Ok(results);
            }
            catch (Exception e)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                "Erro ao recuperar os eventos");
            }
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var results = await Context.Eventos.FirstOrDefaultAsync(x => x.Id == id);
                return Ok(results);
            }
            catch (Exception e)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                "Erro ao recuperar registro do evento");
            }
        }

    }
}
