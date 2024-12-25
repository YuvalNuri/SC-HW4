using HW1.DAL;
using System.Text.Json;

namespace HW1.BL
{
    public class AppUser
    {
        int id;
        string userName;
        string email;
        string password;

        public int Id { get => id; set => id = value; }
        public string UserName { get => userName; set => userName = value; }
        public string Email { get => email; set => email = value; }
        public string Password { get => password; set => password = value; }

        public AppUser InsertUser()
        {
            return new DBservice().InsertUser(this);
        }

        public static List<AppUser> ReadUsers()
        {
            return new DBservice().ReadUsers();
        }

        public static AppUser LogInByName(string[] userDetails)
        {
                return new DBservice().LogInByName(userDetails);
        }
    }
}
