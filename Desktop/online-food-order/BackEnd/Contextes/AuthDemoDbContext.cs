using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BackEnd.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BackEnd.Contextes
{
    public class AuthDemoDbContext : IdentityDbContext
    {
        public AuthDemoDbContext(DbContextOptions options) : base(options)
        {

        }
        public DbSet<User> Users { get; set; }


    }
}