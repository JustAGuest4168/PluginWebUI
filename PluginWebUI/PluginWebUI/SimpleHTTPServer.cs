using HarmonyLib;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Reflection;
using System.Threading;
using UnityEngine;

namespace PluginWebUI.Plugin
{
    public class SimpleHTTPServer
    {
        private static IDictionary<string, string> _mimeTypeMappings = new Dictionary<string, string>(StringComparer.InvariantCultureIgnoreCase)
        {
            #region extension to MIME type list
            { ".asf", "video/x-ms-asf" },
            { ".asx", "video/x-ms-asf" },
            { ".avi", "video/x-msvideo" },
            { ".bin", "application/octet-stream" },
            { ".cco", "application/x-cocoa" },
            { ".crt", "application/x-x509-ca-cert" },
            { ".css", "text/css" },
            { ".deb", "application/octet-stream" },
            { ".der", "application/x-x509-ca-cert" },
            { ".dll", "application/octet-stream" },
            { ".dmg", "application/octet-stream" },
            { ".ear", "application/java-archive" },
            { ".eot", "application/octet-stream" },
            { ".exe", "application/octet-stream" },
            { ".flv", "video/x-flv" },
            { ".gif", "image/gif" },
            { ".hqx", "application/mac-binhex40" },
            { ".htc", "text/x-component" },
            { ".htm", "text/html" },
            { ".html", "text/html" },
            { ".ico", "image/x-icon" },
            { ".img", "application/octet-stream" },
            { ".svg", "image/svg+xml" },
            { ".iso", "application/octet-stream" },
            { ".jar", "application/java-archive" },
            { ".jardiff", "application/x-java-archive-diff" },
            { ".jng", "image/x-jng" },
            { ".jnlp", "application/x-java-jnlp-file" },
            { ".jpeg", "image/jpeg" },
            { ".jpg", "image/jpeg" },
            { ".js", "application/x-javascript" },
            { ".mml", "text/mathml" },
            { ".mng", "video/x-mng" },
            { ".mov", "video/quicktime" },
            { ".mp3", "audio/mpeg" },
            { ".mpeg", "video/mpeg" },
            { ".mp4", "video/mp4" },
            { ".mpg", "video/mpeg" },
            { ".msi", "application/octet-stream" },
            { ".msm", "application/octet-stream" },
            { ".msp", "application/octet-stream" },
            { ".pdb", "application/x-pilot" },
            { ".pdf", "application/pdf" },
            { ".pem", "application/x-x509-ca-cert" },
            { ".pl", "application/x-perl" },
            { ".pm", "application/x-perl" },
            { ".png", "image/png" },
            { ".prc", "application/x-pilot" },
            { ".ra", "audio/x-realaudio" },
            { ".rar", "application/x-rar-compressed" },
            { ".rpm", "application/x-redhat-package-manager" },
            { ".rss", "text/xml" },
            { ".run", "application/x-makeself" },
            { ".sea", "application/x-sea" },
            { ".shtml", "text/html" },
            { ".sit", "application/x-stuffit" },
            { ".swf", "application/x-shockwave-flash" },
            { ".tcl", "application/x-tcl" },
            { ".tk", "application/x-tcl" },
            { ".txt", "text/plain" },
            { ".war", "application/java-archive" },
            { ".wbmp", "image/vnd.wap.wbmp" },
            { ".wmv", "video/x-ms-wmv" },
            { ".xml", "text/xml" },
            { ".xpi", "application/x-xpinstall" },
            { ".zip", "application/zip" },
            #endregion
        };

        private Thread _serverThread;
        private string _rootDirectory;
        private HttpListener _listener;
        private int _port;

        #region Constructors
        /// <summary>
        /// Construct server with given port.
        /// </summary>
        /// <param name="path">Directory path to serve.</param>
        /// <param name="port">Port of the server.</param>
        public SimpleHTTPServer(string path, int port)
        {
            this.Initialize(path, port);
        }

        /// <summary>
        /// Construct server with suitable port.
        /// </summary>
        /// <param name="path">Directory path to serve.</param>
        public SimpleHTTPServer(string path)
        {
            //get an empty port
            TcpListener l = new TcpListener(IPAddress.Loopback, 0);
            l.Start();
            int port = ((IPEndPoint)l.LocalEndpoint).Port;
            l.Stop();
            this.Initialize(path, port);
        }

        //Helpers
        private void Initialize(string path, int port)
        {
            this._rootDirectory = path;
            this._port = port;
            _serverThread = new Thread(this.Listen);
            _serverThread.Start();
        }
        #endregion

        /// <summary>
        /// Open Server Page in root directory.
        /// </summary>
        /// <param name="path">
        /// Path to html file to open from root directory. Only include path, do not include scheme, host, port, etc...
        /// URI breakdown: https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#/media/File:URI_syntax_diagram.svg
        /// </param>
        public void OpenPage(string path)
        {
            //eg)"index.html"

            //Fix path if necessary
            path = path.StartsWith(@"/") ? path : "/" + path;

            //Open from Unity
            Application.OpenURL("http:/localhost:" + this._port + path);
        }

        /// <summary>
        /// Stop server and dispose all functions.
        /// </summary>
        public void Stop()
        {
            _serverThread.Abort();
            _listener.Stop();
        }

        private void Listen()
        {
            _listener = new HttpListener();
            _listener.Prefixes.Add("http://*:" + _port.ToString() + "/");
            _listener.Start();
            while (true)
            {
                try
                {
                    HttpListenerContext context = _listener.GetContext();
                    Process(context);
                }
                catch (Exception ex)
                {
                    UnityEngine.Debug.LogError(ex);
                }
            }
        }

        private void Process(HttpListenerContext context)
        {
            string httpMethod = context.Request.HttpMethod.Trim().ToUpper();
            switch (httpMethod)
            {
                case "GET":
                    {
                        //UnityEngine.Debug.Log("PluginWebUI: Process GET");
                        ProcessGET(context);
                        //UnityEngine.Debug.Log("PluginWebUI: Process GET Complete");
                        break;
                    }
                case "POST":
                    {
                        //UnityEngine.Debug.Log("PluginWebUI: Process POST");
                        ProcessPOST(context);
                        //UnityEngine.Debug.Log("PluginWebUI: Process POST Complete");
                        break;
                    }
                default:
                    {
                        UnityEngine.Debug.LogError("PluginWebUI: Unknown httpmethod");
                        break;
                    }
            }
        }
        private void ProcessGET(HttpListenerContext context)
        {
            //GETs are assumed to be page requests only

            //File Name
            string filename = context.Request.Url.AbsolutePath;
            filename = filename.Substring(1);

            //HTML file path
            filename = Path.Combine(_rootDirectory, filename);
            if (File.Exists(filename))
            {
                try
                {
                    //Prep Response
                    context.Response.StatusCode = (int)HttpStatusCode.OK;
                    context.Response.StatusDescription = "OK";

                    //Adding permanent http response headers
                    string mime;
                    context.Response.ContentType = _mimeTypeMappings.TryGetValue(Path.GetExtension(filename), out mime) ? mime : "application/octet-stream";
                    context.Response.AddHeader("Date", DateTime.Now.ToString("r"));
                    context.Response.AddHeader("Last-Modified", System.IO.File.GetLastWriteTime(filename).ToString("r"));

                    //Write File to Response--is this really the best way???
                    using (FileStream input = new FileStream(filename, FileMode.Open))
                    {
                        context.Response.ContentLength64 = input.Length;

                        byte[] buffer = new byte[1024 * 16];
                        int nbytes;
                        while ((nbytes = input.Read(buffer, 0, buffer.Length)) > 0)
                            context.Response.OutputStream.Write(buffer, 0, nbytes);
                    }

                    //Finish
                    context.Response.OutputStream.Flush();
                    context.Response.OutputStream.Close();
                    //UnityEngine.Debug.Log("PluginWebUI: ProcessGET: 200: " + filename);
                }
                catch (Exception ex)
                {
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    context.Response.StatusDescription = ex.ToString();
                    UnityEngine.Debug.LogError("PluginWebUI: ProcessGET: 500: " + ex);
                }
            }
            else
            {
                context.Response.StatusCode = (int)HttpStatusCode.NotFound;
                context.Response.StatusDescription = filename;
                UnityEngine.Debug.LogError("PluginWebUI: ProcessGET: 404: " + filename);
            }

            //Send response
            context.Response.Close();
        }
        private void ProcessPOST(HttpListenerContext context)
        {
            if (context.Request.HasEntityBody)
            {
                try
                {
                    //Read Input
                    string jsonString = "";
                    using (System.IO.Stream body = context.Request.InputStream)
                    {
                        using (var reader = new System.IO.StreamReader(body, context.Request.ContentEncoding))
                        {
                            jsonString = reader.ReadToEnd();
                        }
                    }
                    //UnityEngine.Debug.Log("PluginWebUI: ProcessPOST: Input JSON: " + jsonString);

                    //Process Input
                    if (!jsonString.Trim().Equals(""))
                    {
                        //Execute Request
                        SimpleHTTPServerPOSTData postData = Newtonsoft.Json.JsonConvert.DeserializeObject<SimpleHTTPServerPOSTData>(jsonString);
                        Type pluginType = AccessTools.TypeByName(postData.className);
                        MethodInfo mi = AccessTools.DeclaredMethod(pluginType, postData.methodName);
                        string result = "";
                        if (postData.parameters.Trim().Equals(""))
                        {
                            result = Newtonsoft.Json.JsonConvert.SerializeObject((SimpleHTTPServerPOSTResponse)mi.Invoke(null, null));
                        }
                        else
                        {
                            result = Newtonsoft.Json.JsonConvert.SerializeObject((SimpleHTTPServerPOSTResponse)mi.Invoke(null, new object[] { postData.parameters }));
                        }
                        //UnityEngine.Debug.Log("PluginWebUI: ProcessPOST: Result: " + result.Substring(0, Math.Min(result.Length, 200)));

                        //Prep Response
                        context.Response.StatusCode = (int)HttpStatusCode.OK;
                        context.Response.StatusDescription = "OK";
                        context.Response.ContentType = "application/json";
                        context.Response.KeepAlive = false;
                        context.Response.AddHeader("Date", DateTime.Now.ToString("r"));

                        //Return data
                        byte[] bOutput = System.Text.Encoding.UTF8.GetBytes(result);
                        context.Response.ContentLength64 = bOutput.Length;
                        context.Response.OutputStream.Write(bOutput, 0, bOutput.Length);

                        //Finish
                        context.Response.OutputStream.Flush();
                        context.Response.OutputStream.Close();
                        //UnityEngine.Debug.Log("PluginWebUI: ProcessPOST: 200: " + result.Substring(0, Math.Min(result.Length, 200)));
                    }
                    else
                    {
                        throw new Exception("POST JSON cannot be empty");
                    }
                }
                catch (Exception ex)
                {
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    context.Response.StatusDescription = ex.ToString();
                    UnityEngine.Debug.LogError("PluginWebUI: ProcessPOST: 500:" + ex);
                }
            }
            else
            {
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                context.Response.StatusDescription = "No Entity Body";
                UnityEngine.Debug.LogError("PluginWebUI: ProcessPOST: 400: No Entity Body");
            }

            //Send Response
            context.Response.Close();
        }

        public class SimpleHTTPServerPOSTData
        {
            public string className { get; set; }
            public string methodName { get; set; }
            public string parameters { get; set; }
            public SimpleHTTPServerPOSTData()
            {
                className = "";
                methodName = "";
                parameters = "";
            }
        }

        //public class SimpleHTTPServerPOSTParam
        //{
        //    public string name { get; set; }
        //    public string type { get; set; }
        //    public string valStr { get; set; }

        //    public SimpleHTTPServerPOSTParam()
        //    {
        //        name = "";
        //        type = "";
        //        valStr = "";
        //    }
        //}

        public class SimpleHTTPServerPOSTResponse
        {
            public bool error { get; set; }
            private string _errorText;
            public string errorText { get { return _errorText; } set { error = true; _errorText = value; } }
            public string data { get; set; }
            public string dataFormat { get; set; }

            public SimpleHTTPServerPOSTResponse()
            {
                error = false;
                _errorText = "";
                data = "";
                dataFormat = "string";
            }
            public SimpleHTTPServerPOSTResponse(string dta, string frmt)
            {
                error = false;
                _errorText = "";
                data = dta;
                dataFormat = frmt;
            }

            public SimpleHTTPServerPOSTResponse(bool err, string errTxt, string dta = "")
            {
                error = err;
                _errorText = errTxt;
                data = dta;
                dataFormat = "string";
            }
        }
    }
}