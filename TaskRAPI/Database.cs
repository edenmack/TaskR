using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;


namespace taskRAPI
{
    
    public class Database
    {
        private static string getConfig(string section, string key){
            string v = new ConfigurationBuilder()
                .SetBasePath(System.IO.Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .Build()
                .GetSection(section)[key];
            
            return v;
        }

        public static string Query(string query, string id, string requestor, string param){
            var connStr = getConfig("ConnectionStrings","default");
            
            System.Console.WriteLine($"EXEC {query} '{requestor}','{id}','{param}'");

            var sql = $"EXEC {query} @requestor, @id, @param";                      
            var jsonResult = new System.Text.StringBuilder();  

            using(var conn = new SqlConnection(connStr)){                
                conn.Open();
                using(var cmd = new SqlCommand(sql, conn)){
                    cmd.Parameters.AddWithValue("@id",id);
                    cmd.Parameters.AddWithValue("@requestor",requestor);
                    cmd.Parameters.AddWithValue("@param",param);
                    var reader = cmd.ExecuteReader();
                    if (!reader.HasRows)
                    {
                        jsonResult.Append("[]");
                    }
                    else
                    {
                        while (reader.Read())
                        {
                            jsonResult.Append(reader.GetValue(0).ToString());
                        }
                    }
                }
            }

            return jsonResult.ToString();
        }
    }
}
