using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace taskRAPI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MessageSetController : ControllerBase
    {
        #region logger
        private readonly ILogger<MessageSetController> _logger;

        public MessageSetController(ILogger<MessageSetController> logger)
        {
            _logger = logger;
        }
        #endregion logger

        #region HTTP Verbs

        ///GET returns status for designated message set 
        ///http://[base url]/MessageSet/[MessageSetID]/Status
        ///TODO: security
        [HttpGet("{id}")]
        [HttpGet("{id}/Status")]
        public ActionResult<string> Get(string id)
        {
            string apiKey = Request.Headers.TryGetValue("X-API-Key", out var values) ? values[0] : "";

            Response.ContentType = "application/json";
            Response.StatusCode = 200;

            var jsonResult=Database.Query("sptCheckStatus",id,apiKey,"");
            
            return Content(jsonResult,"application/json");            
        }

        ///GET returns status for designated message set 
        ///http://[base url]/MessageSet/[MessageSetID]/Responses
        ///TODO: security
        [HttpGet("{id}/Response")]
        public ActionResult<string> GetResponse(string id)
        {
            string apiKey = Request.Headers.TryGetValue("X-API-Key", out var values) ? values[0] : "";

            Response.ContentType = "application/json";
            Response.StatusCode = 200;

            var jsonResult=Database.Query("sptGetResponses",id,apiKey,"");
            
            return Content(jsonResult,"application/json");            
        }

        ///POST returns MessageSetID
        ///http://[base url]/MessageSet
        ///BODY JSON->{"loginNames":["mackej","richarj","bheemisl"],"subj":"test","body":"this is a test message","responseOptions":["one","two"],"expires":"2020-oct-31","color":"black","icon":"flag","environment":"prod","requiredResponseRatio":null}
        ///TODO: security
        [HttpPost]
        public ActionResult<string> Post([FromBody] object content)
        {        
            string apiKey = Request.Headers.TryGetValue("X-API-Key", out var values) ? values[0] : "";

            var jsonRequest = content.ToString();
            var MessageSetId = Database.Query("sptCreateMessageSet","",apiKey,jsonRequest);

            Response.ContentType = "application/json";
            if(string.IsNullOrEmpty(MessageSetId))
            {
                Response.StatusCode = 403;
            }else{
                Response.StatusCode = 202;
            }
            

            return Content(MessageSetId,"application/json");
        }
        #endregion HTTP Verbs
    }
}
