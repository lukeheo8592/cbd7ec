const e = require('express');
const express = require('express');
const { Post, UserPost } = require('../db/models');

const router = express.Router();

/**
 * Create a new blog post
 * req.body is expected to contain {text: required(string), tags: optional(Array<string>)}
 */
router.post('/', async (req, res, next) => {
  try {
    // Validation
    if (!req.user) {
      return res.sendStatus(401);
    }

    const { text, tags } = req.body;

    if (!text) {
      return res
        .status(400)
        .json({ error: 'Must provide text for the new post' });
    }

    // Create new post
    const values = {
      text,
    };
    if (tags) {
      values.tags = tags.join(',');
    }
    const post = await Post.create(values);
    await UserPost.create({
      userId: req.user.id,
      postId: post.id,
    });

    res.json({ post });
  } catch (error) {
    next(error);
  }
});

router.get('/api/posts', async (req, res)=>{

  //
  try{
    //get authorid from parameter and convert into number which is separate by comma
    const authorIds = req.params.authorIds.split(',').map(element => {
      return Number(element);
    });

    //in case there is no authorID
    if (!authorIds) {
      return res
        .status(400)
        .json({ error: 'Put authorId to get posts' });
    }

    //remove duplicated numbers
    let uniqueIds = [...new Set(authorIds)];

    //get blogpost by helper function
    const blogPosts = uniqueIds.forEach((id) => {
      Post.getPostsByUserId(id);
    })

    //helper function that get parameter querys from url coded it cuz it was used more and equal to twice
    const checkQuery = (queryItem, sortItem, defaultValue) =>{
      if(queryItem){
        if(sortItem.includes(queryItem)){
          return queryItem;
        }else{
          return defaultValue;
        }
      }else{
        return defaultValue;
      }
    }

    const sortByItems = ['id', 'reads', 'likes', 'popularity'];
    const directionItems =  ['asc', 'desc'];

    const sortBy = checkQuery(req.query.sortBy,sortByItems,"id");
    const direction = checkQuery(req.query.direction,directionItems,"asc");



    //sort by direction and sortby
    if(direction){
      if(direction === "asc"){
        blogPosts.sort((a,b) => a[sortBy] - b[sortBy]);
      }else{
        blogPosts.sort((a,b) => b[sortBy] - a[sortBy]);
      }
    }

 

    const blogJson = blogPosts.map(item => JSON.stringify(item))
    return res.status(200).json(blogJson);
    
  }catch(err){
    res.json({ error: err.message || err.toString()});
  }

});



router.patch('/api/posts/:postId', async (req, res)=>{

  try{
    const {postId} = req.params;
    const {authorIds, tags, text} = req.body;
  
    if(postId){
      const blogPosts = authorIds.forEach((id) => {
        Post.getPostsByUserId(id);
      })

      let updatePost = blogPosts.filter( blogPost => blogPost["id"] == postId);
      if(updatePost){
        updatePost["authorIds"] = authorIds;
        updatePost["tags"] = tags;
        updatePost["text"] = text;
      }else{
        return res
        .status(400)
        .json({ error: `There is no post for post id ${postId}` });
      }


      return res.status(200).json(JSON.stringify(updatePost));
      
    }else{
      return res
        .status(400)
        .json({ error: 'There is no post Id' });
    }


  }catch(err){
    res.json({ error: err.message || err.toString()});
  }
  




});

module.exports = router;
