using HarmonyLib;
using System;
using System.Collections.Generic;
using System.IO;
using UnityEngine;

namespace PluginWebUI.Plugin
{
    internal static class Hooks
    {
        public static bool initialized { get; set; }
        private static HarmonyLib.Harmony instance;

        public static void Initialize()
        {
            //Copied from examples
            if (Hooks.initialized)
                return;

            Hooks.instance = Harmony.CreateAndPatchAll(typeof(Hooks), "org.guest4168.pluginwebui.hooks.base");
            Hooks.initialized = true;

            UnityEngine.Debug.Log("PluginWebUI: Hooks Initialize");
        }
    }
}