exports.profile = null;

exports.getProfile = function () {
  if (!exports.profile) {
    exports.profile = {
      level: 0,
      score: 0,
      hightestScore: 0
    };
  }
  return exports.profile;
}