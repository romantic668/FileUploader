using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FileWebApplication.Models
{
    public class FileDbContext:DbContext
    {
        public FileDbContext(DbContextOptions<FileDbContext> options):base(options)
        {

        }

        public DbSet<FileModel> Files { get; set; }
    }
}
