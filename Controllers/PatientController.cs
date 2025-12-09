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
    public class PatientController : ControllerBase
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IImageServices imageServices;

        public PatientController(IUnitOfWork unitOfWork, IImageServices imageServices)
        {
            this.unitOfWork = unitOfWork;
            this.imageServices = imageServices;
        }
        [HttpGet("GetPatient/{id:int}")]
        public async Task<IActionResult> GetPatient(int id)
        {
            var patientDB = await unitOfWork.Patients.GetById(id);
            if (patientDB == null) {
                return NotFound("Wrong ID");
            }
            var patient = new PatientSendDto {
                Id=patientDB.Id,
                Name = patientDB.Name,
                Phone = patientDB.Phone,
                Address = patientDB.Address,
                City = patientDB.City,
                Gender = patientDB.Gender,
                Image = imageServices.ConvertArrayToImage(patientDB.Image),

            };
            return Ok(patient);
        }
        [HttpGet("GetAllPatients")]
        public IActionResult GetAllPatients()
        {

            var patients = unitOfWork.Patients.GetAll().OrderBy(p => p.Name).Select(p => new PatientSendDto {
                Id = p.Id, 
                Name = p.Name,
                Phone = p.Phone,
                Address = p.Address,
                City = p.City,
                Gender = p.Gender,
                Image = imageServices.ConvertArrayToImage(p.Image),


            });
            return Ok(patients);
        }
        [HttpPost("AddPatient")]
        public async Task<IActionResult> AddPatient([FromForm] PatientCreateDto patientDto)
        {
            var allowedTypes = new[] { "image/jpeg", "image/png", "image/jpg" };
            if (patientDto.Image != null && (!allowedTypes.Contains(patientDto.Image.ContentType.ToLower()) || patientDto.Image.Length > 1000 * 1024))
            {
                return BadRequest("Image Should be png, jpg or jpeg of Maximum 1000 KB Size");
            }
            var p = new Patient
            {
                Name = patientDto.Name,
                Phone = patientDto.Phone,
                Address = patientDto.Address,
                City = patientDto.City,
                Gender = patientDto.Gender,
                Image = await imageServices.ConvertToArray(patientDto.Image)

            };
            await unitOfWork.Patients.AddAsync(p);
            await unitOfWork.SaveDbAsync();
            return CreatedAtAction(nameof(GetPatient), routeValues: new { id = p.Id }, patientDto);
        }
        [HttpDelete]
        public async Task<IActionResult> RemovePatient(int id)
        {
            var patient = await unitOfWork.Patients.GetById(id);
            if (patient is null) return NotFound("Wrong ID");
            unitOfWork.Patients.Delete(patient);
            await unitOfWork.SaveDbAsync();
            return Ok();
        }
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdatePatient(PatientCreateDto updated,int id)
        {
            var old = await unitOfWork.Patients.GetById(id);
            if (old is null) return NotFound("Wrong ID");
            old.Name= updated.Name;
            old.Phone= updated.Phone;
            old.Address= updated.Address;
            old.City= updated.City;
            old.Gender= updated.Gender;
            old.Image=await imageServices.ConvertToArray(updated.Image);
            unitOfWork.Patients.UpdateById(old);
            await unitOfWork.SaveDbAsync();
            return CreatedAtAction(nameof(GetPatient), routeValues: new { id = old.Id }, updated);

        }

    }
}
