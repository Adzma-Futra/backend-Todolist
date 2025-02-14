class WeekDto {
  constructor(week) {
    this.WeekID = week.WeekID;
    this.UserID = week.UserID;
    this.EventTitleWeek = week.EventTitleWeek;
    this.Warna = week.Warna;
    this.Hari = week.Hari;
    this.Deskripsi = week.Deskripsi;
    this.CreatedAt = week.CreatedAt;
    this.UpdatedAt = week.UpdatedAt;
    this.DeletedAt = week.DeletedAt;
  }
}

module.exports = WeekDto;
