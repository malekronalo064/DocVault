using Microsoft.AspNetCore.Mvc;
using DocVault.Models;
using Microsoft.EntityFrameworkCore;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;

namespace DocVault.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DocumentController : ControllerBase
    {
        private readonly DocVaultDbContext _context;
        private readonly AzureBlobService _blobService;

        public DocumentController(DocVaultDbContext context, AzureBlobService blobService)
        {
            _context = context;
            _blobService = blobService;
        }

        [HttpPost ("upload")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> UploadDocument()
        {
            // Vérifie si les données arrivent bien ici
            if (!Request.HasFormContentType || !Request.Form.Files.Any())
            {
                return BadRequest("Données du formulaire manquantes.");
            }
            
            //récupère le nom du fichier, le dossier et le fichier soumis
            var fileName = Request.Form["fileName"].ToString();
            var folder = Request.Form["folder"].ToString();
            var file = Request.Form.Files["file"];
            Console.WriteLine($"fileName : {fileName}, folder : {folder}, file : {file?.FileName}");

            // récupère le token d'authentification depuis microsoft entra id
            var token = Request.Headers.Authorization.ToString().Replace("Bearer ", "");
            Console.WriteLine($"token : {token}");
            // vérifie si le fichier a été soumis
            if (file == null || file.Length == 0)
                return BadRequest("Aucun fichier n'a été soumis.");

            try
            {
                var sasToken = _blobService.GetContainerSasToken();
                Console.Write($"sasToken : {sasToken}");
                var blobServiceClientWithSas = new BlobServiceClient(new Uri($"https://{_blobService.AccountName}.blob.core.windows.net?{sasToken}"));

                string blobPath;
                using (var stream = file.OpenReadStream())
                {
                    Console.Write("je suis dans le using du blob");
                    var containerClient = blobServiceClientWithSas.GetBlobContainerClient(_blobService.AccountName);
                    var blobClient = containerClient.GetBlobClient(fileName);
                    Console.Write("containerClient : " + containerClient, "blobClient : " + blobClient);
                    await blobClient.UploadAsync(stream, new BlobHttpHeaders { ContentType = file.ContentType });
                    blobPath = blobClient.Uri.ToString();
                    Console.Write("je suis à la fin du using du using du blob");
                }
                // Créer une instance de Document et l'ajouter à la base de données
                var document = new Document
                {
                    Id = Guid.NewGuid(),
                    Name = fileName,
                    BlobPath = blobPath,
                    UploadedOn = DateTime.UtcNow,
                    FolderId = !string.IsNullOrEmpty(folder) ? (Guid?)Guid.Parse(folder) : null,
                };

                Console.Write("document : " + document);

                 // Si un dossier est soumis, associe le document à ce dossier
                if (!string.IsNullOrEmpty(folder))
                {
                    document.FolderId = await GetOrCreateFolderAsync(folder, document.UserId);
                }
                _context.Documents.Add(document);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Upload réussi youpiiii" });
            } catch (Exception ex)
            {
                return StatusCode(400, "message d'erreur" + ex.Message);
            }
        }

        // [HttpGet("sas-token")]
        // public IActionResult GetSasToken()
        // {
        //     var sasToken = _blobService.GetContainerSasToken();
        //     return Ok(new { Token = sasToken });
        // }

        private async Task<Guid?> GetOrCreateFolderAsync(string folderName, Guid userId)
        {
            if (string.IsNullOrEmpty(folderName)) return null;

            var folder = await _context.Folders.FirstOrDefaultAsync(f => f.Name == folderName && f.UserId == userId);

            if (folder != null) return folder.Id;

            var newFolder = new Folder
            {
                Id = Guid.NewGuid(),
                Name = folderName,
                UserId = userId
            };

            _context.Folders.Add(newFolder);
            await _context.SaveChangesAsync();

            return newFolder.Id;
        }

        [HttpGet("{id}")]
        public ActionResult<Document> GetById(int id)
        {
            var document = _context.Documents.Find(id);

            if (document == null)
            {
                return NotFound("Le document n'existe pas");
            }

            return document;
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var document = _context.Documents.Find(id);

            if (document == null)
            {
                return NotFound("Le document n'existe pas");
            }

            _context.Documents.Remove(document);
            _context.SaveChanges();

            return Ok("Le document a été supprimé avec succés");
        }

    }
}