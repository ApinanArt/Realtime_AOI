using Newtonsoft.Json.Linq;
using RestSharp;
using System;
namespace IframeXYPoint.Tools
{
    public class Tools
    {
        public static JObject apiPost(string api, string key, string pass, object jsonbody)
        {
            JObject json = new JObject();

            try
            {
                var client = new RestClient();
                var request = new RestRequest(api, Method.POST);
                request.AddHeader(key, pass);

                request.AddJsonBody(jsonbody);
                var res = client.Execute(request);
                //json = res.Cookies.Count != 0 ? JObject.Parse(res.Content) : new JObject { };
                json = JObject.Parse(res.Content);

            }
            catch { }

            return json;
        }
        public static JObject apiPostArray(string api, string key, string pass, object jsonbody)
        {
            JObject json = new JObject();
            IRestResponse res;
            JObject ssss = (JObject)jsonbody;
            try
            {
                var client = new RestClient();
                var request = new RestRequest(api, Method.POST);
                request.AddHeader(key, pass);

                string jsonCon = ((JObject)jsonbody).ToString(Newtonsoft.Json.Formatting.None);
                request.AddJsonBody(jsonCon);
                //System.Threading.Thread.Sleep(3000);
                res = client.Execute(request);

                json = JObject.Parse(res.Content);


            }
            catch (Exception e)
            {
                json["remark"] = e.Message;

            }

            return json;
        }
    }

}
