using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Threading.Tasks;
using BackEnd.Models;
using BackEnd.Contextes;

namespace BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PhotoController : ControllerBase
    {
        private readonly AuthDemoDbContext _context;

        public PhotoController(AuthDemoDbContext context)
        {
            _context = context;
        }

        [HttpPost("upload")]
        public async Task<ActionResult<Photo>> UploadPhoto(IFormFile file, int restaurantId)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Dosya seçilmedi");
            }

            var fileName = Path.GetFileName(file.FileName);
            var filePath = Path.Combine("Uploads", fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var photo = new Photo
            {
                FileName = fileName,
                RestaurantId = restaurantId
            };

            _context.Photos.Add(photo);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPhotoById), new { id = photo.Id }, photo);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Photo>> GetPhotoById(int id)
        {
            var photo = await _context.Photos.FindAsync(id);
            if (photo == null)
            {
                return NotFound();
            }

            return Ok(photo);
        }
    }
}
