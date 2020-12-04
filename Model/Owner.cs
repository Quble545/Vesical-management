using System.ComponentModel.DataAnnotations;

namespace VesicleManagementSystem.Model
{
    public class Owner
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Phone { get; set; }
       
    }
}