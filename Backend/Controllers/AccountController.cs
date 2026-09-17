using Homecare.DTO;
using Homecare.Model;
using Homecare.Repository.Interfaces;
using Homecare.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Homecare.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly ImageServices imageServices;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly IConfiguration config;

        public AccountController(IUnitOfWork unitOfWork,UserManager<ApplicationUser> userManager,RoleManager<IdentityRole> roleManager,ImageServices imageServices,
            
            SignInManager<ApplicationUser> signInManager, IConfiguration config)
        {
            this.unitOfWork = unitOfWork;
            this.userManager = userManager;
            this.roleManager = roleManager;
            this.imageServices = imageServices;
            this.signInManager = signInManager;
            this.config = config;
        }
        [HttpPost("New/Role")]
        public async Task<IActionResult>AddRole([FromBody]string role)
        {


            var result =await roleManager.CreateAsync(new IdentityRole {
                Id=Guid.NewGuid().ToString(),
                Name=role
            
            
            });
            if (result.Succeeded) return Ok($"{role} Added Successfully");
            return BadRequest(result.Errors);
        }
        [HttpPost("Signup/Patient")]
        public async Task<IActionResult> PatientSignup([FromForm]PatientCreateDto newPatient)
        {
            
          
            var newUser = new ApplicationUser
            {
                Email=newPatient.Email,
                UserName=newPatient.UserName,
                PhoneNumber=newPatient.Phone,
                //DateOfBirth=newPatient.DateOfBirth
                
                
            };
           
            var result = await userManager.CreateAsync(newUser,newPatient.Password);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(newUser, "patient");
                
                
                var p = new Patient
                {
                    UserId=newUser.Id,
                    Name = newPatient.Name,
                    Phone = newPatient.Phone,
                    Address = newPatient.Address,
                    City = newPatient.City,
                    Gender = newPatient.Gender,
                    Image = await imageServices.ReadImage(newPatient.Image!)

                };
                await unitOfWork.Patients.AddAsync(p);
                await unitOfWork.SaveDbAsync();

                return Ok(p);

            }
            return BadRequest(result.Errors);
        }

        [HttpPost("Signup/Physician")]
        public async Task<IActionResult> PhysicianSignup([FromForm] PhysicianCreateDto PhysicianDto)
        {
            var newUser = new ApplicationUser
            {
                Email=PhysicianDto.Email,
                UserName=PhysicianDto.UserName,
                PhoneNumber=PhysicianDto.Phone,
                //DateOfBirth=PhysicianDto.DateOfBirth
                
            };
           
            var result = await userManager.CreateAsync(newUser,PhysicianDto.Password);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(newUser, "physician");

                
                var p = new Physician
                {
                    UserId=newUser.Id,
                    Name = PhysicianDto.Name,
                    SpecializationId = PhysicianDto.SpecializationId,
                    ClinicalAddress = PhysicianDto.ClinicalAddress,
                    Image = await imageServices.ReadImage(PhysicianDto.Image!),
                    SessionPrice=PhysicianDto.SessionPrice

                };
                await unitOfWork.Physicians.AddAsync(p);
                await unitOfWork.SaveDbAsync();


                return Ok(p);

            }
            return BadRequest(result.Errors);
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody]LoginDto loginDto)
        {
            var DbUser = await userManager.FindByNameAsync(loginDto.Username);
            if (DbUser is null) return NotFound("Wrong Username or Password");
            var IsCorrectPassword =await signInManager.CheckPasswordSignInAsync(DbUser, loginDto.Password, lockoutOnFailure:false);
            
            if (IsCorrectPassword.Succeeded)
            {
                var roles = await userManager.GetRolesAsync(DbUser);
                var claims = new List<Claim> {
                            new Claim(ClaimTypes.Name, DbUser.UserName),
                            new Claim(ClaimTypes.NameIdentifier, DbUser.Id),
                            new Claim(JwtRegisteredClaimNames.Exp,DateTime.UtcNow.AddMinutes(10).ToString()),
                            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),

                        };
                var Patient=await unitOfWork.Patients.FindAsync(p=>p.UserId==DbUser.Id,new string []{});
                if (Patient is not null) claims.Add(new Claim("PatientId",Patient.Id.ToString()));
                var Physician=await unitOfWork.Physicians.FindAsync(p=>p.UserId==DbUser.Id,new string []{});
                if (Physician is not null) claims.Add(new Claim("PhysicianId", Physician.Id.ToString()));
                foreach (var role in roles)
                {
                    claims.Add(new Claim(ClaimTypes.Role, role));
                }
                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["JWT:Key"]));
                var signingCred = new SigningCredentials(key: securityKey, algorithm: SecurityAlgorithms.HmacSha256);
                var securityToken = new JwtSecurityToken(
                     issuer: config["JWT:issuer"],
                     audience: config["JWT:audience"],
                     claims: claims,
                     expires: DateTime.UtcNow.AddMinutes(10),
                     signingCredentials: signingCred

                    );
                var token = new JwtSecurityTokenHandler().WriteToken(securityToken);
                return Ok(token);


            }
            return NotFound("Username or Password is invalid");
        }
        
    }
}

