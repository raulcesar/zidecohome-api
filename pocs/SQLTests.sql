select * from "ServiceRequest";
delete from "ServiceRequest";
select * from "TimeEntryPeriod" order by "dayReference", "startTime";
select * from "TimeEntry" order by "entryTime" desc where origin = 'manual';
delete from "TimeEntry" where id = 1310
select * from "ZidecoUserAlias"
select * from "AuthorizedSchedule"
select * from "UserXSchedule"
select * from "ValidPeriodAuthorization"

select * from "TimeEntry" order by "entryTime" desc 
select * from "TimeEntryPeriod" order by "dayReference", "startTime";

2015-05-05 08:38:00-03 | 2015-05-05 14:28:00-03 | 2015-05-05 00:00:00-03 |        350 |          350
2015-05-05 15:21:00-03 | 2015-05-05 19:08:00-03 | 2015-05-05 00:00:00-03 |        227 |          227
2015-05-05 19:09:00-03 | 2015-05-05 21:01:00-03 | 2015-05-05 00:00:00-03 |        112 |          112


NOT DELETING TIME ENTRIES!!!

select * from currency;
delete from currency where id >= 2;

select * from zidecouser;
select * from UserXRole;


 SELECT UserRole.id, UserRole.code, UserRole.description, UserRole.createdBy, UserRole.createdAt, UserRole.updatedAt, UserXRole.startDate AS UserXRole.startDate, UserXRole.endDate AS UserXRole.endDate, UserXRole.createdBy AS UserXRole.createdBy, UserXRole.createdAt AS UserXRole.createdAt, UserXRole.updatedAt AS UserXRole.updatedAt, UserXRole.ZidecoUserId AS UserXRole.ZidecoUserId, UserXRole.UserRoleId AS UserXRole.UserRoleId 
 FROM UserRole AS UserRole INNER JOIN UserXRole AS UserXRole ON UserRole.id = UserXRole.UserRoleId AND UserXRole.ZidecoUserId = 1 WHERE (UserRole.id = 1);


 drop table UserRole;
 drop table UserRole;
 drop table UserRole;
 drop table UserRole;
 drop table UserRole;
 drop table UserRole;
 

 SELECT "UserRole"."id", 
 "UserRole"."code", 
 "UserRole"."description", 
 "UserRole"."createdBy", 
 "UserRole"."createdAt", 
 "UserRole"."updatedAt", 
 "UserXRole"."startdate" AS "UserXRole.startdate", 
 "UserXRole"."enddate" AS "UserXRole.enddate", 
 "UserXRole"."createdBy" AS "UserXRole.createdBy", 
 "UserXRole"."createdAt" AS "UserXRole.createdAt", 
 "UserXRole"."updatedAt" AS "UserXRole.updatedAt", 
 "UserXRole"."ZidecoUserId" AS "UserXRole.ZidecoUserId", 
 "UserXRole"."UserRoleId" AS "UserXRole.UserRoleId" 

 FROM "UserRole" AS "UserRole" INNER JOIN "UserXRole" AS "UserXRole" ON "UserRole"."id" = "UserXRole"."UserRoleId" AND "UserXRole"."ZidecoUserId" = 1;


SELECT table_name
FROM information_schema.tables
where table_schema = 'public'
ORDER BY table_schema,table_name;

drop table "Currency";
drop table "TimeEntry";
drop table "UserRole";

drop table "ZidecoUser";


drop table currency;
drop table timeentry;
drop table userrole;
drop table zidecouser;

select * from UserXRole



 SELECT "id", "entryTime", "origin", "createdBy", "createdAt", "updatedAt", "userId" FROM "TimeEntry" AS "TimeEntry" WHERE "TimeEntry"."userID" = 2;