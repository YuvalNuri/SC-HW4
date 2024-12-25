using HW1.BL;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HW1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        // GET: api/<MoviesController>
        [HttpGet]
        public IEnumerable<Movie> Get()
        {
            return Movie.ReadMovies();
        }

        // GET api/<MoviesController>/5
        [HttpGet("GetWishList")]
        public IActionResult GetUserWishList(int id)
        {
            List<int> wishList = Movie.ReadWishList(id);
            if (wishList.Count == 0)
                return NotFound("error no movies found in the wishlist");
            else
                return Ok(wishList);
        }

        // GET api/<MoviesController>/5
        [HttpGet("rating/{rating}/user/{u}")]
        public IActionResult GetByRating(double rating, int u)
        {
            List<int> rateList = Movie.ReadByRating(rating, u);
            if (rateList.Count == 0)
                return NotFound("error no movies found in this criteria");
            else
                return Ok(rateList);
        }

        // GET api/<MoviesController>/5
        [HttpGet("GetByDuration")]
        public IActionResult GetByDuration( int duration, int u)
        {
            List<int> durList = Movie.ReadByDuration(duration, u);
            if (durList.Count == 0)
                return NotFound("error no movies found in this criteria");
            else
                return Ok(durList);
        }

        // POST api/<MoviesController>
        [HttpPost]
        public IActionResult Post([FromBody] Movie m)
        {
            if (m.InsertMovie())
                return Ok(m);
            else
                return BadRequest("not inserted");
        }

        // POST api/<MoviesController>
        [HttpPost("AddToWishList")]
        public IActionResult PostToWish([FromBody] int[] id)
        {
            if (Movie.AddToWishList(id))
                return Ok(true);
            else
                return BadRequest("Not added to wishlist");
        }

        // DELETE api/MoviesController>/5
        [HttpDelete("RemoveFromWish")]
        public IActionResult Delete([FromBody] JsonElement id)
        {
            if (Movie.RemoveFromWishlist(id))
                return Ok(true);
            else
                return BadRequest("Not Deleted from Wishlist");
        }
    }
}
