'use strict'

module.exports = {
  access_token_secret: '<required> Twitter Twitter access token secret',
  access_token: '<required> Twitter access token',
  count:
    '[default=200] Specifies the number of Tweets to try and retrieve, up to a maximum of 200 per distinct request. The value of count is best thought of as a limit to the number of Tweets to return because suspended or deleted content is removed after the count has been applied. We include retweets in the count, even if include_rts is not supplied. It is recommended you always send include_rts=1 when using this API method.',
  exclude_replies:
    '[default=false] This parameter will prevent replies from appearing in the returned timeline. Using exclude_replies with the count parameter will mean you will receive up-to count tweets — this is because the count parameter retrieves that many Tweets before filtering out retweets and replies.',
  include_rts:
    '[default=false] When set to false , the timeline will strip any native retweets (though they will still count toward both the maximal length of the timeline and the slice selected by the count parameter). Note: If you’re using the trim_user parameter in conjunction with include_rts, the retweets will still contain a full user object.',
  limit: '[default=3200] Limit the number of tweets to be get',
  limit_day:
    "Don't retrieve more older tweets than the number of days using Date.now() as baseline.",
  max_id:
    'Returns results with an ID less than (that is, older than) or equal to the specified ID.',
  screen_name: 'The screen name of the user for whom to return results.',
  since_id:
    'Returns results with an ID greater than (that is, more recent than) the specified ID. There are limits to the number of Tweets that can be accessed through the API. If the limit of Tweets has occured since the since_id, the since_id will be forced to the oldest ID available.',
  trim_user:
    'When set to either true , t or 1 , each Tweet returned in a timeline will include a user object including only the status authors numerical ID. Omit this parameter to receive the complete user object.',
  user_id: 'The ID of the user for whom to return results.'
}

module.exports.message =
  'Welcome to tweets microservice. Get your credentials creating a new app at https://developer.twitter.com/en/docs/basics/authentication/guides/access-tokens'
