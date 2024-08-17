using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace BackEnd.Models
{
    public class Restaurant
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public string? Address { get; set; }
        public float? MinPrice { get; set; }
        public int EstimatedDelivery { get; set; }
        public double? Rating { get; set; }
        public bool IsDeliveryFree { get; set; }
        public bool IsStatus { get; set; }
        public bool IsDelete { get; set; }

        public int? CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        [JsonIgnore] // Bu özelliği serileştirmeden hariç tutar

        public Category? Category { get; set; }
        [JsonIgnore] // Bu özelliği serileştirmeden hariç tutar

        public ICollection<Photo>? Photos { get; set; }
    }
}
