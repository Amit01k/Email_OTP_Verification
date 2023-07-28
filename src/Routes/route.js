const express=require('express')
const router=express.Router()
const userController=require('../controller/userController')

//register the new user
router.post('/api/user',userController.userRegister)
//get all user data
router.get('/api/user',userController.getall)
//delete user data
// router.delete("/api/user/:id",userController.deletebyid)
//generate jsonweb token for authorization
router.post('/api/login',userController.login)


module.exports=router