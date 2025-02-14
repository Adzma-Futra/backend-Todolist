const moment = require("moment");

class ListDto {
  constructor(list) {
    this.ListID = list.ListID;
    this.UserID = list.UserID;
    this.Username = list.User ? list.User.Username : null;
    this.Profile = list.User ? list.User.Profile : null;
    this.NamaList = list.NamaList;
    this.WarnaList = list.WarnaList;
    this.TanggalList = list.TanggalList
      ? moment(list.TanggalList).format("DD-MM-YYYY")
      : null;
    this.CreatedAt = list.CreatedAt;
    this.UpdatedAt = list.UpdatedAt;
    this.DeletedAt = list.DeletedAt;
  }
}

module.exports = ListDto;
