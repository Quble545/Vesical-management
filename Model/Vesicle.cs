using System;
using System.ComponentModel.DataAnnotations;

namespace VesicleManagementSystem.Model
{
    public class Vesicle
    {
        public int Id { get; set; }
        [Required]
        public string PlateNo { get; set; }
        [Required]
        public string Type { get; set; }
        [Required]
        public string Hp { get; set; }
        public Owner Owner { get; set; }
        [Required]
        public int OwnerId { get; set; }
        public DateTime Date { get; set; }
    }
}