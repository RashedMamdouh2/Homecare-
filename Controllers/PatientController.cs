using Homecare.DTO;
using Homecare.Model;
using Homecare.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Homecare.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientController : ControllerBase
    {
        private readonly IUnitOfWork unitOfWork;

        public PatientController(IUnitOfWork unitOfWork)
        {
            this.unitOfWork = unitOfWork;
            
        }
        [HttpGet("GetPatient/{id:int}")]
        public async Task<IActionResult> GetPatient(int id)
        {
            var patientDB = await unitOfWork.Patients.GetById(id);
            PatientDto patient = new PatientDto {
                Name=patientDB.Name,
                Phone=patientDB.Phone,
                Address=patientDB.Address,
                City=patientDB.City,
                Gender=patientDB.Gender,
                Image=patientDB.Image,
            
            };
            if (patient == null) { 
                return NotFound("Wrong ID");
            }
            return Ok(patient);
        }
        [HttpGet("GetAllPatients")]
        public IActionResult GetAllPatients()
        {
            var patients = unitOfWork.Patients.GetAll().OrderBy(p=>p.Name).Select(p=>new PatientDto {
                Name =  p.Name,
                Phone = p.Phone,
                Address = p.Address,
                City = p.City,
                Gender = p.Gender,
                Image = p.Image,


            });
            return Ok(patients);
        }
        [HttpPost("AddPatient")]
        public async Task<IActionResult> AddPatient(PatientDto patientDto)
        {
            var p = new Patient
            {
                Name = patientDto.Name,
                Phone = patientDto.Phone,
                Address = patientDto.Address,
                City = patientDto.City,
                Gender = patientDto.Gender,
                Image = patientDto.Image

            };
            await unitOfWork.Patients.AddAsync(p);
            await unitOfWork.SaveDbAsync();
            return CreatedAtAction(nameof(GetPatient),patientDto);
        }

    }
}
