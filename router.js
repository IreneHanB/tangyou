var express = require('express');
var User = require('./models/user');
var md5 = require('blueimp-md5');
var router = express.Router();

var comments = [
    {
        name:'张三',
        message:'好好看',
        dataTime:'2016-1-2'
    },
    {
        name:'张三2',
        message:'好好看',
        dataTime:'2016-1-2'
    },
    {
        name:'张三3',
        message:'好好看',
        dataTime:'2016-1-2'
    },
    {
        name:'张三4',
        message:'好好看',
        dataTime:'2016-1-2'
    },
    {
        name:'张三5',
        message:'好好看',
        dataTime:'2016-1-2'
    },
]

router.get('/',function(req,res){
  console.log(req.session.user);
    res.render('index.html',{
      user:req.session.user
    })
})
router.get('/story',function(req,res){
    res.render('story.html',{
        comments:comments
    })

})
router.get('/login',function(req,res){
    res.render('login.html');
})
router.post('/login',function(req,res){
  var body = req.body

  User.findOne({
    email: body.email,
    password: md5(md5(body.password))
  }, function (err, user) {
    if (err) {
      return res.status(500).json({
        err_code: 500,
        message: err.message
      })
    }
    
    // 如果邮箱和密码匹配，则 user 是查询到的用户对象，否则就是 null
    if (!user) {
      return res.status(200).json({
        err_code: 1,
        message: 'Email or password is invalid.'
      })
    }

    // 用户存在，登陆成功，通过 Session 记录登陆状态
    req.session.user = user

    res.status(200).json({
      err_code: 0,
      message: 'OK'
    })
  })

})

router.get('/register',function(req,res){
    res.render('register.html')
})
router.post('/register',function(req,res){
  var body = req.body
  User.findOne({
    $or: [{
        email: body.email
      },
      {
        nickname: body.nickname
      }
    ]
  }, function (err, data) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: '服务端错误'
      })
    }
    // console.log(data)
    if (data) {
      // 邮箱或者昵称已存在
      return res.status(200).json({
        err_code: 1,
        message: 'Email or nickname aleady exists.'
      })
      return res.send(`邮箱或者密码已存在，请重试`)
    }

    // 对密码进行 md5 重复加密
   body.password = md5(md5(body.password))

    new User(body).save(function (err, user) {
      if (err) {
        return res.status(500).json({
          err_code: 500,
          message: 'Internal error.'
        })
      }

      // 注册成功，使用 Session 记录用户的登陆状态
      req.session.user = user;

      
      res.status(200).json({
        err_code: 0,
        message: 'OK'
      })

      // 服务端重定向只针对同步请求才有效，异步请求无效
      // res.redirect('/')
    })
  })
})

router.get('/logout', function (req, res) {
  // 清除登陆状态
  req.session.user = null

  // 重定向到登录页
  res.redirect('/login')
})

router.get('/post',function(req,res){
    res.render('post.html')
})
router.post('/post',function(req,res){
    //1.获取表单POST请求体数据
    //2.处理
    //3.发送响应

    //req.query只能拿get请求参数
    //console.log(req.query)

    //post
    //console.log(req.body)
    var comment = req.body;
    comment.dataTime = '2017-3-2';
    comments.unshift(comment);
    
    //重定向
    res.redirect('/story');
})

module.exports = router; 