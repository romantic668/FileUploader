using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace FileWebApplication.Models
{
    public class FileModel
    {
        [Key]
        public int ID { get; set; }

        public int Size { get; set; }


        [Column(TypeName = "nvarchar(100)")]
        public string FileName { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string SaveName { get; set; }

        [Column(TypeName = "Date")]
        public DateTime CreatedDate { get; set; }

        [Column(TypeName = "Date")]
        public DateTime UpdatedDate { get; set; }

        [NotMapped]
        public IFormFile SelectedFile { get; set; }

        [NotMapped]
        public string FileSrc { get; set; }
    }
}
