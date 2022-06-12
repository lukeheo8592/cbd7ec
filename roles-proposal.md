1.What database changes would be required to the starter code to allow for different roles for authors of a blog post? Imagine that we’d want to also be able to add custom roles and change the permission sets for certain roles on the fly without any code changes.

{
I would add an author-token field to the database.
For example, if you add the isauthor field to the post database and connect it with the user token (using the user token as the only password using a character number) that you gave when you first joined the user, you will check if there is a user token. In this way, it seems easy to change the code because it can be changed only when the author's token and the token of the post are the same without significantly changing the code. If you have to give multiple people the right to modify it, you can easily give them the right to modify it by adding only tokens from other users to the author-token field in the post database.
}



2.How would you have to change the PATCH route given your answer above to handle roles?
{
    First, you should check whether the user who has accessed the patch route now has permission to modify it. So, we just need to check whether the user token currently in the post database matches the user token currently being accessed.
}