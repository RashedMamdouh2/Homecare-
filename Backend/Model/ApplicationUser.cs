using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using Twilio.Rest.Api.V2010.Account.Usage.Record;

namespace Homecare.Model
{
    public class ApplicationUser:IdentityUser
    {
        //[Range(typeof(DateOnly), "1970-01-01", "2026-01-01")]
        //public DateOnly DateOfBirth { get; set; }
        
        public ApplicationUser()
        {
            
        }
    }
}
