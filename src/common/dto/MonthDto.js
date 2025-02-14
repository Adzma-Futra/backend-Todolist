class MonthDto {
  constructor(month) {
    this.MonthID = month.MonthID;
    this.UserID = month.UserID;
    this.EventTitleMonth = month.EventTitleMonth;
    this.Warna = month.Warna;
    this.Week = month.Week;
    this.Deskripsi = month.Deskripsi;
    this.CreatedAt = month.CreatedAt;
    this.UpdatedAt = month.UpdatedAt;
    this.DeletedAt = month.DeletedAt;
  }
}

module.exports = MonthDto;
