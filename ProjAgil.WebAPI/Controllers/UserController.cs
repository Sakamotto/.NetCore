using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using ProAgil.Domain.Identity;
using ProjAgil.WebAPI.Dtos;

namespace ProjAgil.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IConfiguration Configuration;
        private readonly UserManager<User> UserManager;
        private readonly SignInManager<User> SignInManager;
        private readonly IMapper Mapper;

        public UserController(IConfiguration configuration, UserManager<User> userManager,
                                SignInManager<User> signInManager, IMapper mapper)
        {
            this.Configuration = configuration;
            this.UserManager = userManager;
            this.SignInManager = signInManager;
            this.Mapper = mapper;
        }


        [HttpGet("GetUser")]
        public async Task<IActionResult> GetUser(UserDto userDto)
        {
            return Ok(userDto);
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login(UserLoginDto userLogin)
        {

            try
            {
                var user = await UserManager.FindByNameAsync(userLogin.UserName);
                var resultado = await SignInManager.CheckPasswordSignInAsync(user, userLogin.Password, false);

                if (resultado.Succeeded)
                {
                    var appUser = await UserManager.Users
                        .FirstOrDefaultAsync(u => u.NormalizedUserName == userLogin.UserName.ToUpper());

                    var userToReturn = Mapper.Map<UserLoginDto>(appUser);

                    return Ok(new
                    {
                        token = GenerateJWToken(appUser).Result,
                        user = userToReturn
                    });
                }

                return Unauthorized();
            }
            catch (Exception e)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao registrar logar: {e.Message}");
            }
        }

        private async Task<string> GenerateJWToken(User user)
        {
            return "";
        }

        [HttpPost("Register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(UserDto userDto)
        {
            try
            {
                var user = Mapper.Map<User>(userDto);
                var resultado = await UserManager.CreateAsync(user, userDto.Password);

                if (resultado.Succeeded)
                {
                    return Created("GetUser", Mapper.Map<UserDto>(user));
                }

                return BadRequest(resultado.Errors);
            }
            catch (Exception e)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError,
                    $"Erro ao registrar usuário: {e.Message}");
            }
        }

    }
}