using Homecare.DTO;
using Homecare.Model;
using Homecare.Repository;
using Homecare.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Homecare.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhysicianController : ControllerBase
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IImageServices imageServices;

        public PhysicianController(IUnitOfWork unitOfWork, IImageServices imageServices)
        {
            this.unitOfWork = unitOfWork;
            this.imageServices = imageServices;
        }
        [HttpGet("GetPhysician/{id:int}")]
        public async Task<IActionResult> GetPhysician(int id)
        {
            var PhysicianDB = await unitOfWork.Physicians.FindAsync(ph=>ph.Id==id,new string[] {nameof(Model.Physician.Specialization)});
            if (PhysicianDB == null)
            {
                return NotFound("Wrong ID");
            }
            var Physician = new PhysicianSendDto
            {
                Id = PhysicianDB.Id,
                Name = PhysicianDB.Name,
                ClinicalAddress = PhysicianDB.ClinicalAddress,
                SpecializationName=PhysicianDB.Specialization.Name,
                Image = imageServices.ConvertArrayToImage(PhysicianDB.Image),

            };
            return Ok(Physician);
        }
        [HttpGet("GetAllPhysicians")]
        public IActionResult GetAllPhysicians()
        {

            var Physicians = unitOfWork.Physicians.FindAll(p=>true,new string[] { nameof(Model.Physician.Specialization)}).OrderBy(p => p.Name).Select(p => new PhysicianSendDto
            {
                Id = p.Id,
                Name = p.Name,
                ClinicalAddress = p.ClinicalAddress,
                SpecializationName = p.Specialization.Name,
                Image = imageServices.ConvertArrayToImage(p.Image),


            });
            return Ok(Physicians);
        }
        [HttpPost("AddPhysician")]
        public async Task<IActionResult> AddPhysician([FromForm] PhysicianCreateDto PhysicianDto)
        {
            var allowedTypes = new[] { "image/jpeg", "image/png", "image/jpg" };
            if (PhysicianDto.Image != null && (!allowedTypes.Contains(PhysicianDto.Image.ContentType.ToLower()) || PhysicianDto.Image.Length > 1000 * 1024))
            {
                return BadRequest("Image Should be png, jpg or jpeg of Maximum 1000 KB Size");
            }
            var p = new Physician
            {
                Name = PhysicianDto.Name,
                SpecializationId= PhysicianDto.SpecializationId,
                ClinicalAddress= PhysicianDto.ClinicalAddress,
                Image = await imageServices.ConvertToArray(PhysicianDto.Image)

            };
            await unitOfWork.Physicians.AddAsync(p);
            await unitOfWork.SaveDbAsync();
            return CreatedAtAction(nameof(GetPhysician), routeValues: new { id = p.Id }, PhysicianDto);
        }
        [HttpDelete]
        public async Task<IActionResult> RemovePhysician(int id)
        {
            var Physician = await unitOfWork.Physicians.GetById(id);
            if (Physician is null) return NotFound("Wrong ID");
            unitOfWork.Physicians.Delete(Physician);
            await unitOfWork.SaveDbAsync();
            return Ok();
        }
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdatePhysician(PhysicianCreateDto updated, int id)
        {
            var old = await unitOfWork.Physicians.GetById(id);
            if (old is null) return NotFound("Wrong ID");
            old.Name = updated.Name;
            old.ClinicalAddress = updated.ClinicalAddress;
            old.SpecializationId= updated.SpecializationId;
            old.Image = await imageServices.ConvertToArray(updated.Image);
            unitOfWork.Physicians.UpdateById(old);
            await unitOfWork.SaveDbAsync();
            return CreatedAtAction(nameof(GetPhysician), routeValues: new { id = old.Id }, updated);

        }

    }
}
