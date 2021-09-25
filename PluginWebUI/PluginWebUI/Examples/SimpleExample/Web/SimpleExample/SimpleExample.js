//I know this isn't the best JS, but it's how I was taught and I didn't bother making it better. 
//Be careful with variable scopes if you follow this example.

self.SimpleExample = function SimpleExample() { };

self.SimpleExample.ajaxError = function (id) {
	if (id != null) {
		if (self.GuestUI.ajaxRequests.reqs[id].hasOwnProperty("respData")) {
			alert(self.GuestUI.ajaxRequests.reqs[id].respData);
		}
	}
};

self.SimpleExample.quickTest = function () {
	self.GuestUI.executeAjax("simpleTest");
};

self.SimpleExample.TESTParams = function () {
	var data = {};
	data.input1 = "Some Text";
	data.param2 = 11;
	data.test3 = false;
	return data;
};

self.SimpleExample.TESTSuccess = function (id) {
	if (id != null) {
		if (self.GuestUI.ajaxRequests.reqs[id].hasOwnProperty("respData")) {
			var data = self.GuestUI.ajaxRequests.reqs[id].respData;
			alert("SUCCESS\nOpen Debugger to see results");
			debugger;
		}
	}
}

self.SimpleExample.initialize = function () {

	//Build HTML
	var html = {
		header: "Simple Example",
		pages: [
			{
				id: "nav-home",
				name: "Home",
				header: {
					label: "Home",
					buttons: [
						{
							label: "Button",
							onclick: self.SimpleExample.quickTest
						}
					]
				},
				contents: [
					{
						id: "nav-home-pane",
						label: "",
						rows: [
							[
								{
									type: "label",
									label: "Welcome to the Simple Example\nI will add more to this in the future",
									width: 12
								},
							]
						]
					}
				]
			}
		],
		ajax: {
			url: "http://localhost:8080/",
			reqs: [
				{
					id: "simpleTest",
					params: {
						"className": "PluginWebUI.Plugin.SimpleExample.SimpleExampleWeb",
						"methodName": "TEST",
						"parameters": self.SimpleExample.TESTParams
					},
					callbacks: {
						"success": [self.SimpleExample.TESTSuccess, self.GuestUI.refreshDataSources],
						"error": [self.SimpleExample.ajaxError]
					}
				}
			]
		}
	}

	//Create
	self.GuestUI.createMain(html);
};