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
            var userName=Database.getRequestor();
            var jsonResult = Database.Query("sptGetCurrentSettings",userName,userName,"");
            Response.ContentType = "application/json";
            Response.StatusCode = 200;
            return Content(jsonResult,"application/json");
        }

        [HttpGet]
        public ActionResult<string> GetAll()
        {
            var jsonResult = Database.Query("sptGetAllUsers","",Database.getRequestor(),"");
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
            Response.ContentType = "application/json";
            Response.StatusCode = 200;

            var jsonResult=Database.Query("sptGetCurrentSettings",id,Database.getRequestor(),"");

            return Content(jsonResult,"application/json");            
        }
        
        ///PATCH updates user data
        ///http://[baseurl]/User/[user login name]
        ///BODY JSON-> {"showDev":false,"showTest":true}
        ///TODO: security
        [HttpPatch("{id}")]
        public ActionResult<string> Patch(string id, [FromBody] object content)
        {        
            var jsonRequest = content.ToString();
            var jsonResult = Database.Query("sptUpdateSettings",id,Database.getRequestor(),jsonRequest);

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
            var jsonRequest = content.ToString();

            Response.ContentType = "application/json";
            Response.StatusCode = 202;

            var UserId = Database.Query("sptCreateUser","",Database.getRequestor(),jsonRequest);

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
