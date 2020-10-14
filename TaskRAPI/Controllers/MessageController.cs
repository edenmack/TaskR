using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace taskRAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MessageController : ControllerBase
    {
        #region logger
        private readonly ILogger<MessageController> _logger;

        public MessageController(ILogger<MessageController> logger)
        {
            _logger = logger;
        }
        #endregion logger

        #region HTTP Verbs

        ///GET returns active message list for specified user
        ///http://[baseurl]/Message/[user login name]
        ///TODO: security
        [HttpGet("{id}")]
        public ActionResult<string> Get(string id)
        {
            Response.ContentType = "application/json";
            Response.StatusCode = 200;

            var jsonResult=Database.Query("sptGetMessages",id,Database.getRequestor(),"");

            return Content(jsonResult,"application/json");            
        }
        
        ///PATCH updates message with response
        ///http://[baseurl]/Message/[messageID]
        ///BODY JSON-> {"response":"YES","comment":"This is a comment!"}
        ///TODO: security
        [HttpPatch("{id}")]
        public ActionResult<string> Patch(string id, [FromBody] object content)
        {        
            var jsonRequest = content.ToString();
            var statusCode = Database.Query("sptSetResponse",id,Database.getRequestor(),jsonRequest);

            Response.ContentType = "application/json";
            Response.StatusCode = int.Parse(statusCode);

            return Content("","application/json");
        }
        #endregion HTTP Verbs
    }
}
