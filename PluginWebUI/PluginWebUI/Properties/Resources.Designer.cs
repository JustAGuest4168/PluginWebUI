﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace PluginWebUI.Properties {
    using System;
    
    
    /// <summary>
    ///   A strongly-typed resource class, for looking up localized strings, etc.
    /// </summary>
    // This class was auto-generated by the StronglyTypedResourceBuilder
    // class via a tool like ResGen or Visual Studio.
    // To add or remove a member, edit your .ResX file then rerun ResGen
    // with the /str option, or rebuild your VS project.
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("System.Resources.Tools.StronglyTypedResourceBuilder", "16.0.0.0")]
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
    [global::System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
    internal class Resources {
        
        private static global::System.Resources.ResourceManager resourceMan;
        
        private static global::System.Globalization.CultureInfo resourceCulture;
        
        [global::System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        internal Resources() {
        }
        
        /// <summary>
        ///   Returns the cached ResourceManager instance used by this class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Resources.ResourceManager ResourceManager {
            get {
                if (object.ReferenceEquals(resourceMan, null)) {
                    global::System.Resources.ResourceManager temp = new global::System.Resources.ResourceManager("PluginWebUI.Properties.Resources", typeof(Resources).Assembly);
                    resourceMan = temp;
                }
                return resourceMan;
            }
        }
        
        /// <summary>
        ///   Overrides the current thread's CurrentUICulture property for all
        ///   resource lookups using this strongly typed resource class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        internal static global::System.Globalization.CultureInfo Culture {
            get {
                return resourceCulture;
            }
            set {
                resourceCulture = value;
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to div.guest-dropdowncell &gt; label {
        ///    width: 100%;
        ///}
        ///
        ///div.guest-dropdowncell &gt; div {
        ///    width: 100% !important;
        ///}
        ///
        ///div.guest-dropdownmenupreopen {
        ///    position: fixed !important;
        ///    inset: auto auto auto auto !important;
        ///    transform: translate(0px, 0px) !important;
        ///    display: none;
        ///}
        ///
        ///div.guest-dropdownmenuopen {
        ///    position: fixed !important;
        ///    inset: auto auto auto auto !important;
        ///    transform: translate(0px, 0px) !important;
        ///}
        ///.
        /// </summary>
        internal static string GuestUI_css {
            get {
                return ResourceManager.GetString("GuestUI.css", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to //Library
        ///self.GuestUI = function () { };
        ///self.GuestUI.data;
        ///
        ///self.GuestUI.createMain = function (html) {
        ///	self.GuestUI.data = html;
        ///
        ///	var header = html.header;
        ///	var pages = html.pages;
        ///	var ajax = html.ajax;
        ///
        ///	//Body CSS
        ///	var tagBody = $(&quot;body&quot;);
        ///	tagBody.css(&quot;display&quot;, &quot;flex&quot;);
        ///	tagBody.css(&quot;flex-direction&quot;, &quot;column&quot;);
        ///	tagBody.css(&quot;height&quot;, &quot;100%&quot;);
        ///	tagBody.css(&quot;overflow&quot;, &quot;hidden&quot;);
        ///
        ///	//Navbar
        ///	self.GuestUI.createMainNavTabs(header, pages, tagBody);
        ///
        ///	//Main Contents
        ///	self.GuestUI [rest of string was truncated]&quot;;.
        /// </summary>
        internal static string GuestUI_js {
            get {
                return ResourceManager.GetString("GuestUI.js", resourceCulture);
            }
        }
    }
}
