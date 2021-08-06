const port = process.env.port || process.env.npm_config_port || 9528
const qqBaseReturnUrl = 'https://aginx.cn/oauth/qq/unifyAccountLogin.do'
const githubBaseReturnUrl = 'https://aginx.cn/oauth/github/unifyAccountLogin.do'
module.exports = {
  qqLoginReturnUrl: process.env.NODE_ENV === 'development' ? qqBaseReturnUrl + '?returnUrl=https://localhost:' + port + '/' : qqBaseReturnUrl,
  githubLoginReturnUrl: process.env.NODE_ENV === 'development' ? githubBaseReturnUrl + '?returnUrl=https://localhost:' + port + '/' : githubBaseReturnUrl
}
