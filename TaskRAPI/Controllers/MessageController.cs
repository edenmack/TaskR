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
            string apiKey = Request.Headers.TryGetValue("X-API-Key", out var values) ? values[0] : "";


            //System.Console.WriteLine($"getting messages for {id}");
            //System.Console.WriteLine($"request from {apiKey}");

            Response.ContentType = "application/json";
            Response.StatusCode = 200;

            var jsonResult=Database.Query("sptGetMessages",id,apiKey,"");

            return Content(jsonResult,"application/json");            
        }
        
        ///PATCH updates message with response
        ///http://[baseurl]/Message/[messageID]
        ///BODY JSON-> {"response":"YES","comment":"This is a comment!"}
        ///TODO: security
        [HttpPatch("{id}")]
        public ActionResult<string> Patch(string id, [FromBody] object content)
        {        
            string apiKey = Request.Headers.TryGetValue("X-API-Key", out var values) ? values[0] : "";

            var jsonRequest = content.ToString();
            var statusCode = Database.Query("sptSetResponse",id,apiKey,jsonRequest);

            Response.ContentType = "application/json";
            Response.StatusCode = int.Parse(statusCode);

            return Content("","application/json");
        }
        #endregion HTTP Verbs
    }
}
