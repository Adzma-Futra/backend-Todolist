class UserAuthDto {
  constructor(user) {
    this.UserID = user.UserID;
    this.Username = user.Username;
    this.Profile = user.Profile;
    this.Email = user.Email;
    this.AccessToken = user.AccessToken;
  }
}

module.exports = UserAuthDto;
