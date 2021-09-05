using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FileWebApplication.Models;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace FileWebApplication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly FileDbContext _context;
        private readonly IWebHostEnvironment _hostEnvironment;

        public FileController(FileDbContext context, IWebHostEnvironment hostEnvironment)
        {
            _context = context;
            this._hostEnvironment = hostEnvironment;
        }

        // GET: api/File
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FileModel>>> GetFiles()
        {
            return await _context.Files
                .Select(x => new FileModel()
                {
                    ID = x.ID,
                    FileName = x.FileName,
                    Size = x.Size,
                    UpdatedDate = x.UpdatedDate,
                    CreatedDate = x.CreatedDate,
                    SaveName = x.SaveName,

                    FileSrc = String.Format("{0}://{1}{2}/Files/{3}", Request.Scheme, Request.Host, Request.PathBase, x.SaveName)
                })
                .ToListAsync();
        }

        // GET: api/File/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FileModel>> GetFileModel(int id)
        {
            var fileModel = await _context.Files.FindAsync(id);

            if (fileModel == null)
            {
                return NotFound();
            }

            return fileModel;
        }

        // PUT: api/File/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFileModel(int id, [FromForm] FileModel fileModel)
        {
            if (id != fileModel.ID)
            {
                return BadRequest();
            }

            _context.Entry(fileModel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FileModelExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/File
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<FileModel>> PostFileModel([FromForm]FileModel fileModel)
        {
            fileModel.SaveName = await SaveFile(fileModel.SelectedFile);
            _context.Files.Add(fileModel);
            await _context.SaveChangesAsync();

            return StatusCode(201);
        }

        // DELETE: api/File/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFileModel(int id)
        {
            var fileModel = await _context.Files.FindAsync(id);
            if (fileModel == null)
            {
                return NotFound();
            }
            DeleteFile(fileModel.SaveName);

            _context.Files.Remove(fileModel);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FileModelExists(int id)
        {
            return _context.Files.Any(e => e.ID == id);
        }

        [NonAction]
        public async Task<string> SaveFile(IFormFile file)
        {
            string fileName = new String(Path.GetFileNameWithoutExtension(file.FileName).Take(10).ToArray()).Replace(' ', '-');
            fileName = fileName + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(_hostEnvironment.ContentRootPath, "Files", fileName);
            using( var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            return fileName;
        }

        [NonAction]
        public void DeleteFile(string FileName)
        {
            var FilePath = Path.Combine(_hostEnvironment.ContentRootPath, "Files", FileName);
            if (System.IO.File.Exists(FilePath))
                System.IO.File.Delete(FilePath);
        }

    }
}
