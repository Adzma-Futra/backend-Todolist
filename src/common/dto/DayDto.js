class DayDto {
  constructor(day) {
    this.DayID = day.DayID;
    this.UserID = day.UserID;
    this.EventTitleDay = day.EventTitleDay;
    this.Warna = day.Warna;
    this.Time = day.Time;
    this.Deskripsi = day.Deskripsi;
    this.CreatedAt = day.CreatedAt;
    this.UpdatedAt = day.UpdatedAt;
    this.DeletedAt = day.DeletedAt;
  }
}

module.exports = DayDto;