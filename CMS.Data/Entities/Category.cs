//Sinh viên : Phạm Văn Quỳnh Phúc
//MSSV:2123110202
//Lớp:CCQ2311F
//Ngày tạo: 15/05/2026
//Mô tả: Quản lí Danh mục 
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace CMS.Data.Entities
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } // Tên danh mục (vd: Tin Giáo Dục)
        public string Description { get; set; }

        // Quan hệ: Một danh mục có nhiều bài viết
        public virtual ICollection<Post> Post { get; set; }
    }
}
