using HW1.DAL;
using Microsoft.AspNetCore.Http;

namespace HW1.BL
{
    public class Cast
    {
        string id;
        string name;
        string role;
        DateTime dateOfBirth; //format yyyy-mm-dd
        string country;
        string photoUrl;

        public Cast()
        {
        }

        public string Id { get => id; set => id = value; }
        public string Name { get => name; set => name = value; }
        public string Role { get => role; set => role = value; }
        public DateTime DateOfBirth { get => dateOfBirth; set => dateOfBirth = value; }
        public string Country { get => country; set => country = value; }
        public string PhotoUrl { get => photoUrl; set => photoUrl = value; }

        public bool InsertCast()
        {
            try
            {
                return new DBservice().InsertCast(this);
            }
            catch (Exception)
            {
                return false;
            }
        }

        public static List<Cast> ReadCasts()
        {
            return new DBservice().ReadCast();
        }

        public static bool PostToMovie(string c, int m)
        {
            return new DBservice().PostCastToMovie(c,m);
        }

        public static List<object> GetCastOfMovie(int id)
        {
            return new DBservice().GetCastOfMovie(id);
        }
    }
}
