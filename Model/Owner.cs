using System.ComponentModel.DataAnnotations;
using static System.Net.Mime.MediaTypeNames;

namespace VesicleManagementSystem.Model
{
    public class Owner
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Phone { get; set; }
        // [Required]
        // public byte[] Image { get; set; }
    }
}