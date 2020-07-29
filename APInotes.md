# Process API
>The requesting application can use these API calls to 
>send messages, check to see if there are results and 
>read those results.

- Create a message 
```SQL
EXEC dbo.sptCreateMessage
	@loginNames,            --varchar(max) comma separated list of loginNames
	@subj,                  --varchar(1000) the subject... defualt='test message'
	@body,                  --varchar(max) the body (html formatted) default='this is a test message, please ignore'
	@responseOptions,       --varchar(max) comma separated list of response buttons default='Acknowledge,Dismiss'
	@expires,               --datetime date that unresponded messages will dissapear default=null
	@color,                 --varchar(50) currently does nothing, but could be used for formatting in the client app default='black',
	@environment,           --varchar(50) the environment.  Typically 'dev', 'test' or 'prod' default='prod'
	@requiredResponseRatio  --real number between 0 and 1 indicates the percentage of people that must 
                            --respond for instance 1=100%, if left null only 1 person is required to respond default=null

--returns int that can be used to check on status of message
```
- Check status
```SQL
EXEC dbo.sptCheckStatus @id
--returns status, majority response, total responses
```

- Retreive all responses
```SQL
EXEC dbo.sptGetResponses @id
--returns list of responses
```

---
---
---

# Client API
>The client application (moblie app) can use these API
>calls to retrieve messages, and respond to them.

- Get Messages
```SQL
EXEC dbo.sptGetMessages
	@loginName              --varchar(50) AD Login Name
--returns list of pending messages for selected user
```

- Set Response
```SQL
EXEC dbo.sptSetResponse
	@messageId,             --int
	@response,              --varchar(255)
	@comment                --varchar(max)
```

- Get current subscriptions
```SQL
EXEC dbo.sptGetCurrentSettings
    @loginName              --varchar(50) AD Login Name
--returns showDev, showTest
```

- Set subscription options
```SQL
EXEC dbo.sptSubscribeDev
	@loginName,              --varchar(50) AD Login Name
	@subscribe               --bit (1 for subscribe, 0 for unsubscibe)
EXEC dbo.sptSubscribeTest
	@loginName,              --varchar(50) AD Login Name
	@subscribe               --bit (1 for subscribe, 0 for unsubscibe)
```