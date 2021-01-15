const port = process.env.port || process.env.npm_config_port || 9528
let qqBaseReturnUrl = 'http://aginx.cn/oauth/qq/unifyAccountLogin.do'
let githubBaseReturnUrl = 'http://aginx.cn/oauth/github/unifyAccountLogin.do'
module.exports = {
    qqLoginReturnUrl: process.env.NODE_ENV === 'development' ? qqBaseReturnUrl+'?returnUrl=http://localhost:'+port+'/' : qqBaseReturnUrl,
    githubLoginReturnUrl: process.env.NODE_ENV === 'development' ? githubBaseReturnUrl+'?returnUrl=http://localhost:'+port+'/' : githubBaseReturnUrl
}