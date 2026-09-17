using Homecare.DTO;
using Homecare.Model;
using Homecare.Repository.Interfaces;
using Homecare.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Buffers.Text;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace Homecare.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AppointmentsController : ControllerBase
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly ImageServices imageServices;
        private readonly IPDFService pdfService;

        public AppointmentsController(IUnitOfWork unitOfWork, ImageServices imageServices,IPDFService pdfService)
        {
            this.unitOfWork = unitOfWork;
            this.imageServices = imageServices;
            this.pdfService = pdfService;
        }
        [HttpGet("GetAppointment/{id:int}")]
        public async Task<IActionResult> GetAppointment(int id)
        {
            var AppointmentDB = await unitOfWork.Appointments.FindAsync(ap=>ap.Id==id,new string[] {nameof(Model.Appointment.Patient),nameof(Model.Appointment.Physician),nameof(Model.Appointment.Report)});
           
           
            if (AppointmentDB == null)
            {
                return NotFound("Wrong ID");
            }
            List<MedicationSendAndCreateDto> meds=null;
            string pdf = "";
            if (AppointmentDB.Report is not null)
            {
                var ReportDb = await unitOfWork.Reports.FindAsync(R => R.Id == AppointmentDB.Report.Id, new string[] { nameof(Report.Medications) });
                meds = ReportDb.Medications.Select(Med => new MedicationSendAndCreateDto { Description = Med.Description, Name = Med.Name, Dose = Med.Dose ?? 0, DoseFrequency = Med.DoseFrequency ?? 0, UsageTimes = Med.UsageTimes }).ToList();
                pdf = ReportDb.Pdf;
            }
                var Appointment = new AppointmentSendDto
            {
                Id=AppointmentDB.Id,
                StartTime = AppointmentDB.StartTime,
                EndTime = AppointmentDB.EndTime,
                MeetingAddress = AppointmentDB.MeetingAddress,
                AppointmentDate = AppointmentDB.AppointmentDate,
                PatientName = AppointmentDB.Patient.Name,
                PhysicianName = AppointmentDB.Physician.Name,
                PhysicianNotes = AppointmentDB.PhysicianNotes,
                Medications =meds,
                PdfBase64=pdf
            };
            return Ok(Appointment);
        }
        [HttpGet("AtDay")]
        public IActionResult GetThisDayAppointments([FromQuery]DateTime date, [FromQuery] int patientId)
        {
            var appointments= unitOfWork.Appointments.FindAll(ap => ap.PatientId == patientId && ap.AppointmentDate == date, new string[] {nameof(Appointment.Physician) }).Select(app=>new AppointmentSendDto {
            
                StartTime=app.StartTime,
                AppointmentDate=app.AppointmentDate,
                EndTime=app.EndTime,
                Id=app.Id,
                MeetingAddress=app.MeetingAddress,
                PhysicianName=app.Physician.Name,
                PhysicianNotes=app.PhysicianNotes
                
            
            });
            return Ok(appointments);
        }
        [HttpGet("Medications")]
        public async Task<IActionResult> GetThisDayMedications([FromQuery]DateTime date, [FromQuery] int patientId)
        {
            var patient = await unitOfWork.Patients.FindAsync(p => p.Id == patientId, new string[] { nameof(Patient.Medications) });

            var medications = patient.Medications.Select(m => new MedicationSendAndCreateDto
            {
                Description = m.Description,
                Dose = m.Dose,
                DoseFrequency = m.DoseFrequency,
                Name = m.Name,
                UsageTimes = m.UsageTimes

            });
               
            return Ok(medications);
        }
        [HttpGet("GetAllAppointments")]
        public IActionResult GetAllAppointments()
        {

            var Appointments = unitOfWork.Appointments.FindAll(app=>true,new string[] {nameof(Appointment.Patient),nameof(Appointment.Physician)}).OrderBy(p => p.AppointmentDate).Select(AppointmentDB => new AppointmentSendDto
            {
                Id = AppointmentDB.Id,
                StartTime = AppointmentDB.StartTime,
                EndTime = AppointmentDB.EndTime,
                MeetingAddress = AppointmentDB.MeetingAddress,
                AppointmentDate = AppointmentDB.AppointmentDate,
                PatientName = AppointmentDB.Patient.Name,
                PhysicianName = AppointmentDB.Physician.Name,
                PhysicianNotes = AppointmentDB.PhysicianNotes,
                

            });
            return Ok(Appointments);
        }
       
        [HttpPost("BookAppointment")]
        public async Task<IActionResult> AddAppointment( AppointmentCreateDto AppointmentToBookDto)
        {

            var PhysicianAppointmentAtSameTime = await unitOfWork.Appointments.FindAsync(existedAppointment => 
            existedAppointment.PhysicianId == AppointmentToBookDto.PhysicianId
            &&existedAppointment.AppointmentDate==AppointmentToBookDto.AppointmentDate&& 
            AppointmentToBookDto.StartTime < existedAppointment.EndTime &&
            AppointmentToBookDto.EndTime > existedAppointment.StartTime
        , new string[] { });
           
            if (PhysicianAppointmentAtSameTime is not null)
            {
                return BadRequest("This Physician Has an Appointment At The same time");
            }
            var PatientAppointmentAtSameTime = await unitOfWork.Appointments.FindAsync(existedAppointment => 
            existedAppointment.PatientId == AppointmentToBookDto.patientId
            &&existedAppointment.AppointmentDate==AppointmentToBookDto.AppointmentDate&& 
            AppointmentToBookDto.StartTime < existedAppointment.EndTime &&
            AppointmentToBookDto.EndTime > existedAppointment.StartTime
        , new string[] { });
           
            if (PatientAppointmentAtSameTime is not null)
            {
                return BadRequest("This Patient Has an Appointment At The same time");
            }
            var physician = await unitOfWork.Physicians.GetByIdAsync(AppointmentToBookDto.PhysicianId);
            DateTime result =
     AppointmentToBookDto.AppointmentDate;


            if (!physician.AvailableTimeTable.Contains(result)) return BadRequest("No Avaliable appointments at this time");

            var p = new Appointment
            {
                StartTime = AppointmentToBookDto.StartTime,
                EndTime = AppointmentToBookDto.EndTime,
                MeetingAddress = AppointmentToBookDto.MeetingAddress?? "",
                AppointmentDate = AppointmentToBookDto.AppointmentDate,
                PhysicianNotes=AppointmentToBookDto.PhysicianNotes??"",
                PatientId=AppointmentToBookDto.patientId,
                PhysicianId=AppointmentToBookDto.PhysicianId

            };
            physician.AvailableTimeTable.Remove(result);
            await unitOfWork.Appointments.AddAsync(p);
            await unitOfWork.SaveDbAsync();
            return CreatedAtAction(nameof(GetAppointment), routeValues: new { id = p.Id }, AppointmentToBookDto);
        }
        [HttpPost("Add/Appointment/Report/{appointmentId:int}")]
        public async Task<IActionResult> AddReport(ReportCreateDto reportToCreate,[FromRoute] int appointmentId)
        {
            var appointment = await unitOfWork.Appointments.FindAsync(app=>app.Id==appointmentId,new string[] { nameof(Appointment.Report)});
            if (appointment is null) return NotFound("Wrong ID");
            if(appointment.Report is not null) return BadRequest("This Appointment Already Has A Report");
            var patient = await unitOfWork.Patients.FindAsync(p => p.Id == reportToCreate.patientId, new string[] { });
            var physician = await unitOfWork.Physicians.GetByIdAsync( reportToCreate.PhysicianId);
            reportToCreate.PatientName = patient.Name;
            reportToCreate.PhysicianName= physician.Name;
            var report = new Report
            {
                AppointmentId=appointment.Id,
                Descritpion = reportToCreate.Descritpion,
                patientId = reportToCreate.patientId,
                PhysicianId = reportToCreate.PhysicianId,
                Pdf= await pdfService.CreateReportPDF(reportToCreate),
                Medications = reportToCreate.Medications.Select(Md => new Medication 
                { 
                    Description = Md.Description,
                    Dose = Md.Dose,
                    DoseFrequency = Md.DoseFrequency,
                    Name = Md.Name,
                    UsageTimes = Md.UsageTimes,
                    

                    
                }
              
                ).ToList()

            };
            //add the medications to the patient as well
            patient.Medications.AddRange(report.Medications);

            await unitOfWork.Reports.AddAsync(report);
            physician.AvailableTimeTable.Remove(appointment.AppointmentDate);
            await unitOfWork.SaveDbAsync();
            return CreatedAtAction(nameof(GetAppointment), routeValues:new
            {
                id=appointment.Id
            }, new
            {
                PdfBase64 = report.Pdf
        } );


        }
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> RemoveAppointment([FromRoute]int id)
        {
            var Appointment = await unitOfWork.Appointments.FindAsync(ap=>ap.Id==id,new string[] { });
            if (Appointment is null) return NotFound("Wrong ID");
           await unitOfWork.Appointments.DeleteAsync(Appointment.Id);
            await unitOfWork.SaveDbAsync();
            return Ok();
        }
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateAppointment(AppointmentCreateDto updated, int id)
        {
            var old = await unitOfWork.Appointments.FindAsync(app=>app.Id==id,new string[] { });
            if (old is null) return NotFound("Wrong ID");
            old.MeetingAddress = updated.MeetingAddress;
            old.StartTime = updated.StartTime;
            old.EndTime = updated.EndTime;
            old.AppointmentDate = updated.AppointmentDate;
            old.PatientId = updated.patientId;
            old.PhysicianId = updated.PhysicianId;
            old.PhysicianNotes = updated.PhysicianNotes;
            unitOfWork.Appointments.Update(old);
            await unitOfWork.SaveDbAsync();
            return CreatedAtAction(nameof(GetAppointment), routeValues: new { id = old.Id }, updated);

        }
    }
}
