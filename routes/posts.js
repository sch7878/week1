//router 생성
const express = require('express');
const router = express.Router();
const Posts = require('../schemas/post.js')


//게시글 조회
router.get('/', async (req,res) =>{
  const posts = await Posts.find({});

  const results = posts.map((post)=> {
    return {
      "postId" : post._id,
      "user" : post.user,
      "title" : post.title,
      "createdAt" : post.createdAt,
    }
  }).reverse();

    res.status(200).json({
      "data":results
    })


})

//게시글 상세 조회
router.get("/:postId", async (req,res) => {
  const {postId} = req.params;

  try {
  const post = await Posts.find({_id:postId});
    if (post.length) {
      const result = {
        "postId": post[0]._id,    
        "user": post[0].user,    
        "title": post[0].title,  
        "content": post[0].content,   
        "createdAt": post[0].createdAt,
      
      }

    res.status(200).json({
      "data":result
    })
  } else {
    return res.status(400).json({
      success: false, 
      errorMessage:"데이터형식이 올바르지 않습니다"
    })
  }
 
} catch {
  return res.status(400).json({
    success: false, 
    errorMessage:"데이터형식이 올바르지 않습니다"
  })
}
  

})


//게시글 작성
router.post("/", async (req,res) =>{
  const {user,password,title,content} = req.body;

  const createdAt = new Date();
  createdAt.setHours(createdAt.getHours() + 9);

  try {
    if(user.length===0 || password.length===0 || title.length===0||content.length===0) {
    res.status(400).json({
      success:false, 
      errorMessage:'데이터 형식이 올바르지 않습니다.'
    })
    return
  }

  const createdPosts = await Posts.create({user,password,title,content,createdAt});
    res.status(200).json({
      success:true, 
      Message:'게시글이 등록되었습니다'
    })
  } catch {
    res.status(400).json({
      success:false, 
      errorMessage:'데이터 형식이 올바르지 않습니다.'
    })
  }


  
})




//게시글 수정
router.put("/:postId", async (req,res) => {
  const {postId} = req.params;
  const {password,title, content} = req.body;
  
 try {
  const post = await Posts.find({_id:postId});

  if(password.length===0 || title.length===0||content.length===0) {
    res.status(400).json({
      success:false, 
      errorMessage:'데이터 형식이 올바르지 않습니다.'
    })
  } else if(post.length && String(post[0].password) === String(password)) {
    console.log(postId)
    await Posts.updateOne(
      {_id:postId},
      {$set:{content:content,title:title}},
      )
       res.status(200).json({ 
      success: true, 
      Message:'게시글이 수정되었습니다' 
    });
    } else {
      res.status(400).json({
        success:false, 
        errorMessage:'데이터 형식이 올바르지 않습니다.'
      })
  }
   

 } catch {
    res.status(400).json({
      success:false, 
      errorMessage:'데이터 형식이 올바르지 않습니다.'
    })
 }
  

})

//게시글 삭제
router.delete("/:postId", async (req,res) => {
  const {postId} = req.params;
  const {password} = req.body;


  
  try {
  const delPost = await Posts.find({_id:postId});
    
    if (delPost.length && String(delPost[0].password)===String(password)) {
      await Posts.deleteOne({_id:postId})
      res.status(200).json({ 
        success: true, 
        Message:'게시글이 삭제되었습니다' 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        Message:'비밀번호가 틀렸습니다.'
      });  
    }
    
} catch {
  res.status(400).json({
    success:false, 
    errorMessage:'데이터 형식이 올바르지 않습니다.'
  })
}

 
})






module.exports = router;

