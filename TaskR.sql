--DUSESQLCUST01
USE TaskR

DROP TABLE IF EXISTS tUser;
CREATE TABLE dbo.tUser (
	userId int IDENTITY(1,1) PRIMARY KEY,
	loginName varchar(255),
	displayName varchar(255),
	showDev bit,
	showTest bit,
	administrator bit,
	scribe bit,
	apiKey varchar(100),
	updated datetime
);

DROP TABLE IF EXISTS tMessageSet;
CREATE TABLE dbo.tMessageSet (
	messageSetId int IDENTITY(1,1) PRIMARY KEY,
	subj varchar(1000),
	body varchar(max),
	responseOptions varchar(max),
	expires datetime,
	requiredResponseRatio real,
	totalResponses int,
	majorityResponse varchar(255),
	responseRatioSatisfied bit,
	color varchar(50),
	icon varchar(50),
	environment varchar(50),
	createdBy int,
	updated datetime
);


DROP TABLE IF EXISTS tMessage;
CREATE TABLE dbo.tMessage (
	messageId int IDENTITY(1,1) PRIMARY KEY,
	userId int,-- FOREIGN KEY REFERENCES dbo.tUser(userId),
	messageSetId int,-- FOREIGN KEY REFERENCES dbo.tMessageSet(messageSetId),
	response varchar(255),
	comment varchar(max),
	updated datetime
);

DROP FUNCTION IF EXISTS fntGetUserId;
GO
CREATE FUNCTION dbo.fntGetUserId(@loginName varchar(50)) RETURNS int
AS
BEGIN
	DECLARE @r int=null

	IF ISNUMERIC(@loginName)=1
	BEGIN
		SET @r = (SELECT TOP 1 userId FROM tUser WHERE userId=@loginName)
	END

	IF ISNUMERIC(@loginName)=0
	BEGIN
		SET @r = (SELECT TOP 1 userId FROM tUser WHERE loginName=@loginName)
	END

	RETURN @r
END
GO

DROP FUNCTION IF EXISTS fntGetRequestorId;
GO
CREATE FUNCTION dbo.fntGetRequestorId(@apiKey varchar(50)) RETURNS int
AS
BEGIN
	DECLARE @r int=null
	SET @r = (SELECT TOP 1 userId FROM tUser WHERE apiKey=@apiKey)
	RETURN @r
END
GO

DROP FUNCTION IF EXISTS fntIsAdmin;
GO
CREATE FUNCTION dbo.fntIsAdmin(@apiKey varchar(50)) RETURNS BIT
AS
BEGIN
	DECLARE @r bit=(SELECT TOP 1 administrator FROM tUser WHERE userId=dbo.fntGetRequestorId(@apiKey))
	RETURN @r
END
GO

DROP FUNCTION IF EXISTS fntIsScribe;
GO
CREATE FUNCTION dbo.fntIsScribe(@apiKey varchar(50)) RETURNS BIT
AS
BEGIN
	DECLARE @r bit=(SELECT TOP 1 scribe FROM tUser WHERE userId=dbo.fntGetRequestorId(@apiKey))
	RETURN @r
END
GO

DROP FUNCTION IF EXISTS fntIsOwner;
GO
CREATE FUNCTION dbo.fntIsOwner(@apiKey varchar(50), @messageSetId int) RETURNS BIT
AS
BEGIN
	DECLARE @owner int=(SELECT TOP 1 createdBy FROM tMessageSet WHERE messageSetId=@messageSetId)
	DECLARE @r BIT = (SELECT CASE WHEN @owner=dbo.fntGetRequestorId(@apiKey) THEN 1 ELSE 0 END)
	RETURN @r
END
GO

DROP FUNCTION IF EXISTS fntSameOrAdmin;
GO
CREATE FUNCTION dbo.fntSameOrAdmin(@loginName varchar(50), @apiKey varchar(50)) RETURNS BIT
AS
BEGIN
	DECLARE @admin bit = dbo.fntIsAdmin(@apiKey)
	IF @admin=1
	BEGIN
		RETURN 1
	END
	ELSE
	BEGIN
		IF dbo.fntGetUserId(@loginName) = dbo.fntGetRequestorId(@apiKey)
		BEGIN
			RETURN 1
		END
		ELSE
		BEGIN
			RETURN 0
		END
	END
	RETURN 0
END
GO

DROP PROCEDURE IF EXISTS sptCreateMessageSet;
GO
CREATE PROCEDURE dbo.sptCreateMessageSet
	@requestor varchar(50),
	@id varchar(50)='', --ignore
	@json varchar(max)
	AS
		--DECLARE @json varchar(max) = '{"loginNames":["mackej","richarj","bheemisl"],"subj":"test","body":"this is a test message","responseOptions":["one","two"],"expires":"2020-oct-31","color":"black","icon":"flag","environment":"prod","requiredResponseRatio":null}'
		DECLARE @requestorId int = dbo.fntIsScribe(@requestor)
		IF 1 = @requestorId
		BEGIN
			DECLARE @loginNames varchar(max) = ''
			DECLARE @responseOptions varchar(max) = ''
			DECLARE @subj varchar(1000) = COALESCE(JSON_VALUE(@json,'$.subj'),'New Message')
			DECLARE @body varchar(1000) = COALESCE(JSON_VALUE(@json,'$.body'),'')
			DECLARE @expires datetime = JSON_VALUE(@json,'$.expires')
			DECLARE @color varchar(1000) = COALESCE(JSON_VALUE(@json,'$.color'),'black')
			DECLARE @icon varchar(1000) = JSON_VALUE(@json,'$.icon')
			DECLARE @environment varchar(1000) = COALESCE(JSON_VALUE(@json,'$.environment'),'prod')
			DECLARE @requiredResponseRatio real = JSON_VALUE(@json,'$.requiredResponseRatio')

			DECLARE @count varchar(10)='0'
			DECLARE @delimiter varchar(1)=''
			WHILE JSON_VALUE(@json,'$.loginNames['+@count+']') IS NOT NULL
			BEGIN
				IF (SELECT COUNT(1) FROM tUser WHERE loginName=JSON_VALUE(@json,'$.loginNames['+@count+']'))>0
				BEGIN
					SET @loginNames = @loginNames + @delimiter + JSON_VALUE(@json,'$.loginNames['+@count+']')
				END
				SET @count = @count+1
				SET @delimiter = ','
			END

			SET @count = '0'
			SET @delimiter = ''
			WHILE JSON_VALUE(@json,'$.responseOptions['+@count+']') IS NOT NULL
			BEGIN
				SET @responseOptions = @responseOptions + @delimiter + '"' + JSON_VALUE(@json,'$.responseOptions['+@count+']') + '"'
				SET @count = @count+1
				SET @delimiter = ','
			END

			IF ISJSON(@json) = 1
			BEGIN
				DECLARE @ratio real = (SELECT CASE WHEN @requiredResponseRatio IS NOT NULL THEN @requiredResponseRatio ELSE 1.0/(SELECT COUNT(1) FROM STRING_SPLIT(@loginNames,','))END)

				INSERT INTO tMessageSet (subj,body,responseOptions,expires,requiredResponseRatio,totalResponses,majorityResponse,responseRatioSatisfied,color,icon,environment,createdBy,updated) VALUES (@subj,@body,@responseOptions,@expires,@ratio,0,null,0,@color,@icon,@environment,@requestorId,GETDATE())
				DECLARE @messageSetId int = SCOPE_IDENTITY()

				INSERT INTO tMessage (userId,messageSetId,updated)
				SELECT dbo.fntGetUserId(value) AS [userId], @messageSetId AS [messageSetId], GETDATE() AS [updated] 
				FROM STRING_SPLIT(@loginNames,',')

				SELECT @messageSetId
			END
		END
		ELSE
		BEGIN
			SELECT NULL
		END
	GO
/**************************/	

DROP PROCEDURE IF EXISTS sptGetMessages;
GO
CREATE PROCEDURE dbo.sptGetMessages
	@requestor varchar(50),
	@loginName varchar(50),
	@json varchar(max) =''--ignore
	AS
		IF 1=dbo.fntSameOrAdmin(@loginName,@requestor)
		BEGIN
			DECLARE @userId int = (SELECT dbo.fntGetUserId(@loginName))
			DECLARE @showDev bit = (SELECT showDev FROM tUser WHERE userId=@userId)
			DECLARE @showTest bit = (SELECT showTest FROM tUser WHERE userId=@userId)

			DECLARE @result varchar(max)=
			(SELECT 
				*
			FROM(
				SELECT 
					m.messageId AS [key],
					ms.subj AS [subj],
					ms.environment AS [environment],
					ms.color AS [color],
					ms.icon AS [icon],
					'['+ms.responseOptions+']' AS [responseOptions],
					ms.body AS [body]
				FROM 
					tMessage m
					INNER JOIN tMessageSet ms ON m.messageSetId=ms.messageSetId
				WHERE
					m.userId=@userId
					AND (ms.expires > GETDATE() OR ms.expires IS NULL)
					AND m.response IS NULL
					AND ms.responseRatioSatisfied = 0
					AND ( (LOWER(ms.environment)='dev' AND @showDev=1) OR (LOWER(ms.environment)='test' AND @showTest=1) OR (LOWER(ms.environment)='prod') )			
			)a 	
			FOR JSON PATH)

			set @result = replace(replace(replace(@result,'"[\"','["'),'\"]"','"]'),'\",\"','","')

			SELECT @result
		END
GO



DROP PROCEDURE IF EXISTS sptSetResponse;
GO
CREATE PROCEDURE dbo.sptSetResponse
	@requestor varchar(50),
	@messageId int,
	@json varchar(max)
	--@response varchar(255),
	--@comment varchar(max)
	AS
		IF ISJSON(@json) = 1 AND 1=dbo.fntSameOrAdmin((SELECT userId FROM tMessage WHERE messageId=@messageId),@requestor)
		BEGIN
			DECLARE @response varchar(255) = JSON_VALUE(@json,'$.response')
			DECLARE @comment varchar(max) = JSON_VALUE(@json,'$.comment')
			UPDATE tMessage SET response=@response, comment=@comment WHERE messageId=@messageId
			DECLARE @messageSetId int=(SELECT messageSetId FROM tMessage WHERE messageId=@messageId)
			DECLARE @totalResponses int = (SELECT COUNT(1) FROM tMessage WHERE messageSetId=@messageSetId AND response IS NOT NULL)
			DECLARE @total int = (SELECT COUNT(1) FROM tMessage WHERE messageSetId=@messageSetId)
			DECLARE @satisified bit = (SELECT CASE WHEN @totalResponses>=@total*requiredResponseRatio THEN 1 ELSE 0 END FROM tMessageSet WHERE messageSetId=@messageSetId)
			DECLARE @majorityCount1 int = (SELECT c FROM (SELECT response, COUNT(1) AS [c] FROM tMessage GROUP BY response ORDER BY c DESC OFFSET 0 ROW FETCH NEXT 1 ROW ONLY)a)
			DECLARE @majorityCount2 int = (SELECT c FROM (SELECT response, COUNT(1) AS [c] FROM tMessage GROUP BY response ORDER BY c DESC OFFSET 1 ROW FETCH NEXT 1 ROW ONLY)a)
			DECLARE @majorityResponse varchar(255)=null

			IF @majorityCount1>@majorityCount2 --FOUND MAJORITY RESPONSE
			BEGIN
				SET @majorityResponse = (SELECT response FROM (SELECT response, COUNT(1) AS [c] FROM tMessage WHERE response IS NOT NULL GROUP BY response ORDER BY c DESC OFFSET 0 ROW FETCH NEXT 1 ROW ONLY)a)
			END

			UPDATE tMessageSet SET totalResponses=@totalResponses, majorityResponse=@majorityResponse, responseRatioSatisfied=@satisified WHERE messageSetId=@messageSetId

			SELECT 204

		END
		ELSE
		BEGIN
			SELECT 400
		END

GO

DROP PROCEDURE IF EXISTS sptCheckStatus;
GO
CREATE PROCEDURE dbo.sptCheckStatus
	@requestor varchar(50),
	@messageSetId int,
	@param varchar(max)=''
	AS
		SELECT 
			CASE
				WHEN responseRatioSatisfied=1 THEN 'Complete'
				WHEN (expires IS NOT NULL AND expires<GETDATE()) THEN 'Expired' 
				ELSE 'Pending'
			END AS [Status],
			CASE
				WHEN majorityResponse IS NOT NULL THEN majorityResponse
				ELSE ''
			END AS [MajorityResponse],
			totalResponses				
		FROM tMessageSet 
		WHERE messageSetId=@messageSetId AND 1=dbo.fntSameOrAdmin(createdBy,@requestor)
		FOR JSON AUTO
GO

DROP PROCEDURE IF EXISTS sptGetResponses;
GO
CREATE PROCEDURE dbo.sptGetResponses
	@requestor varchar(50),
	@messageSetId int,
	@param varchar(max)=''
	AS
	SELECT * FROM(
		SELECT 
			u.loginName AS [loginName],
			u.displayName AS [displayName],
			m.response AS [response],
			m.comment AS [comment],
			m.updated AS [updated]
		FROM 
			tMessage m
			INNER JOIN tUser u ON m.userId=u.userId
			INNER JOIN tMessageSet s ON m.messageSetId=s.messageSetId
		WHERE 
			m.messageSetId=@messageSetId 
			AND response IS NOT NULL	
			AND 1=dbo.fntSameOrAdmin(s.createdBy,@requestor)
	)a FOR JSON AUTO
GO

DROP PROCEDURE IF EXISTS sptGetAllUsers;
GO
CREATE PROCEDURE dbo.sptGetAllUsers
	@requestor varchar(50),
	@loginName varchar(50)='',
	@json varchar(max)=''
	AS
		SELECT *
		FROM tUser 
		WHERE 1=dbo.fntIsAdmin(@requestor) 
		FOR JSON AUTO
GO

DROP PROCEDURE IF EXISTS sptGetCurrentSettings;
GO
CREATE PROCEDURE dbo.sptGetCurrentSettings
	@requestor varchar(50),
	@loginName varchar(50)='',
	@json varchar(max)=''
	AS
		IF @loginName = ''
		BEGIN
			SET @loginName = dbo.fntGetRequestorId(@requestor)
		END
		SELECT *
		FROM tUser 
		WHERE userId=dbo.fntGetUserId(@loginName) AND 1=dbo.fntSameOrAdmin(@loginName,@requestor) 
		FOR JSON AUTO
GO

DROP PROCEDURE IF EXISTS sptUpdateSettings;
GO
CREATE PROCEDURE dbo.sptUpdateSettings
	@requestor varchar(50),
	@loginName varchar(50),
	@json varchar(max) --'{"userId":1,"loginName":"mackej","displayName":"Eden","showDev":false,"showTest":true,"administrator":true,"scribe":true}'

	AS
		IF ISJSON(@json)=1 AND 1=dbo.fntSameOrAdmin(@loginName,@requestor)
		BEGIN
			DECLARE @userId int = dbo.fntGetUserId(@loginName)
			DECLARE @showDev int= COALESCE(CASE WHEN JSON_VALUE(@json,'$.showDev')='true' THEN 1 ELSE 0 END,(SELECT showDev FROM tUser WHERE userId=@userId))
			DECLARE @showTest int= COALESCE(CASE WHEN JSON_VALUE(@json,'$.showTest')='true' THEN 1 ELSE 0 END,(SELECT showTest FROM tUser WHERE userId=@userId))
			
			--ONLY UPDATE DEV AND TEST SETTINGS, DON'T CHANGE ANYTHING ELSE
			UPDATE tUser SET showDev=@showDev, showTest=@showTest, updated=GETDATE() WHERE userId=@userId
		
			--RETURN NEW SETTINGS
			SELECT *
			FROM tUser 
			WHERE userId=dbo.fntGetUserId(@loginName) AND 1=dbo.fntSameOrAdmin(@loginName,@requestor) 
			FOR JSON AUTO
		END
GO

DROP PROCEDURE IF EXISTS sptCreateUser;
GO
CREATE PROCEDURE dbo.sptCreateUser
	@requestor varchar(50),
	@loginName varchar(50)='',
	@json varchar(max) --'{"loginName":"mackej","displayName":"Eden","showDev":false,"showTest":true}'

	AS
		IF ISJSON(@json)=1
		BEGIN
			DECLARE @userName varchar(50)= JSON_VALUE(@json,'$.loginName')
			DECLARE @displayName varchar(50)= JSON_VALUE(@json,'$.displayName')
			DECLARE @showDev int= COALESCE(CASE WHEN JSON_VALUE(@json,'$.showDev')='true' THEN 1 ELSE 0 END,0)
			DECLARE @showTest int= COALESCE(CASE WHEN JSON_VALUE(@json,'$.showTest')='true' THEN 1 ELSE 0 END,0)			
			
			IF @userName IS NOT NULL AND @displayName IS NOT NULL AND 0=(SELECT COUNT(1) FROM tUser WHERE loginName=@userName)
			BEGIN
				DECLARE @apiKey varchar(100)
				EXEC sptNewApiKey @apiKey output
				INSERT INTO tUser (loginName,displayName,showDev,showTest,administrator,scribe,apiKey,updated)VALUES(@userName,@displayName,@showDev,@showTest,0,0,@apiKey,GETDATE())
				DECLARE @userId int = SCOPE_IDENTITY()
				SELECT @userId
			END
		END
GO

DROP PROCEDURE IF EXISTS sptNewApiKey;
GO
CREATE PROCEDURE dbo.sptNewApiKey
	@apiKey varchar(100) output,
	@length int = 6
	AS

	DECLARE @chars varchar (35)='ABCDEFGHJKLMNPQRTUVWXYZ2346789!@$*-'
	DECLARE @position int = 0
	DECLARE @rnd float = RAND()
	SET @apiKey = ''
	IF @length>100
	BEGIN
		SET @length=100
	END

	WHILE LEN(@apiKey)<@length
	BEGIN	
		SET @position = FLOOR(@rnd*(LEN(@chars)+1))
		SET @apiKey = @apiKey + SUBSTRING(@chars,@position,1)
		SET @rnd = @rnd*100 - FLOOR(@rnd*100)
		--print @apiKey
	END

	--SELECT @apiKey as [apiKey] 
	RETURN 
GO

/*
--TEST DATA
INSERT INTO tUser(loginName,displayName,showDev,showTest,administrator,scribe,apiKey,updated)VALUES
('sys','systemAccount',0,0,0,1,'000000',GETDATE())
GO
EXEC sptCreateUser '000000','','{"loginName":"mackej","displayName":"Eden","showDev":true,"showTest":true}'
EXEC sptCreateUser '000000','','{"loginName":"richarj","displayName":"Jim","showDev":true,"showTest":false}'
EXEC sptCreateUser '000000','','{"loginName":"bheemisl","displayName":"Sree","showDev":false,"showTest":true}'
EXEC sptCreateUser '000000','','{"loginName":"blashomt","displayName":"Martin","showDev":false,"showTest":false}'
GO
UPDATE tUser SET administrator=1, scribe=1, apiKey='111111' WHERE loginName='mackej'
GO
EXEC sptCreateMessageSet '000000','','{"loginNames":["mackej","richarj","bheemisl"],"subj":"test 1","body":"this is a test message","responseOptions":["one","two"],"createdBy":1}'
*/
