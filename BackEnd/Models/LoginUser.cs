using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackEnd.Models
{
    public class LoginUser
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string? FullName { get; internal set; }
    }
}