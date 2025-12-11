using Homecare.Model;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using Microsoft.Win32.SafeHandles;

namespace Homecare.Services
{
    public interface IImageServices
    {
        public  Task<byte[]> ConvertToArray(IFormFile Image);
        public string ConvertArrayToImage(byte[] img);
    }
    public class ImageServices:IImageServices
    {
        public async Task<byte[]> ConvertToArray(IFormFile Image)
        {
            byte[] result ;
            using (var stream = new MemoryStream())
            {
                await Image.CopyToAsync(stream);
                result = stream.ToArray();
                
            }
            return result;
        }
       public string ConvertArrayToImage(byte[] img)
        {
            string base64Image = Convert.ToBase64String(img);
            return base64Image;
        }
    }
}
