VotingApp is a fully backend designed voting app for streagthen the backend concepts

Techlogies - 
Nodejs 
expressjs
postman
mongodb

Functionallities - 

user signin/ signup
see the list of candidates thier live vote count
vote one of the candidate, user can not revote 
user varification with unique adhar no 
there should be one admin who can maintain candidate table 
user can login with adhar no and password. user can change his password.

Routes - 

User Authentication - 
/signin: post
/signup: post

Voting- 
/candidate: get - get the list of candidates 
/vote/:candidate: post - vote for a candidate
/vote/counts: get the candidates live vote count

user Profile - 
/profile: get - get users Profile
/profile/password: put - change users password

admin Candidate Management:
/candidate: post - create a new candidate
/candidates/candidateId: put - Update an existing candidate.
/candidates/candidateId: Delete - delete a candidate