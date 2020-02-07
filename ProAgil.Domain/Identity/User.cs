using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace ProAgil.Domain.Identity
{
    public class User : IdentityUser<int>
    {
        public string FullName { get; set; }
        public string Member { get; set; } = "Member";
        public string OrgId { get; set; }
        public List<UserRole> UserRoles { get; set; }


    }
}