using Microsoft.AspNetCore.Mvc;
using DigitalDoc.Models;

namespace DigitalDoc.Controllers
{
    [ApiController]
    [Route("api/[controller]/folder")]    
    public class FolderController : ControllerBase
    {
        private readonly DigitalDocDbContext _context;

        public FolderController(DigitalDocDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult Post([FromBody] Folder folder)
        {
            if (folder == null)
            {
                return BadRequest("Le dossier n'existe pas");
            }

            _context.Folders.Add(folder);
            _context.SaveChanges();

            return Ok("Le dossier a été ajouté avec succés");
        }

        [HttpGet("{id}")]
        public ActionResult<Folder> GetById(int id)
        {
            var folder = _context.Folders.Find(id);

            if (folder == null)
            {
                return NotFound("Le dossier n'existe pas");
            }

            return folder;
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var folder = _context.Folders.Find(id);

            if (folder == null)
            {
                return NotFound("Le dossier n'existe pas");
            }

            _context.Folders.Remove(folder);
            _context.SaveChanges();

            return Ok("Le dossier a été supprimé avec succés");
        }

    }
}