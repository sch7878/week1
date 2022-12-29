//router 생성
const express = require('express');
const router = express.Router();
const Comments = require('../schemas/comment.js')

//댓글 조회
router.get('/:postId', async (req,res) =>{
  const comments = await Comments.find({});

  const results = comments.map((comment)=> {
    return {
      "commentId" : comment._id,
      "user" : comment.user,
      "content" : comment.content,
      "createdAt" : comment.createdAt,
    }
  }).reverse();

  res.status(200).json({
    "data":results
  })


})

//댓글 작성
router.post("/:postId", async (req,res) =>{
  const {user,password,content} = req.body;
  

  const createdAt = new Date();
  createdAt.setHours(createdAt.getHours() + 9);

  try {
    if(user.length===0||password.length===0 ||content.length===0) {
    res.status(400).json({
      success:false, 
      errorMessage:'데이터 형식이 올바르지 않습니다.'
    })
    }

    const createdComments = await Comments.create({user,password,content,createdAt});

    res.status(200).json({
      success:true, 
      Message:'댓글이 등록되었습니다'
    })
  } catch {
    res.status(400).json({
      success:false, 
      errorMessage:'데이터 형식이 올바르지 않습니다.'
    })
  }

  })

  


//댓글 수정
router.put("/:commentId", async (req,res) => {
  const {commentId} = req.params;
  const {password, content} = req.body;
  
  try {
    const comment = await Comments.find({_id:commentId});
    
    if(password.length===0 || content.length===0) {
      res.status(400).json({
        success:false, 
        errorMessage:'데이터 형식이 올바르지 않습니다.'
      })
    }else if(comment.length && String(comment[0].password) === String(password)) {
      await Comments.updateOne(
        {_id:commentId},
        {$set:{content:content}},
        )

      res.status(200).json({ 
      success: true, 
      Message:'댓글이 수정되었습니다' 
    });
    }

   
  }catch {
    res.status(400).json({
      success:false, 
      errorMessage:'데이터 형식이 올바르지 않습니다.'
    })
  }
})

//댓글 삭제
router.delete("/:commentId", async (req,res) => {
  const {commentId} = req.params;
  const {password} = req.body;
  
  try {
  const delComment = await Comments.find({_id:commentId});
  
  if (delComment.length && String(delComment[0].password)===String(password)) {
    await Comments.deleteOne({_id:commentId})
    res.status(200).json({ 
      success: true, 
      Message:'댓글이 삭제되었습니다' 
    });
  } else {
    return res.status(400).json({
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


module.exports = router;