using System.Collections.Generic;

namespace IframeXYPoint.Data
{
    public class ClassData
    {

        public List<itemdata> data { get; set; }
    }

    public class itemdata
    {
        public string location { get; set; }
        public List<item> data { get; set; }
    }

    public class item
    {
        public string location { get; set; }
        //public decimal area { get; set; }
        //public decimal solder_height { get; set; }
        public decimal solder_volume { get; set; }
        //public decimal x_offset { get; set; }
        //public decimal y_offset { get; set; }

    }
}
