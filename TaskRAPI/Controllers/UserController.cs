using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace taskRAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        #region logger
        private readonly ILogger<UserController> _logger;

        public UserController(ILogger<UserController> logger)
        {
            _logger = logger;
        }
        #endregion logger

        #region HTTP Verbs

        

        [HttpGet("WhoAmI")]
        public ActionResult<string> GetMe()
        {                        
            string apiKey = Request.Headers.TryGetValue("X-API-Key", out var values) ? values[0] : "";

            var jsonResult = Database.Query("sptGetCurrentSettings","",apiKey,"");
            Response.ContentType = "application/json";
            Response.StatusCode = 200;
            return Content(jsonResult,"application/json");
        }

        [HttpGet]
        public ActionResult<string> GetAll()
        {
            string apiKey = Request.Headers.TryGetValue("X-API-Key", out var values) ? values[0] : "";            

            var jsonResult = Database.Query("sptGetAllUsers","",apiKey,"");
            Response.ContentType = "application/json";
            Response.StatusCode = 200;
            return Content(jsonResult,"application/json");
        }

        ///GET returns user data
        ///http://[baseurl]/User/[user login name]
        ///TODO: security
        [HttpGet("{id}")]
        public ActionResult<string> Get(string id)
        {
            string apiKey = Request.Headers.TryGetValue("X-API-Key", out var values) ? values[0] : "";

            Response.ContentType = "application/json";
            Response.StatusCode = 200;

            var jsonResult=Database.Query("sptGetCurrentSettings",id,apiKey,"");

            return Content(jsonResult,"application/json");            
        }
        
        ///PATCH updates user data
        ///http://[baseurl]/User/[user login name]
        ///BODY JSON-> {"showDev":false,"showTest":true}
        ///TODO: security
        [HttpPatch("{id}")]
        public ActionResult<string> Patch(string id, [FromBody] object content)
        {        
            string apiKey = Request.Headers.TryGetValue("X-API-Key", out var values) ? values[0] : "";

            var jsonRequest = content.ToString();
            var jsonResult = Database.Query("sptUpdateSettings",id,apiKey,jsonRequest);

            Response.ContentType = "application/json";
            Response.StatusCode = 202;

            return Content(jsonResult,"application/json");
        }

        ///PUT create user
        ///http://[baseurl]/User
        ///BODY JSON-> {"showDev":true}
        ///TODO: security
        [HttpPost]
        public ActionResult<string> Post([FromBody] object content)
        {
            string apiKey = Request.Headers.TryGetValue("X-API-Key", out var values) ? values[0] : "";

            var jsonRequest = content.ToString();

            Response.ContentType = "application/json";
            Response.StatusCode = 202;

            var UserId = Database.Query("sptCreateUser","",apiKey,jsonRequest);

            Response.ContentType = "application/json";
            if(string.IsNullOrEmpty(UserId))
            {
                Response.StatusCode = 403;
            }else{
                Response.StatusCode = 202;
            }
            
            return Content(UserId,"application/json");
        }
        #endregion HTTP Verbs
    }
}
