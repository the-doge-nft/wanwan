select * from "Meme" 
join "Submission" as s on s."memeId" = "Meme"."id"
WHERE "competitionId" = 2


select * from "Meme"

select * from "Competition"

select * from "Submission"

insert into "Submission" ("memeId", "competitionId", "createdById")
VALUES (12, 1, 1)


insert into "Submission" ("memeId", "competitionId", "createdById")
VALUES (11, 1, 1)

select * from "Vote"
insert into "Vote" ("competitionId", "createdById", "memeId", "score")
VALUES (1, 2, 12, 2)

select * from "Submission"
join "Meme" on "Meme"."id" = "Submission"."memeId"
join "Vote" on "Vote"."competitionId"
where "competitionId" = 1

select * from "Submission"
join "Meme" on "Meme"."id" = "Submission"."memeId"
join "Vote" on "Vote"."memeId" = "Meme"."id"
where "Submission"."competitionId" = 1

select * from "Vote"
right join "Meme" on "Meme"."id" = "Vote"."memeId"
where "Vote"."competitionId" = 1

