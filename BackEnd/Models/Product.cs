using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BackEnd.Models
{
    public class Product
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public string? Description { get; set; }

        [Required]
        public float Price { get; set; }

        public double? Rating { get; set; }

        public int CategoryId { get; set; }
        public Category? Category { get; set; }

        public int? RestaurantId { get; set; }
        public Restaurant? Restaurant { get; set; }
        public int? PhotoId { get; set; }
        public Photo? Photo { get; set; }

    }
}
