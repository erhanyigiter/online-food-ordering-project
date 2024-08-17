using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackEnd.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Contextes
{
    public class AuthDemoDbContext : IdentityDbContext<ApplicationUser>
    {
        public AuthDemoDbContext(DbContextOptions<AuthDemoDbContext> options) : base(options)
        {
        }

        public DbSet<Restaurant> Restaurants { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Cart> Carts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Restoran ve Photo arasındaki ilişki
            modelBuilder.Entity<Restaurant>()
                .HasMany(r => r.Photos)
                .WithOne(p => p.Restaurant)
                .HasForeignKey(p => p.RestaurantId)
                .OnDelete(DeleteBehavior.Cascade);

            // Restoran ve Category arasındaki ilişki
            modelBuilder.Entity<Category>()
                .HasMany(c => c.Restaurants)
                .WithOne(r => r.Category)
                .HasForeignKey(r => r.CategoryId);
        }
    }
}
