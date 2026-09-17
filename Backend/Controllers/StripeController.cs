using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Homecare.DTO;
using Homecare.Options;
using Homecare.Repository.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Stripe;
using Stripe.Checkout;

namespace Homecare.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class StripeController : ControllerBase
    {
        private readonly StripeOptions stripeOptions;
        private readonly IUnitOfWork unitOfWork;

        public StripeController(IOptionsSnapshot<StripeOptions> _stripeOptions,IUnitOfWork unitOfWork)
        {
            stripeOptions = _stripeOptions.Value;
            this.unitOfWork = unitOfWork;
        }
        [HttpPost]
        
        public async Task<IActionResult> PaySession(int physicianId)
        {

            
            var bookedPhysician = await unitOfWork.Physicians.GetByIdAsync(physicianId);
            if(bookedPhysician is null) return NotFound("This Physician is not found");
            var userId = User.Claims.First(c=>c.Type==ClaimTypes.NameIdentifier)!.Value;
            var patient = await unitOfWork.Patients.FindAsync(p=>p.UserId==userId,[]);
            StripeConfiguration.ApiKey=stripeOptions.ApiKey;
            var stripeSession = new SessionService();
            var stripeCheckoutSession = await stripeSession.CreateAsync(
                new SessionCreateOptions
                {
                    Mode = "payment",
                    ClientReferenceId = patient.UserId,
                    CustomerEmail = User.Claims.First(c=>c.Type==ClaimTypes.Email).Value,
                    // SuccessUrl = paymentDetails.SuccessUrl,
                    // CancelUrl = paymentDetails.CancelUrl,
                    LineItems = new() {

                        new(){

                            PriceData = new()
                            {
                               Currency="USD",
                                ProductData = new()
                                {
                                    Name="Session Booking",
                                },
                                UnitAmountDecimal=bookedPhysician.SessionPrice *100

                            }
                            ,Quantity=1
                        }
                    }
                }
                );
            return Ok(new {redirectUrl=stripeCheckoutSession.Url});
        }
    }
}
