using System;
using System.ComponentModel.DataAnnotations;

namespace VesicleManagementSystem.Model
{
    public class Tax
    {
        public int Id { get; set; }
        [Required]
        public int Amount { get; set; }
        [Required]
        public string Area { get; set; }
        [Required]
        public string BookNo { get; set; }
        public Vesicle Vesicle { get; set; }
        [Required]
        public int VesicleId { get; set; }
        public DateTime? Date { get; set; }
    }
}