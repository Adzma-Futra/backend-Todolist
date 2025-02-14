const moment = require("moment");

class TodayDto {
  constructor(today) {
    this.TodayID = today.TodayID;
    this.Subtask = today.Subtask;
    this.Task = today.Task;
    this.Deskripsi = today.Deskripsi;
    this.TanggalTask = today.TanggalTask
      ? moment(today.TanggalTask).format("DD-MM-YYYY")
      : null;
    this.IsCompleted = today.IsCompleted;
    this.CompletedAt = today.CompletedAt;
    this.UserID = today.UserID;
    this.Username = today.User ? today.User.Username : null;
    this.Profile = today.User ? today.User.Profile : null;
    this.ListID = today.ListID;
    this.NamaList = today.List ? today.List.NamaList : null;
    this.WarnaList = today.List ? today.List.WarnaList : null;
    this.CreatedAt = today.CreatedAt;
    this.UpdatedAt = today.UpdatedAt;
    this.DeletedAt = today.DeletedAt;
  }
}

module.exports = TodayDto;
