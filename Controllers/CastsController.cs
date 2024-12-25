using HW1.BL;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HW1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CastsController : ControllerBase
    {
        // GET: api/<CastsController>
        [HttpGet]
        public IEnumerable<Cast> Get()
        {
            return Cast.ReadCasts();
        }

        // POST api/<CastsController>
        [HttpPost]
        public IActionResult Post([FromBody] Cast c)
        {
            if (c.InsertCast())
                return Ok(c);
            else
                return BadRequest("Failed to add cast");
        }

        // POST api/<CastsController>
        [HttpPost("AddCastToMovie")]
        public IActionResult PostToMovie([FromBody] JsonElement data)
        {
            // קבלת הערכים מתוך JsonElement
            string castId = data.GetProperty("castId").GetString();
            int movieId = data.GetProperty("movieId").GetInt32();
            if (Cast.PostToMovie(castId,movieId))
                return Ok(true);
            else
                return BadRequest("Not added to Movie, Check if the cast is already in the movie");
        }

        // GET: api/<CastsController>
        [HttpGet("GetCastOfMovie")]
        public IActionResult GetCastOfMovie(int id)
        {
            List<object> castList = Cast.GetCastOfMovie(id);
            if (castList.Count == 0)
                return NotFound("error no movies found in your wishlist");
            else
                return Ok(castList);
        }
    }
}
