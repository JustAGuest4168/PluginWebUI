using System;
using System.Collections.Generic;
using System.Linq;

namespace PluginWebUI.Plugin.SimpleExample
{
    public class SimpleExampleBepInExPlugin
    {
        //Open main page -- call this within the game
        private void OpenSimpleExample()
        {
            PluginWebUI.OpenPage(@"/SimpleExample/SimpleExample.html");
        }

        //Let your plugin automatically install Web files -- make sure the files listed here are in the Resources.resx or they will not install
        private static void InstallUI()
        {
            System.Resources.ResourceSet resourceSet = Properties.Resources.ResourceManager.GetResourceSet(System.Globalization.CultureInfo.CurrentUICulture, true, true);
            foreach (System.Collections.DictionaryEntry entry in resourceSet)
            {
                UnityEngine.Debug.Log("Install SimpleExample UI" + entry.Key.ToString());
                if ((new string[] { "SimpleExample.html", "SimpleExample.js" }).Contains(entry.Key.ToString()))
                {
                    string fileName = entry.Key.ToString();
                    byte[] file = (byte[])entry.Value;

                    PluginWebUI.AddContent("SimpleExample", fileName, file);
                }
            }
        }
    }
    public class SimpleExampleWeb
    {
        public static string TEST(string json)
        {
            UnityEngine.Debug.Log("SimpleExample: TEST: Started");
            try
            {
                //Parse Parameters
                WebTestParams param = Newtonsoft.Json.JsonConvert.DeserializeObject<WebTestParams>(json);

                UnityEngine.Debug.Log("SimpleExample: TEST: " + param.input1);
                UnityEngine.Debug.Log("SimpleExample: TEST: " + param.param2);
                UnityEngine.Debug.Log("SimpleExample: TEST: " + param.test3);

                //Build Response
                WebTestResponse response = new WebTestResponse();
                response.list1.Add(param.input1);
                response.temp2 = "just a test";
                response.param4 += param.param2;
                response.dta = !param.test3;

                return Newtonsoft.Json.JsonConvert.SerializeObject(response);
            }
            catch (Exception ex)
            {
                UnityEngine.Debug.Log("SimpleExample: TEST: Error: " + ex);
                throw ex;
            }
            finally
            {
                UnityEngine.Debug.Log("SimpleExample: TEST: Complete");
            }
        }
        public class WebTestParams
        {
            public string input1 { get; set; }
            public int param2 { get; set; }
            public bool test3 { get; set; }

            public WebTestParams()
            {
                input1 = "";
            }
        }
        public class WebTestResponse
        {
            public List<string> list1 { get; set; }
            public string temp2 { get; set; }
            public int param4 { get; set; }
            public bool dta { get; set; }
            public WebTestResponse()
            {
                list1 = new List<string>();
                temp2 = "";
                param4 = -100;
            }
        }
    }
}