using HW1.BL;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HW1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        // GET: api/<UsersController>
        [HttpGet]
        public IEnumerable<AppUser> Get()
        {
            return AppUser.ReadUsers();
        }

        // POST api/<UsersController>
        [HttpPost]
        public IActionResult Post([FromBody] AppUser value)
        {
            AppUser au = value.InsertUser();
            if (au != null)
                return Ok(au);
            else
                return BadRequest("Register Failed");
        }

        // POST api/<UsersController>
        [HttpPost("LogInName")]
        public IActionResult PostLoginName([FromBody] string[] value)
        {
            AppUser au = AppUser.LogInByName(value);
            if (au != null)
                return Ok(au);
            else
                return BadRequest("Failed To Log In");
        }
    }
}
