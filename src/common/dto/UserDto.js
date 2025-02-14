class UserDto {
  constructor(user) {
    this.UserID = user.UserID;
    this.Username = user.Username;
    this.Profile = user.Profile;
    this.Email = user.Email;
    this.CreatedAt = user.CreatedAt;
    this.UpdatedAt = user.UpdatedAt;
    this.LastLogin = user.LastLogin;
    this.DeletedAt = user.DeletedAt;
  }
}

module.exports = UserDto;
