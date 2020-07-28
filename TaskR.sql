--DUSESQLCUST01
USE TaskR

DROP TABLE IF EXISTS tUser;
CREATE TABLE dbo.tUser (
	userId int IDENTITY(1,1) PRIMARY KEY,
	loginName varchar(255),
	displayName varchar(255),
	showDev bit,
	showTest bit,
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
	responseRationSatisfied bit,
	color varchar(50),
	environment varchar(50),
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
		SET @r = (SELECT userId FROM tUser WHERE userId=@loginName)
	END

	IF ISNUMERIC(@loginName)=0
	BEGIN
		SET @r = (SELECT userId FROM tUser WHERE loginName=@loginName)
	END

	RETURN @r
END
GO


DROP PROCEDURE IF EXISTS sptCreateMessage;
GO
CREATE PROCEDURE dbo.sptCreateMessage
	@loginNames varchar(max), --comma separated list of loginNames
	@subj varchar(1000)='test message',
	@body varchar(max)='this is a test message, please ignore',
	@responseOptions varchar(max)='Acknowledge,Dismiss',
	@expires datetime=null,
	@color varchar(50) = 'black',
	@environment varchar(50) = 'prod',
	@requiredResponseRatio real=null
	AS
		DECLARE @ratio real = (SELECT CASE WHEN @requiredResponseRatio IS NOT NULL THEN @requiredResponseRatio ELSE 1.0/(SELECT COUNT(1) FROM STRING_SPLIT(@loginNames,','))END)
		INSERT INTO tMessageSet (subj,body,responseOptions,expires,requiredResponseRatio,totalResponses,majorityResponse,responseRationSatisfied,color,environment,updated) VALUES (@subj,@body,@responseOptions,@expires,@ratio,0,null,0,@color,@environment,GETDATE())
		DECLARE @messageSetId int = SCOPE_IDENTITY()

		INSERT INTO tMessage (userId,messageSetId,updated)
		SELECT dbo.fntGetUserId(value) AS [userId], @messageSetId AS [messageSetId], GETDATE() AS [updated] 
		FROM STRING_SPLIT(@loginNames,',')

		SELECT @messageSetId
	GO
/**************************/	
DROP PROCEDURE IF EXISTS sptGetMessages;
GO
CREATE PROCEDURE dbo.sptGetMessages
	@loginName varchar(50)
	AS
		DECLARE @userId int = (SELECT dbo.fntGetUserId(@loginName))
		DECLARE @showDev bit = (SELECT showDev FROM tUser WHERE userId=@userId)
		DECLARE @showTest bit = (SELECT showTest FROM tUser WHERE userId=@userId)

		SELECT 
			m.*,
			ms.*
			--,c.*
		FROM 
			tMessage m
			INNER JOIN tMessageSet ms ON m.messageSetId=ms.messageSetId
			--LEFT OUTER JOIN (SELECT messageSetId, sum(case when response is null then 0 else 1 end) as [answered], COUNT(1) AS [total] FROM tMessage GROUP BY messageSetId)c ON c.messageSetId=m.messageSetId
		WHERE
			m.userId=@userId
			AND (ms.expires < GETDATE() OR ms.expires IS NULL)
			AND m.response IS NULL
			AND ms.responseRationSatisfied = 0
			AND ( (LOWER(ms.environment)='dev' AND @showDev=1) OR (LOWER(ms.environment)='test' AND @showTest=1) OR (LOWER(ms.environment)='prod') )
			--AND c.answered<c.total*ms.requiredResponseRatio
GO

DROP PROCEDURE IF EXISTS sptSetResponse;
GO
CREATE PROCEDURE dbo.sptSetResponse
	@messageId int,
	@response varchar(255),
	@comment varchar(max)
	AS
		IF @response IS NOT NULL
		BEGIN
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

			UPDATE tMessageSet SET totalResponses=@totalResponses, majorityResponse=@majorityResponse, responseRationSatisfied=@satisified WHERE messageSetId=@messageSetId

		END

GO

DROP PROCEDURE IF EXISTS sptCheckStatus;
GO
CREATE PROCEDURE dbo.sptCheckStatus
	@messageSetId int
	AS
		SELECT 
			CASE
				WHEN responseRationSatisfied=1 THEN 'Complete'
				WHEN (expires IS NOT NULL AND expires<GETDATE()) THEN 'Expired' 
				ELSE 'Pending'
			END AS [Status],
			CASE
				WHEN majorityResponse IS NOT NULL THEN majorityResponse
				ELSE ''
			END AS [MajorityResponse],
			totalResponses				
		FROM tMessageSet 
		WHERE messageSetId=@id
GO

DROP PROCEDURE IF EXISTS sptGetResponses;
GO
CREATE PROCEDURE dbo.sptGetResponses
	@messageSetId int
	AS
		SELECT *
		FROM tMessage 
		WHERE 
			messageSetId=@id 
			AND response IS NOT NULL
GO

DROP PROCEDURE IF EXISTS sptSubscribeDev;
GO
CREATE PROCEDURE dbo.sptSubscribeDev
	@loginName varchar(50),
	@subscribe bit
	AS
		UPDATE tUser SET showDev=@subscribe WHERE loginName=@loginName
GO

DROP PROCEDURE IF EXISTS sptSubscribeTest;
GO
CREATE PROCEDURE dbo.sptSubscribeTest
	@loginName varchar(50),
	@subscribe bit
	AS
		UPDATE tUser SET showTest=@subscribe WHERE loginName=@loginName
GO





/*--TEST DATA
INSERT INTO tUser(loginName,displayName,showDev,showTest,updated)VALUES
('mackej','Eden',1,1,GETDATE()),
('richarj','Jim',1,0,GETDATE()),
('bheemisl','Sree',0,1,GETDATE()),
('blashomt','Martin',0,0,GETDATE())
GO
sptCreateMessage 'mackej,richarj,bheemisl'
*/