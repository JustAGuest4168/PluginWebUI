namespace PluginWebUI.Plugin.GuestUI
{
    public class DropdownOption
    {
        public string label { get; set; }
        public string value { get; set; }
        public byte[] img { get; set; }
        public string imgType { get; set; }

        public DropdownOption()
        {
            label = "";
            value = "";
        }
    }
}