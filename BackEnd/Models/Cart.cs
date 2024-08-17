using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BackEnd.Models
{
    public class Cart
    {
        public int Id { get; set; } 

        [Required]
        public int ProductId { get; set; } 

        [ForeignKey("ProductId")]
        public Product Product { get; set; }  // Ürün ilişkisi

        public string UserId { get; set; }  

        public int Amount { get; set; } 

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;  
    }
}
