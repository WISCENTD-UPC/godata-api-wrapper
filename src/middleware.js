
const TOKEN_SAFE_THRESHOLD = 10

async function autoLogin (next, ctx) {
  const token = ctx.config.token
  if (token != null && (Date.now() - token.lastRefresh) / 1000 + TOKEN_SAFE_THRESHOLD < token.ttl) {
    ctx.config.query.access_token = token.value
    return next(null, ctx)
  } else {
    console.log('Refreshing access token')
    try {
      await ctx.config.api.login()
      ctx.config.token = ctx.config.api.token
      ctx.config.query.access_token = ctx.config.token.value
      return next(null, ctx)
    } catch (err) {
      return next(err)
    }
  }
}

module.exports = { autoLogin }

