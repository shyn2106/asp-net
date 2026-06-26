using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CMS.Data.Entities
{
    public class Notification
    {
        [Key]
        public int Id { get; set; }

        public int CustomerId { get; set; }

        [Required]
        public string Message { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public bool IsRead { get; set; } = false;

        [ForeignKey("CustomerId")]
        public virtual Customer? Customer { get; set; }
    }
}
