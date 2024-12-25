using HW1.BL;
using System.Data;
using System.Data.SqlClient;
using System.Text.Json;
using System.Text.Json.Nodes;

namespace HW1.DAL
{
    public class DBservice
    {
        public DBservice()
        {
        }
        public SqlConnection connect()
        {
            // read the connection string from the configuration file
            IConfigurationRoot configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json").Build();
            string cStr = configuration.GetConnectionString("myProjDB");
            SqlConnection con = new SqlConnection(cStr);
            con.Open();
            return con;
        }
        private SqlCommand CreateCommandWithStoredProcedureGeneral(String spName, SqlConnection con, Dictionary<string, object> paramDic)
        {

            SqlCommand cmd = new SqlCommand(); // create the command object

            cmd.Connection = con;              // assign the connection to the command object

            cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

            cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

            if (paramDic != null)
                foreach (KeyValuePair<string, object> param in paramDic)
                {
                    cmd.Parameters.AddWithValue(param.Key, param.Value);

                }


            return cmd;
        }
        public bool InsertCast(Cast c)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect(); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>();
            paramDic.Add("@id", c.Id);
            paramDic.Add("@name", c.Name);
            paramDic.Add("@role", c.Role);
            paramDic.Add("@dateOfBirth", c.DateOfBirth);
            paramDic.Add("@country", c.Country);
            paramDic.Add("@photoUrl", c.PhotoUrl);

            cmd = CreateCommandWithStoredProcedureGeneral("SP_InsertCast", con, paramDic); // create the command

            try
            {
                int numEff = cmd.ExecuteNonQuery();
                return Convert.ToBoolean(numEff);
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }

        public AppUser InsertUser(AppUser u)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect(); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>();
            paramDic.Add("@userName", u.UserName);
            paramDic.Add("@Email", u.Email);
            paramDic.Add("@password", u.Password);

            cmd = CreateCommandWithStoredProcedureGeneral("SP_InsertUser", con, paramDic); // create the command

            try
            {
                int numEff = cmd.ExecuteNonQuery();
                if (numEff == 1)
                {
                    string[] details = new string[] { u.UserName, u.Password };
                    return LogInByName(details);
                }
                else
                    return null;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }

        public bool InsertMovie(Movie m)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect(); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>();
            paramDic.Add("@title", m.Title);
            paramDic.Add("@rating", m.Rating);
            paramDic.Add("@income", m.Income);
            paramDic.Add("@releaseYear", m.ReleaseYear);
            paramDic.Add("@duration", m.Duration);
            paramDic.Add("@language", m.Language);
            paramDic.Add("@description", m.Description);
            paramDic.Add("@genre", m.Genre);
            paramDic.Add("@photoUrl", m.PhotoUrl);

            cmd = CreateCommandWithStoredProcedureGeneral("SP_InsertMovie", con, paramDic); // create the command

            try
            {
                int numEff = cmd.ExecuteNonQuery();
                return Convert.ToBoolean(numEff);
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }

        public bool AddMovieToWish(int[] id)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect(); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>();
            paramDic.Add("@userId", id[0]);
            paramDic.Add("@movieId", id[1]);

            cmd = CreateCommandWithStoredProcedureGeneral("SP_AddMovieToWishList", con, paramDic); // create the command

            try
            {
                int numEff = cmd.ExecuteNonQuery();
                return Convert.ToBoolean(numEff);
            }
            catch (Exception ex)
            {
                // write to log
                return false;
            }

            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }
        public bool RemoveFromWishlist(JsonElement id)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect(); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>();
            paramDic.Add("@userId", id.GetProperty("user").GetInt32());
            paramDic.Add("@movieId", id.GetProperty("movie").GetInt32());

            cmd = CreateCommandWithStoredProcedureGeneral("SP_RemoveFromWish", con, paramDic); // create the command

            try
            {
                int numEff = cmd.ExecuteNonQuery();
                return Convert.ToBoolean(numEff);
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }
        public bool PostCastToMovie(string c, int m)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect(); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>();
            paramDic.Add("@castId", c);
            paramDic.Add("@movieId", m);

            cmd = CreateCommandWithStoredProcedureGeneral("SP_AddCastToMovie", con, paramDic); // create the command

            try
            {
                int numEff = cmd.ExecuteNonQuery();
                return Convert.ToBoolean(numEff);
            }
            catch (Exception ex)
            {
                // write to log
                return false;
            }

            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }
        public AppUser LogInByName(string[] u)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect(); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>();
            paramDic.Add("@userName", u[0]);
            paramDic.Add("@password", u[1]);

            cmd = CreateCommandWithStoredProcedureGeneral("SP_LogInUserByName", con, paramDic); // create the command

            try
            {
                SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

                AppUser user=new AppUser();

                while (dataReader.Read())
                {
                    user.Id = Convert.ToInt32(dataReader["id"]);
                    user.UserName = dataReader["userName"].ToString();
                    user.Email = dataReader["Email"].ToString();
                    user.Password = dataReader["password"].ToString();
                }
                return user;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }

        public List<Cast> ReadCast()
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect(); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            cmd = CreateCommandWithStoredProcedureGeneral("SP_GetCast_M", con, null); // create the command

            try
            {

                SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

                List<Cast> castList = new List<Cast>();

                while (dataReader.Read())
                {
                    Cast c = new Cast();
                    c.Id = dataReader["id"].ToString();
                    c.Name = dataReader["name"].ToString();
                    c.Role = dataReader["role"].ToString();
                    c.DateOfBirth = Convert.ToDateTime(dataReader["dateOfBirth"]);
                    c.Country = dataReader["country"].ToString();
                    c.PhotoUrl = dataReader["photoUrl"].ToString();
                    castList.Add(c);
                }
                return castList;

            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }

        public List<Movie> ReadMovies()
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect(); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            cmd = CreateCommandWithStoredProcedureGeneral("SP_GetMovies_M", con, null); // create the command

            try
            {

                SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

                List<Movie> movieList = new List<Movie>();

                while (dataReader.Read())
                {
                    Movie m = new Movie();
                    m.Id = Convert.ToInt32(dataReader["id"]);
                    m.Title = dataReader["title"].ToString();
                    m.Rating = Convert.ToDouble(dataReader["rating"]);
                    m.Income = Convert.ToInt32(dataReader["income"]);
                    m.ReleaseYear = Convert.ToInt32(dataReader["releaseYear"]);
                    m.Duration = Convert.ToInt32(dataReader["duration"]);
                    m.Language = dataReader["language"].ToString();
                    m.Description = dataReader["description"].ToString();
                    m.Genre = dataReader["genre"].ToString();
                    m.PhotoUrl = dataReader["photoUrl"].ToString();
                    movieList.Add(m);
                }
                return movieList;

            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }

        public List<int> ReadWishList(int id)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect(); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>();
            paramDic.Add("@userId", id);

            cmd = CreateCommandWithStoredProcedureGeneral("SP_GetUserWishList", con, paramDic); // create the command

            try
            {
                SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

                List<int> movieList = new List<int>();

                while (dataReader.Read())
                {
                    movieList.Add(Convert.ToInt32(dataReader["movieId"]));
                }
                return movieList;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }

        public List<object> GetCastOfMovie(int id)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect(); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>();
            paramDic.Add("@movieId", id);

            cmd = CreateCommandWithStoredProcedureGeneral("SP_GetCastOfMovie", con, paramDic); // create the command

            try
            {
                SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

                List<object> castList = new List<object>();

                while (dataReader.Read())
                {
                    castList.Add(new
                    {
                        castName = dataReader["name"].ToString(),
                        role = dataReader["role"].ToString(),
                        photoUrl = dataReader["photoUrl"].ToString()
                    });
                }
                return castList;
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }

        public List<int> ReadMoviesByRating(double r, int id)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect(); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>();
            paramDic.Add("@rating", r);
            paramDic.Add("@userId", id);

            cmd = CreateCommandWithStoredProcedureGeneral("SP_SelectMovieByRating", con, paramDic); // create the command

            try
            {

                SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

                List<int> movieList = new List<int>();

                while (dataReader.Read())
                {
                    movieList.Add(Convert.ToInt32(dataReader["movieId"]));
                }
                return movieList;

            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }

        public List<int> ReadMoviesByDuration(int d, int id)
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect(); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            Dictionary<string, object> paramDic = new Dictionary<string, object>();
            paramDic.Add("@duration", d);
            paramDic.Add("@userId", id);

            cmd = CreateCommandWithStoredProcedureGeneral("SP_SelectMovieByDuration", con, paramDic); // create the command

            try
            {

                SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

                List<int> movieList = new List<int>();

                while (dataReader.Read())
                {
                    movieList.Add(Convert.ToInt32(dataReader["movieId"]));
                }
                return movieList;

            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }

        public List<AppUser> ReadUsers()
        {
            SqlConnection con;
            SqlCommand cmd;

            try
            {
                con = connect(); // create the connection
            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            cmd = CreateCommandWithStoredProcedureGeneral("SP_GetUsers_M", con, null); // create the command

            try
            {

                SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

                List<AppUser> userList = new List<AppUser>();

                while (dataReader.Read())
                {
                    AppUser u = new AppUser();
                    u.Id = Convert.ToInt32(dataReader["id"]);
                    u.UserName = dataReader["userName"].ToString();
                    u.Email = dataReader["Email"].ToString();
                    u.Password = dataReader["password"].ToString();
                    userList.Add(u);
                }
                return userList;

            }
            catch (Exception ex)
            {
                // write to log
                throw (ex);
            }

            finally
            {
                if (con != null)
                {
                    // close the db connection
                    con.Close();
                }
            }
        }
    }
}
