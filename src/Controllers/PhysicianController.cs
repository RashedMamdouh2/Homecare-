using Homecare.DTO;
using Homecare.Model;
using Homecare.Repository.Interfaces;
using Homecare.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuestPDF.Helpers;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Homecare.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PhysicianController : ControllerBase
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly ImageServices imageServices;
        

        public PhysicianController(IUnitOfWork unitOfWork, ImageServices imageServices)
        {
            this.unitOfWork = unitOfWork;
            this.imageServices = imageServices;
           
        }
        [HttpGet("{id:int}")]
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
                Image = PhysicianDB.Image,
                SessionPrice = PhysicianDB.SessionPrice,

            };
            return Ok(Physician);
        }
        [HttpGet]
        public IActionResult GetAllPhysicians()
        {
            
            var Physicians = unitOfWork.Physicians.FindAll(p=>true,new string[] { nameof(Model.Physician.Specialization)}).OrderBy(p => p.Name).Select(p => new PhysicianSendDto
            {
                Id = p.Id,
                Name = p.Name,
                ClinicalAddress = p.ClinicalAddress,
                SpecializationName = p.Specialization.Name,
                Image = p.Image,


            });
            return Ok(Physicians);
        }
        [HttpGet("{physicianId:int}/Appointments")]
  
        public  IActionResult GetAppointment(int physicianId)
        {
            var authUsrPhysicianId = User.Claims.FirstOrDefault(c => c.Type == "PhysicianId")!.Value ;
            if (authUsrPhysicianId != physicianId.ToString()) return Forbid();
            var AppointmentDB = unitOfWork.Appointments.FindAll(app => app.PhysicianId == physicianId, new string[] { nameof(Model.Appointment.Report), nameof(Patient), nameof(Physician) }).ToList();


            if (AppointmentDB == null)
            {
                return NotFound("Wrong ID");
            }
            var Appointments = AppointmentDB.Select(app => new AppointmentSendDto
            {
                Id = app.Id,
                StartTime = app.StartTime,
                EndTime = app.EndTime,
                MeetingAddress = app.MeetingAddress,
                AppointmentDate = app.AppointmentDate,
                PatientName = app.Patient.Name,
                PhysicianName = app.Physician.Name,
                PhysicianNotes = app.PhysicianNotes,
                Medications = new(),
                PdfBase64 = app.Report is null?"":app.Report.Pdf
            });
            return Ok(Appointments);
        }
        [HttpGet("{physicianId:int}/free-slots")]
        public async Task<IActionResult> GetFreeTimes(int physicianId, [FromQuery] DateOnly date)
        {
           var physician= await unitOfWork.Physicians.FindAsync(phy => phy.Id == physicianId, new string[] { });
            if (physician == null) { return NotFound("No Physician Found"); }
            var availableHoursAtThisDay = physician.AvailableTimeTable.Where(datetime => date.Equals(new DateOnly(datetime.Year, datetime.Month, datetime.Day))).Select(datetime => new TimeOnly(datetime.Hour, datetime.Minute, datetime.Second));
            return Ok(availableHoursAtThisDay);
        }
        [HttpGet("{physicianId:int}/feedbacks")]
        [AllowAnonymous]
        public IActionResult GetPhysicanFeedbacks(int physicianId)
        {


            var feedback = unitOfWork.Feedbacks.FindAll(feed => feed.PhysicianId == physicianId, new string[] { nameof(Feedback.Patient) });
            return Ok(feedback.Select(feedbackDb=>new FeedbackDto
            {

                Description =feedbackDb.Description,
                PatientId   =feedbackDb.PatientId,
                PhysicianId =feedbackDb.PhysicianId,
                PatientName  =feedbackDb.Patient.Name,
                rate         =feedbackDb.rate

            }));
        }
        [HttpGet("{physicianId:int}/Patients")]
        public async Task<IActionResult> GetPatientsOfPhysician(int physicianId, int pageNumber)
        {

            var physician = await unitOfWork.Physicians.GetByIdAsync(physicianId);
            if (physician is null) return NotFound("Wrong Physician ID");
            var pageSize = 5;
            int skip = (pageNumber - 1) * pageSize;
            int totalRecords = unitOfWork.Appointments.Count(app => app.PhysicianId == physicianId);
            var totalPages =totalRecords / pageSize + (totalRecords% pageSize == 0?0:1);
            var appointments = unitOfWork.Appointments.FindAll(app => app.PhysicianId == physicianId, new string[] { nameof(Appointment.Patient) },take:pageSize,skip).DistinctBy(app=>app.PatientId);
            if (appointments is not null && appointments.Any()) return Ok(new
            {
                patients = appointments.Select(app => new Patient
                {
                    Id=app.Patient.Id,
                    Name=app.Patient.Name,
                    Address=app.Patient.Address,
                    City=app.Patient.City,
                    CreatedAt=app.Patient.CreatedAt,
                    Gender=app.Patient.Gender,
                    Image=app.Patient.Image,
                    Phone=app.Patient.Phone,
                    


                }),
                currentPage = pageNumber,
                totalPages

            });
            return Ok();
        }
      
        [HttpPost("{physicianId:int}/free-slots")]
        
        public async Task<IActionResult> AddPhysicianFreeAppointments(int physicianId,[FromBody] List<DateTime>freeTimes)
        {
            var physician= await unitOfWork.Physicians.FindAsync(ph => ph.Id == physicianId, new string[] {  });
                if (physician == null) { return NotFound("No Physician Found"); }
            physician.AvailableTimeTable.AddRange(freeTimes);
            physician.AvailableTimeTable=physician.AvailableTimeTable.Distinct().ToList();
            
            await unitOfWork.SaveDbAsync();
            return CreatedAtAction(actionName: nameof(GetAppointment), routeValues: new { physicianId = physicianId },value:new { Avaliable=freeTimes });

        }
        [HttpPost("{physicianId:int}/feedbacks")]
        public async Task<IActionResult> AddFeedbackToPhysician(int physicianId,FeedbackDto feedback)
        {
            var patient =await unitOfWork.Patients.GetByIdAsync(feedback.PatientId);
            if (patient is null) return NotFound("Wrong Patient ID");
            var physician =await unitOfWork.Physicians.GetByIdAsync(feedback.PhysicianId);
            if (physician is null) return NotFound("Wrong Physician ID");
            if (feedback.rate < 0 || feedback.rate > 5) return BadRequest("Wrong rate");
            var newFeedback = new Feedback
            {
                Description = feedback.Description,
                PatientId = feedback.PatientId,
                PhysicianId = physicianId,
                rate = feedback.rate,

            };
            await unitOfWork.Feedbacks.AddAsync(newFeedback);
            await unitOfWork.SaveDbAsync();
            return CreatedAtAction(nameof(GetPhysicanFeedbacks), routeValues: new { physicianId = physicianId }, value: new { feedback = feedback });





        }
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdatePhysician(PhysicianCreateDto updated, int id)
        {
            var old = await unitOfWork.Physicians.GetByIdAsync(id);
            if (old is null) return NotFound("Wrong ID");
            old.Name = updated.Name;
            old.ClinicalAddress = updated.ClinicalAddress;
            old.SpecializationId= updated.SpecializationId;
            old.Image = await imageServices.ReadImage(updated.Image);
            old.SessionPrice= updated.SessionPrice;
            unitOfWork.Physicians.Update(old);
            await unitOfWork.SaveDbAsync();
            return CreatedAtAction(nameof(GetPhysician), routeValues: new { id = old.Id }, updated);

        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles ="admin")]
        public async Task<IActionResult> RemovePhysician(int id)
        {
            var Physician = await unitOfWork.Physicians.GetByIdAsync(id);
            if (Physician is null) return NotFound("Wrong ID");
            await unitOfWork.Physicians.DeleteAsync(Physician.Id);
            await unitOfWork.SaveDbAsync();
            return Ok();
        }
    }
}
