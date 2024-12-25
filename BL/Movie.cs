using HW1.DAL;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace HW1.BL
{
    public class Movie
    {
        int id;
        string title;
        double rating;
        int income;
        int releaseYear;
        int duration;
        string language;
        string description;
        string genre;
        string photoUrl;

        public int Id { get => id; set => id = value; }
        public string Title { get => title; set => title = value; }
        public double Rating { get => rating; set => rating = value; }
        public int Income { get => income; set => income = value; }
        public int ReleaseYear { get => releaseYear; set => releaseYear = value; }
        public int Duration { get => duration; set => duration = value; }
        public string Language { get => language; set => language = value; }
        public string Description { get => description; set => description = value; }
        public string Genre { get => genre; set => genre = value; }
        public string PhotoUrl { get => photoUrl; set => photoUrl = value; }


        public bool InsertMovie()
        {
            try
            {
                return new DBservice().InsertMovie(this);
            }
            catch (Exception)
            {
                return false;
            }
        }

        public static bool AddToWishList(int[] id)
        {
                return new DBservice().AddMovieToWish(id);
        }

        public static bool RemoveFromWishlist(JsonElement id)
        {
            if (id.TryGetProperty("user", out _) && id.TryGetProperty("movie", out _))
                return new DBservice().RemoveFromWishlist(id);
            else
                return false;
        }

        public static List<int> ReadWishList(int id)
        {
            return new DBservice().ReadWishList(id);
        }

        public static List<Movie> ReadMovies()
        {
            return new DBservice().ReadMovies();
        }

        public static List<int> ReadByRating(double r, int id)
        {
            return new DBservice().ReadMoviesByRating(r, id);
        }

        public static List<int> ReadByDuration(int d, int id)
        {
            return new DBservice().ReadMoviesByDuration(d, id);
        }
    }
}
