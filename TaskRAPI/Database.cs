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

        public static void GetKey(string id){

            //Get Key from default database
            var key = "";
            using(var conn = new SqlConnection(getConfig("ConnectionStrings","default"))){
                conn.Open();
                using(var cmd = new SqlCommand(getConfig("SqlPatterns","key"), conn)){
                    cmd.Parameters.AddWithValue("@id",id);
                    key = cmd.ExecuteScalar().ToString();
                }
            }
            if(string.IsNullOrEmpty(key))return;//discontinue execution if user apiKey is not found in database


            //Get eMail from user source database
            var email = "";
            using(var conn = new SqlConnection(getConfig("ConnectionStrings","sourceDatabaseForEmail"))){
                conn.Open();
                using(var cmd = new SqlCommand(getConfig("SqlPatterns","email"), conn)){
                    cmd.Parameters.AddWithValue("@id",id);
                    email = cmd.ExecuteScalar().ToString();
                }
            }
            if(string.IsNullOrEmpty(email))return;//discontinue execution if user email is not found in database


            //Send Key
            var client = new System.Net.Mail.SmtpClient(getConfig("MailConfiguration","smtpServer"));
            client.UseDefaultCredentials = false;
            client.Credentials = new System.Net.NetworkCredential(getConfig("MailConfiguration","user"), getConfig("MailConfiguration","password"));

            var mailMessage = new System.Net.Mail.MailMessage();
            mailMessage.From = new System.Net.Mail.MailAddress(getConfig("MailConfiguration","fromAddress"));
            mailMessage.To.Add(email);
            mailMessage.Subject = getConfig("MailConfiguration","subject");            
            mailMessage.Body = string.Format(getConfig("MailConfiguration","bodyTemplate"),key);
            client.Send(mailMessage);

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
