using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BackEnd.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string FullName { get; set; }
        public string Adress { get; set; }

        internal static string FindFirst(object nameIdentifier)
        {
            throw new NotImplementedException();
        }
    }
}