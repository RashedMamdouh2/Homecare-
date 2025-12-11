using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace Homecare.Services
{
    public class MessagingService:IMessagingService
    {
        private readonly IConfiguration config;
        private readonly string _accountSid;
        private readonly string _authToken;
        private readonly string _fromNumber;
        

        public MessagingService(IConfiguration config)
        {
            this.config = config;
            _accountSid = config["Twilio:_accountSid"];
            _authToken = config["Twilio:_authToken"];
            _fromNumber = config["Twilio:_fromNumber"];
        }
        public void SendWhatsApp(string to, string message)
        {
            TwilioClient.Init(_accountSid, _authToken);

            var msg = MessageResource.Create(
                from: new PhoneNumber($"whatsapp:{_fromNumber}"),
                body: message,
                to: new PhoneNumber($"whatsapp:+2{to}")
            );

            Console.WriteLine($"WhatsApp message sent! SID: {msg.Sid}");
        }
    }
}
