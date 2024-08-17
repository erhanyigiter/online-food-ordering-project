using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BackEnd.Models
{
    public class Category
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } 

        public string? Description { get; set; }

        // Restoranlar ile ilişki
        public ICollection<Restaurant> Restaurants { get; set; }
    }
}
