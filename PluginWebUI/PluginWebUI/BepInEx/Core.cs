using BepInEx;
using System;
using System.Collections.Generic;
using System.IO;
using UnityEngine;

namespace PluginWebUI.Plugin
{
    [BepInPlugin("org.guest4168.plugins.pluginwebui", "PluginWebUI", "1.0.0.0")]
    public class PluginWebUI : BaseUnityPlugin
    {
        private static SimpleHTTPServer server;
        private UnityEngine.GameObject managerObject;

        #region Unity
        public void Awake()
        {
            //Copied from examples--this might be useless for this plugin since its generic
            UnityEngine.Debug.Log("PluginWebUI: Core Awake");
            UnityEngine.Object.DontDestroyOnLoad((UnityEngine.Object)this);

            this.managerObject = new UnityEngine.GameObject("pluginWebUIManager");
            UnityEngine.Object.DontDestroyOnLoad((UnityEngine.Object)this.managerObject);
            this.managerObject.AddComponent<Manager>().Initialize();

            //Start Server
            if (server == null)
            {
                UnityEngine.Debug.Log("PluginWebUI: Starting Server");
                StartServer();
                UnityEngine.Debug.Log("PluginWebUI: Server Started");
            }
        }

        void OnApplicationQuit()
        {
            UnityEngine.Debug.Log("PluginWebUI: Stopping Server");
            StopServer();
            UnityEngine.Debug.Log("PluginWebUI: Server Stopped");
        }
        #endregion
        private static string gameProjectPath
        {
            get
            {
                return Application.dataPath.Substring(0, Application.dataPath.LastIndexOf("/"));
            }
        }

        private static string _configPath;
        public static string configPath
        {
            get
            {
                //Lazy init
                if (_configPath == null)
                {
                    _configPath = gameProjectPath + "\\BepinEx\\plugins\\[PluginWebUI]";
                }

                //Create the folder
                if (!Directory.Exists(_configPath))
                {
                    Directory.CreateDirectory(_configPath);
                }

                //Create the file
                if (!File.Exists(Path.Combine(_configPath, "config.json")))
                {
                    File.WriteAllText(Path.Combine(_configPath, "config.json"), Newtonsoft.Json.JsonConvert.SerializeObject(new PluginWebUIConfig() { port = 8080 }));
                }

                return _configPath;
            }
        }

        private static PluginWebUIConfig _config;
        public static PluginWebUIConfig config
        {
            get
            {
                if (_config == null)
                {
                    _config = Newtonsoft.Json.JsonConvert.DeserializeObject<PluginWebUIConfig>(File.ReadAllText(Path.Combine(configPath, "config.json")));
                }
                return _config;
            }
        }

        public static void AddContent(string directory, string fileName, byte[] file)
        {
            string webPath = Path.Combine(Path.Combine(configPath, "Web"), directory);
            if (!Directory.Exists(webPath))
            {
                Directory.CreateDirectory(webPath);
            }

            string filePath = Path.Combine(webPath, fileName);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
            File.WriteAllBytes(filePath, file);
        }
        /// <summary>
        /// Start Server.
        /// </summary>
        private static void StartServer()
        {
            //Create Web directory if it does not exist
            string webPath = Path.Combine(configPath, "Web");
            if (!Directory.Exists(webPath))
            {
                Directory.CreateDirectory(webPath);
            }

            //Write Library Files
            System.Resources.ResourceSet resourceSet = Properties.Resources.ResourceManager.GetResourceSet(System.Globalization.CultureInfo.CurrentUICulture, true, true);
            foreach (System.Collections.DictionaryEntry entry in resourceSet)
            {
                string fileName = entry.Key.ToString();
                byte[] file = (byte[])entry.Value;

                string path2 = Path.Combine(webPath, fileName);
                if (File.Exists(path2))
                {
                    File.Delete(path2);
                }
                File.WriteAllBytes(path2, file);
            }

            //Initialize server, will start on it's own
            server = new SimpleHTTPServer(webPath, config.port);
        }

        /// <summary>
        /// Stop Server.
        /// </summary>
        private static void StopServer()
        {
            //Stop the server
            if (server != null)
            {
                server.Stop();
            }
        }

        /// <summary>
        /// Open Server Page in root directory.
        /// </summary>
        /// <param name="path">
        /// Path to html file to open from root directory. Only include path, do not include scheme, host, port, etc...
        /// URI breakdown: https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#/media/File:URI_syntax_diagram.svg
        /// </param>
        public static void OpenPage(string path)
        {
            //UnityEngine.Debug.Log("PluginWebUI: Openning Page: " + path);
            server.OpenPage(path);
            //UnityEngine.Debug.Log("PluginWebUI: Page Open: " + path);
        }

        public class PluginWebUIConfig
        {
            public int port { get; set; }

            public PluginWebUIConfig()
            {
                port = 8080;
            }
        }
    }
}