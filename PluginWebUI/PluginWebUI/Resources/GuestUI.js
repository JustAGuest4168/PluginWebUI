//Library
self.GuestUI = function () { };
self.GuestUI.data;

self.GuestUI.createMain = function (html) {
	self.GuestUI.data = html;

	var header = html.header;
	var pages = html.pages;
	var ajax = html.ajax;

	//Body CSS
	var tagBody = $("body");
	tagBody.css("display", "flex");
	tagBody.css("flex-direction", "column");
	tagBody.css("height", "100%");
	tagBody.css("overflow", "hidden");

	//Navbar
	self.GuestUI.createMainNavTabs(header, pages, tagBody);

	//Main Contents
	self.GuestUI.createMainNavContent(pages, tagBody);

	//Ajax/DataSources
	self.GuestUI.initAjax(ajax);
};
self.GuestUI.createMainNavTabs = function (header, pages, tagBody) {
	//Navbar
	var tagNav = document.createElement("nav");
	$(tagNav).attr("class", "navbar-light bg-light");
	$(tagBody).append(tagNav);

	//Header
	var tagNavDiv = document.createElement("div");
	$(tagNavDiv).attr("class", "container-md");
	$(tagNav).append(tagNavDiv);

	var tagNavHeader = document.createElement("h1");
	$(tagNavHeader).text(header);
	$(tagNavDiv).append(tagNavHeader);

	var tagNavTabs = document.createElement("div");
	tagNavTabs.id = "nav-tab";
	$(tagNavTabs).attr("class", "nav nav-tabs");
	$(tagNavTabs).attr("role", "tablist");
	$(tagNavTabs).on("shown.bs.tab", function (event) {
		event.target // newly activated tab
		event.relatedTarget // previous active tab

		//Tab Display
		$($(event.relatedTarget).attr("data-bs-target")).css("display", "none");
		$($(event.target).attr("data-bs-target")).css("display", "flex");

		//Resize Tables
		self.GuestUI.resizeTables();
	})
	$(tagNavDiv).append(tagNavTabs);

	//Tabs - Pages
	for (let i = 0; i < pages.length; i++) {
		var page = pages[i];

		var tagTabButton = document.createElement("button");
		$(tagTabButton).attr("class", "nav-link" + ((i == 0) ? " active" : ""));
		$(tagTabButton).attr("data-bs-toggle", "tab");
		$(tagTabButton).attr("data-bs-target", "#" + page.id);
		$(tagTabButton).attr("type", "button");
		$(tagTabButton).attr("role", "tab");
		$(tagTabButton).attr("aria-controls", page.id);
		$(tagTabButton).attr("aria-selected", (i == 0) ? "true" : "false");
		$(tagTabButton).text(page.name);
		$(tagNavTabs).append(tagTabButton);
	}
};
self.GuestUI.createMainNavContent = function (pages, tagBody) {
	//Content - Container
	var tagMain = document.createElement("div");
	$(tagMain).attr("class", "container-md");
	$(tagMain).css("display", "flex");
	$(tagMain).css("flex-direction", "column");
	$(tagMain).css("overflow", "hidden");
	$(tagBody).append(tagMain);

	var tagTabContent = document.createElement("div");
	tagTabContent.id = "nav-tab-contents"
	$(tagTabContent).attr("class", "tab-content");
	$(tagTabContent).css("display", "flex");
	$(tagTabContent).css("flex-direction", "column");
	$(tagTabContent).css("overflow", "hidden");
	$(tagMain).append(tagTabContent);

	//Pages
	for (let i = 0; i < pages.length; i++) {
		var page = pages[i];

		self.GuestUI.createMainNavContentPage(page, i, tagTabContent);
	}
};
self.GuestUI.createMainNavContentPage = function (page, pageIndex, tagTabContent) {
	var tagTabPage = document.createElement("div");
	tagTabPage.id = page.id;
	$(tagTabPage).attr("class", "tab-pane fade" + ((pageIndex == 0) ? " show active" : ""));
	$(tagTabPage).attr("role", "tabpanel");
	$(tagTabPage).attr("aria-labelledby", page.id + "-tab");
	$(tagTabPage).css("display", (pageIndex == 0) ? "flex" : "none");
	$(tagTabPage).css("flex-direction", "column");
	$(tagTabPage).css("overflow", "hidden");
	$(tagTabContent).append(tagTabPage);

	var tagTabPageDiv = document.createElement("div");
	$(tagTabPageDiv).css("display", "flex");
	$(tagTabPageDiv).css("flex-direction", "column");
	$(tagTabPageDiv).css("overflow", "hidden");
	$(tagTabPage).append(tagTabPageDiv);

	//Header
	self.GuestUI.createMainNavContentPageHeader(page, tagTabPageDiv);

	//Contents
	self.GuestUI.createMainNavContentPageContent(page, tagTabPageDiv);

	//Modals
	var modals = page.modals;
	if (modals != null && modals.length > 0) {
		for (let i = 0; i < modals.length; i++) {
			var modal = modals[i];

			self.GuestUI.createModal(modal, tagTabPage);
		}
	}
};
self.GuestUI.createMainNavContentPageHeader = function (page, tagTabPageDiv) {
	var tagTabPageHeader = document.createElement("nav");
	$(tagTabPageHeader).attr("class", "navbar navbar-expand-lg navbar-dark bg-dark")
	$(tagTabPageDiv).append(tagTabPageHeader);

	var tagTabPageHeaderDiv = document.createElement("div");
	$(tagTabPageHeaderDiv).attr("class", "container-md");
	$(tagTabPageHeader).append(tagTabPageHeaderDiv);

	//Label
	var tagTabPageHeaderSpan = document.createElement("span");
	$(tagTabPageHeaderSpan).attr("class", "navbar-brand");
	$(tagTabPageHeaderSpan).text(page.header.label);
	$(tagTabPageHeaderDiv).append(tagTabPageHeaderSpan);

	//Buttons
	var tagTabPageHeaderButtons = document.createElement("form");
	$(tagTabPageHeaderButtons).attr("class", "d-flex");
	$(tagTabPageHeaderButtons).css("margin", "0px");
	$(tagTabPageHeaderDiv).append(tagTabPageHeaderButtons);

	var tagTabPageHeaderButtonsRow = document.createElement("div");
	$(tagTabPageHeaderButtonsRow).attr("class", "row");
	$(tagTabPageHeaderButtons).append(tagTabPageHeaderButtonsRow);

	for (let j = 0; j < page.header.buttons.length; j++) {
		var headerButton = page.header.buttons[j];

		var tagHeaderButtonCol = document.createElement("div");
		$(tagHeaderButtonCol).attr("class", "col");
		$(tagTabPageHeaderButtonsRow).append(tagHeaderButtonCol);

		var tagHeaderButton = document.createElement("button");
		$(tagHeaderButton).attr("type", "button");
		$(tagHeaderButton).attr("class", "btn btn-primary");
		$(tagHeaderButton).css("white-space", "nowrap");
		$(tagHeaderButton).text(headerButton.label);
		$(tagHeaderButton).click(headerButton.onclick);
		$(tagHeaderButtonCol).append(tagHeaderButton);
	}
};
self.GuestUI.createMainNavContentPageContent = function (page, tagTabPageDiv) {
	//Accordion Container
	var tagTabPageContent = document.createElement("div");
	$(tagTabPageContent).attr("class", "flex-grow-1");
	$(tagTabPageContent).css("overflow", "auto");
	$(tagTabPageDiv).append(tagTabPageContent);

	var tagTabPageAccordion = document.createElement("div");
	$(tagTabPageAccordion).attr("class", "accordion");
	$(tagTabPageContent).append(tagTabPageAccordion);

	var pageContents = page.contents;
	for (let j = 0; j < pageContents.length; j++) {
		var pageContent = pageContents[j];
		var pageContentId = pageContent.id;
		var pageContentLabel = pageContent.label;
		var pageRows = pageContent.rows;

		//Accordion
		var tagAccordionItem = document.createElement("div");
		$(tagAccordionItem).attr("class", "accordion-item");
		$(tagTabPageAccordion).append(tagAccordionItem);

		var tagAccordionHeader = document.createElement("h2");
		tagAccordionHeader.id = pageContentId + "-heading";
		$(tagAccordionHeader).attr("class", "accordion-header");
		if (pageContentLabel == null || pageContentLabel == "") {
			$(tagAccordionHeader).css("display", "none");
		}
		$(tagAccordionItem).append(tagAccordionHeader);

		var tagAccordionHeaderButton = document.createElement("button");
		$(tagAccordionHeaderButton).attr("class", "accordion-button");
		$(tagAccordionHeaderButton).attr("type", "button");
		$(tagAccordionHeaderButton).attr("data-bs-toggle", "collapse");
		$(tagAccordionHeaderButton).attr("data-bs-target", "#" + pageContentId);
		$(tagAccordionHeaderButton).attr("aria-expanded", "true");
		$(tagAccordionHeaderButton).attr("aria-controls",);
		$(tagAccordionHeaderButton).text(pageContentLabel);
		$(tagAccordionHeader).append(tagAccordionHeaderButton);

		var tagAccordionContent = document.createElement("div");
		tagAccordionContent.id = pageContentId;
		$(tagAccordionContent).attr("class", "accordion-collapse collapse show");
		$(tagAccordionContent).attr("aria-labelledby", pageContentId + "-heading");
		$(tagAccordionItem).append(tagAccordionContent);

		var tagAccordionBody = document.createElement("div");
		$(tagAccordionBody).attr("class", "accordion-body");
		$(tagAccordionContent).append(tagAccordionBody);

		//Rows
		for (let k = 0; k < pageRows.length; k++) {
			var pageRowCells = pageRows[k];

			var tagRow = document.createElement("div");
			$(tagRow).attr("class", "row g-3");
			$(tagAccordionBody).append(tagRow);

			for (let m = 0; m < pageRowCells.length; m++) {
				var pageRowCell = pageRowCells[m];
				var cellType = pageRowCell.type.trim().toLowerCase();

				switch (cellType) {
					case "":
						{
							break;
						}
					case "space":
						{
							var cellWidth = pageRowCell.width;

							var tagCell = document.createElement("div");
							$(tagCell).attr("class", "col-" + cellWidth);
							$(tagRow).append(tagCell);
							break;
						}
					case "label":
						{
							var cellLabel = pageRowCell.label;
							var cellWidth = pageRowCell.width;

							var tagCell = document.createElement("div");
							$(tagCell).attr("class", "col-" + cellWidth);
							$(tagRow).append(tagCell);

							self.GuestUI.createLabel(cellLabel, tagCell);
							break;
						}
					case "input":
						{
							var cellId = pageRowCell.id;
							var cellLabel = pageRowCell.label;
							var cellWidth = pageRowCell.width;
							var cellValidation = pageRowCell.validation;
							var cellMaxLength = pageRowCell.maxlength;
							var cellEnabled = (pageRowCell.hasOwnProperty("enabled")) ? pageRowCell.enabled : true;

							var tagCell = document.createElement("div");
							$(tagCell).attr("class", "col-" + cellWidth);
							$(tagRow).append(tagCell);

							self.GuestUI.createInput(cellId, cellLabel, cellMaxLength, cellValidation, cellEnabled, tagCell);
							break;
						}
					case "dropdown":
						{
							var cellId = pageRowCell.id;
							var cellLabel = pageRowCell.label;
							var cellWidth = pageRowCell.width;

							var cellImgW = (pageRowCell.hasOwnProperty("imgW")) ? pageRowCell.imgW : 0;
							var cellImgH = (pageRowCell.hasOwnProperty("imgH")) ? pageRowCell.imgH : 0;
							var cellOptions = pageRowCell.options;

							var tagCell = document.createElement("div");
							$(tagCell).attr("class", "col-" + cellWidth + " guest-dropdowncell");
							$(tagRow).append(tagCell);

							self.GuestUI.createDropdown(cellId, cellLabel, cellImgW, cellImgH, cellOptions, tagCell);
							break;
						}
					case "toggle":
						{
							var cellId = pageRowCell.id;
							var cellLabel = pageRowCell.label;
							var cellWidth = pageRowCell.width;

							var tagCell = document.createElement("div");
							$(tagCell).attr("class", "col-" + cellWidth);
							$(tagRow).append(tagCell);

							self.GuestUI.createToggle(cellId, cellLabel, tagCell);
							break;
						}
					case "multiselect":
						{
							var cellId = pageRowCell.id;
							var cellLabel = pageRowCell.label;
							var cellWidth = pageRowCell.width;
							var cellOptions = pageRowCell.options;

							var tagCell = document.createElement("div");
							$(tagCell).attr("class", "col-" + cellWidth);
							$(tagRow).append(tagCell);

							self.GuestUI.createMultiSelect(cellId, cellLabel, cellOptions, tagCell);
							break;
						}
					case "multitogglerow":
						{
							var cellLabel = pageRowCell.label;
							var cellOptions = pageRowCell.options;

							self.GuestUI.createMultiToggleRow(cellLabel, cellOptions, tagRow);
							break;
						}
					case "table":
						{
							var cellId = pageRowCell.id;
							var cellLabel = pageRowCell.label;
							var cellOptions = pageRowCell.options;

							self.GuestUI.createTableRow(cellId, cellLabel, cellOptions, tagRow);
							break;
						}
				}
			}
		}
	}
}
self.GuestUI.resizeTables = function () {
	if (self.GuestUI.data.pages != null) {
		var pages = self.GuestUI.data.pages;
		for (let i = 0; i < pages.length; i++) {
			var page = pages[i];

			//Main Contents
			self.GuestUI.resizeTablesContents(page);

			//Modals
			var modals = page.modals;
			if (modals != null) {
				for (let j = 0; j < modals.length; j++) {
					var modal = modals[j];
					self.GuestUI.resizeTablesContents(modal);
				}
			}
		}
	}
}
self.GuestUI.resizeTablesContents = function (contentHolder) {
	var contents = contentHolder.contents;
	if (contents != null) {
		for (let j = 0; j < contents.length; j++) {
			var rows = contents[j].rows;
			if (rows != null) {
				for (let k = 0; k < rows.length; k++) {
					var rowsK = rows[k];
					for (let l = 0; l < rowsK.length; l++) {
						if (rowsK[l].type == "table") {
							$("#" + rowsK[l].id).DataTable().columns.adjust();
						}
					}
				}
			}
		}
	}
}

//Input
self.GuestUI.validateInput = function (event) {
	if (event.hasOwnProperty("data") && event.data.hasOwnProperty("validationFunction") && event.data.validationFunction != null && event.data.validationFunction(this.value)) {
		this.oldValue = this.value;
		this.oldSelectionStart = this.selectionStart;
		this.oldSelectionEnd = this.selectionEnd;
	}
	else if (this.hasOwnProperty("oldValue")) {
		this.value = this.oldValue;
		this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
	}
	else {
		this.value = "";
	}
}
self.GuestUI.createInput = function (id, label, maxlength, validation, enabled, parent) {
	//Label
	var tagLabel = document.createElement("label");
	$(tagLabel).attr("class", "form-label");
	$(tagLabel).attr("for", id);
	$(tagLabel).text(label);
	$(parent).append(tagLabel);

	//Field			
	var tagInput = document.createElement("input");
	tagInput.id = id;
	$(tagInput).attr("class", "form-control");
	$(tagInput).attr("maxlength", (maxlength != null && maxlength > 0) ? maxlength : 524288);
	$(tagInput).prop("disabled", !enabled);
	$(tagInput).on(
		"input keydown keyup mousedown mouseup select contextmenu drop",
		{ validationFunction: self.GuestUI._getInputValidation(validation) },
		self.GuestUI.validateInput
	);
	$(parent).append(tagInput);
};
self.GuestUI._getInputValidation = function (validation) {
	var validationType = typeof (validation);

	//Validation of input
	var validationFunction = function (val) { return true; };
	switch (validationType) {
		case "function":
			{
				//Custom function
				validationFunction = validation;
				break;
			}
		case "string":
			{
				//Split into keywords
				var validationArry = validation.toLowerCase().split(",").map(function (next) { return next.trim(); });

				var regex = null;
				if (validationArry.indexOf("integer") != -1) {
					if (validationArry.indexOf("negativeallowed") != -1) {
						regex = new RegExp('^-?[0-9]*$');
					}
					else {
						regex = new RegExp('^[0-9]*$');
					}
				}
				else if (validationArry.indexOf("decimal") != -1) {
					if (validationArry.indexOf("negative") != -1) {
						regex = new RegExp('^-?\d*[.,]?\d*$');
					}
					else {
						regex = new RegExp('^\d*[.,]?\d*$');
					}
				}
				else if (validationArry.indexOf("alphaeng") != -1) {
					regex = new RegExp('^[a-zA-Z0-9 ]*$');
				}

				//If found a keyword set new validation function
				if (regex != null) {
					validationFunction = function (val) { return regex.test(val); };
				}
				break;
			}
	}

	return validationFunction;
};

//Dropdown
self.GuestUI.createDropdown = function (id, label, imgW, imgH, options, parent) {
	var tagLabel = document.createElement("label");
	$(tagLabel).attr("for", id);
	$(tagLabel).attr("class", "form-label");
	$(tagLabel).text(label);
	$(parent).append(tagLabel);

	var selectTag = document.createElement("select");
	selectTag.id = id;
	//$(selectTag).attr("class", "form-select");
	$(selectTag).attr("class", "selectpicker");
	$(selectTag).attr("data-dropup-auto", "false");
	$(selectTag).attr("data-dropup", "false");
	$(selectTag).attr("data-bs-display", "static");
	$(selectTag).attr("data-size", 5);
	$(selectTag).attr("guest-imgW", imgW);
	$(selectTag).attr("guest-imgH", imgH);
	/*$(selectTag).on("shown.bs.select", function(e)
	{	
		var menu = $($(this).parent().children()[2]); //$("div .dropdown-menu.show", $(this).parent().children())
		setTimeout(function(selectMenu)
		{
			return function()
			{
				$(selectMenu).css("min-width", $(selectMenu).parent().width() + "px");
				$(menu).addClass("guest-dropdownmenuopen");
				$(menu).removeClass("guest-dropdownmenupreopen");
				
				//$(selectMenu).css("inset", "auto auto auto auto");
				//$(selectMenu).css("transform", "translate(0px, 0px)");
				//$(selectMenu).css("position", "fixed");
			};
		}(menu), 1);
		
		$(menu).addClass("guest-dropdownmenupreopen");
	});*/
	$(parent).append(selectTag);

	//Create options
	if (options.length > 0) {
		for (let i = 0; i < options.length; i++) {
			var option = options[i];
			var optionLabel = option.label;
			var optionVal = option.value;
			var optionImg = option.hasOwnProperty("img") ? option.img : null;
			var optionImgType = option.hasOwnProperty("imgType") ? option.imgType : null;

			self.GuestUI._createDropdownOption(optionLabel, optionVal, optionImg, optionImgType, imgW, imgH, i, selectTag);
		}

		//Select first option
		$(selectTag).selectpicker('refresh');
		$(selectTag).selectpicker('val', options[0].value);
		$(selectTag).selectpicker('refresh');
	}
}
self.GuestUI._createDropdownOption = function (label, value, img, imgType, imgW, imgH, sort, parent) {
	var optionTag = document.createElement("option");
	$(optionTag).text(label);
	$(optionTag).val(value);
	$(optionTag).attr("guest-sort", sort);
	if (img != null) {
		var dataContent = "<img width='" + imgW + "px' height='" + imgH + "px' src="
		if (imgType == null || imgType.trim().toLowerCase() == "") {
			dataContent = dataContent + "'" + img + "'";
		}
		else {
			switch (imgType.trim().toLowerCase()) {
				case "datapng":
					{
						dataContent = dataContent + "'data:image/png;base64," + img + "'";
						break;
					}
			}
		}
		dataContent = dataContent + " />";
		$(optionTag).attr("data-content", dataContent);
	}

	if ($(parent).children().length == 0 || $(parent).children().length == sort) {
		$(parent).append(optionTag);
	}
	else {
		$($(parent).children()[sort - 1]).insert(optionTag);
	}
}
self.GuestUI.updateDropdownOptions = function (id, options) {
	//Get existing data
	var parent = $("#" + id);
	var imgW = $(parent).attr("guest-imgW");
	var imgH = $(parent).attr("guest-imgH");
	var selectedVal = null;
	if ($(parent).children().length == 0) {
		//Select first of new options if original empty
		if (options.length > 0) {
			selectedVal = options[0].value;
		}
	}
	else {
		//Loop new options to see if current value exists
		for (let i = 0; i < options.length; i++) {
			if (options[i].value == $(parent).val()) {
				selectedVal = $(parent).val();
			}
		}

		//No match - take first of new
		if (selectedVal == null && options.length > 0) {
			selectedVal = options[0].value;
		}
	}

	//Remove Options
	$(parent).empty();
	$(parent).selectpicker('refresh');

	//Add Options
	if (options.length > 0) {
		for (let i = 0; i < options.length; i++) {
			var option = options[i];
			var optionLabel = option.label;
			var optionVal = option.value;
			var optionImg = option.hasOwnProperty("img") ? option.img : null;
			var optionImgType = option.hasOwnProperty("imgType") ? option.imgType : null;

			self.GuestUI._createDropdownOption(optionLabel, optionVal, optionImg, optionImgType, imgW, imgH, i, parent);
		}
		$(parent).selectpicker('refresh');
	}

	//Update selected
	if (selectedVal != null) {
		$(parent).selectpicker('val', selectedVal);
	}
	$(parent).selectpicker('refresh');
}
self.GuestUI.insertDropdownOption = function (id, label, value, img, sort) {
	//Get existing data
	var parent = $("#" + id);
	var selectedVal = ($(parent).children().length == 0) ? value : $(parent).val();
	var imgW = $(parent).attr("guest-imgW");
	var imgH = $(parent).attr("guest-imgH");

	//Create new option
	self.GuestUI._createDropdownOption(label, value, img, null, imgW, imgH, sort, parent);

	//Update sort
	var existingTags = $(parent).children();
	for (let i = 0; i < existingTags.length; i++) {
		$(existingTags[i]).attr("guest-sort", i);
	}

	//Select first option if necessary
	$(parent).selectpicker('refresh');
	$(parent).selectpicker('val', selectedVal);
}
self.GuestUI.enableDropdown = function (id) {
	var parent = $("#" + id);
	$(parent).prop("disabled", false);
	$(parent).selectpicker('refresh');
}
self.GuestUI.disableDropdown = function (id) {
	var parent = $("#" + id);
	$(parent).prop("disabled", true);
	$(parent).selectpicker('refresh');
}
self.GuestUI.setDropdownValue = function (id, i, val) {
	var parent = $("#" + id);

	if (i != -1) {
		val = null;
		if ($(parent).children().length != 0 && $(parent).children().length > i) {
			val = $($(parent).children()[i]).val();
		}
	}
	if (val != null) {
		val = val.toString();
	}
	$(parent).selectpicker('val', val);
	$(parent).selectpicker('refresh');
}
//Toggle
self.GuestUI.createToggle = function (id, label, parent) {
	//Label - Empty
	// var tagLabel = document.createElement("label");
	// $(tagLabel).attr("class", "form-label");
	// $(parent).append(tagLabel);

	//Spacing
	//$(parent).append(document.createElement("br"));
	//$(parent).append(document.createElement("br"));

	//Toggle
	self.GuestUI._createToggleInner(id, label, false, false, false, false, parent);
};
self.GuestUI.createMultiToggleRow = function (label, options, parent) {
	//Column
	var tagCol = document.createElement("div");
	$(tagCol).attr("class", "col-12");
	$(parent).append(tagCol);

	//Label - Multi
	var tagLabel = document.createElement("label");
	$(tagLabel).attr("class", "form-label");
	$(tagLabel).text(label);
	$(tagCol).append(tagLabel);

	//Toggles
	var tagColContents = document.createElement("div");
	$(tagColContents).attr("class", "col-12");
	$(tagColContents).css("margin-top", "0px");
	//$(tagColContents).css("text-align", "center");
	$(parent).append(tagColContents);

	var tagColContentsDiv = document.createElement("div");
	$(tagColContentsDiv).css("display", "flex");
	$(tagColContentsDiv).css("flex-direction", "row");
	$(tagColContents).append(tagColContentsDiv);

	for (let i = 0; i < options.length; i++) {
		var optionId = options[i].id;
		var optionLabel = options[i].label;

		var tagOptionCol = document.createElement("div");
		$(tagOptionCol).attr("class", "col-1");
		$(tagOptionCol).css("text-align", "center");
		$(tagOptionCol).css("margin-top", "0px");
		$(tagOptionCol).css("flex", "1 1 0");
		$(tagColContentsDiv).append(tagOptionCol);

		//Toggle
		self.GuestUI._createToggleInner(optionId, optionLabel, false, true, (i == 0), (i == (options.length - 1)), tagOptionCol);
	}

	//Spacing
    /*var tagFiller = document.createElement("div");
    $(tagFiller).attr("class", "col-" + (12 - (options.length%12)));
    $(tagColContentsDiv).append(tagFiller);*/
};
self.GuestUI.createMultiToggleRowHeaderless = function (options, parent) {
	for (let i = 0; i < options.length; i++) {
		var optionId = options[i].id;
		var optionLabel = options[i].label;
		var optionWidth = options[i].width;

		//Column
		var tagCol = document.createElement("div");
		$(tagCol).attr("class", "col-" + width);
		$(tagCol).css("text-align", "center");
		$(parent).append(tagCol);

		//Toggle
		self.GuestUI.createToggle(optionId, optionLabel, tagCol);
	}
};
self.GuestUI._createToggleInner = function (id, label, header, row, rowFirst, rowLast, parent) {
	var tagInput = document.createElement("input");
	tagInput.id = id;
	$(tagInput).attr("type", "checkbox");
	$(tagInput).attr("class", "btn-check");
	$(tagInput).attr("autocomplete", "off");
	$(parent).append(tagInput);

	var tagLabel = document.createElement("label");
	$(tagLabel).attr("class", "btn btn-outline-primary");
	$(tagLabel).css("display", "flex");
	$(tagLabel).css("flex-direction", "column");
	if (!header && !row) {
		$(tagLabel).css("margin-top", "8px");
	}
	if (row) {
		//$(tagLabel).attr("for", id);
		$(tagLabel).css("flex", "1 1 0");
		if (!rowFirst) {
			$(tagLabel).css("margin-left", "4px");
		}
		if (!rowLast) {
			$(tagLabel).css("margin-right", "4px");
		}
	}
	$(tagLabel).click(self.GuestUI.toggleClicked);
	$(parent).append(tagLabel);

	var tagLabelSymbol = document.createElement("span");
	$(tagLabelSymbol).css("overflow", "hidden");
	$(tagLabelSymbol).text("✖");
	$(tagLabel).append(tagLabelSymbol);

	var tagLabelText = document.createElement("span");
	$(tagLabelText).css("white-space", "nowrap");
	$(tagLabelText).css("overflow", "hidden");
	$(tagLabelText).text(label);
	$(tagLabel).append(tagLabelText);
}
self.GuestUI.toggleClicked = function (event) {
	var tagLabelSymbol = $($(event.target).parent().children()[0]);//$($(event.target).children()[0]);
	if (tagLabelSymbol.text().indexOf("✖") == 0) {
		tagLabelSymbol.text("✔");
	}
	else {
		tagLabelSymbol.text("✖");
	}
};
self.GuestUI.getToggleValue = function (id) {
	return $($("#" + id).next().children()[0]).text().indexOf("✖") != 0;
}
self.GuestUI.setToggleValue = function (id, val) {
	//Set input value
	var tagInput = $("#" + id);
	$(tagInput).prop("checked", val);

	//Set check mark
	$(tagInput.next().children()[0]).text((val) ? "✔" : "✖");
}

//MultiSelect
self.GuestUI.createMultiSelect = function (id, label, options, parent) {
	//Label
	var tagLabel = document.createElement("label");
	$(tagLabel).attr("class", "form-label");
	$(tagLabel).attr("for", id);
	$(tagLabel).text(label);
	$(parent).append(tagLabel);

	//Dropdown
	var tagDropdownDiv = document.createElement("div");
	$(tagDropdownDiv).attr("class", "dropdown");
	$(parent).append(tagDropdownDiv);

	var tagDropdownButton = document.createElement("button");
	tagDropdownButton.id = id;
	$(tagDropdownButton).attr("class", "btn btn-primary dropdown-toggle");
	$(tagDropdownButton).attr("data-bs-toggle", "dropdown");
	$(tagDropdownButton).attr("aria-expanded", "false");
	$(tagDropdownButton).attr("data-bs-auto-close", "outside");
	$(tagDropdownButton).css("width", "100%");
	$(tagDropdownButton).css("overflow", "hidden");
	$(tagDropdownButton).text("Select");
	$(tagDropdownDiv).append(tagDropdownButton);

	var tagDropdownUl = document.createElement("ul");
	$(tagDropdownUl).attr("class", "dropdown-menu");
	$(tagDropdownUl).attr("aria-labelledby", id);
	$(tagDropdownUl).css("width", "100%");
	$(tagDropdownUl).css("height", "170px");
	$(tagDropdownUl).css("overflow-y", "scroll");
	$(tagDropdownUl).css("overflow-x", "hidden");
	$(tagDropdownDiv).append(tagDropdownUl);

	//Dropdown options
	if (options != null && options.length > 0) {
		for (let i = 0; i < options.length; i++) {
			self.GuestUI.createMultiSelectOption(options[i].label, options[i].value, tagDropdownUl);
		}
	}
};
self.GuestUI.createMultiSelectOption = function (label, value, parent) {
	var tagDropdownLi = document.createElement("li");
	$(tagDropdownLi).attr("class", "dropdown-item");
	$(tagDropdownLi).click(self.GuestUI.multiSelectOptionClicked);
	$(tagDropdownLi).attr("guest-value", value);
	$(tagDropdownLi).val("false");
	$(tagDropdownLi).text("✖ " + label);
	$(parent).append(tagDropdownLi);
};
self.GuestUI.multiSelectOptionClicked = function (event) {
	var text = $(event.target).text();

	if (text.indexOf("✖") == 0) {
		$(event.target).text("✔" + text.split("✖")[1]);
		$(event.target).val("true");
	}
	else {
		$(event.target).text("✖" + text.split("✔")[1]);
		$(event.target).val("false");
	}

	var button = $(event.target).parent().prev();
	var options = $(event.target).parent().children();
	var selectedText = "";
	for (let i = 0; i < options.length; i++) {
		var optionText = $(options[i]).text();
		if (optionText.indexOf("✔") == 0) {
			selectedText = selectedText + (selectedText == "" ? "" : ", ") + optionText.split("✔")[1];
		}
	}
	if (selectedText == "") {
		selectedText = "Select";
	}
	$(button).text(selectedText);
};
self.GuestUI.updateMultiSelectOptions = function (id, options) {
	var dropdownButton = $("#" + id);

	//Clear selected text
	$(dropdownButton).text("Select");

	//Clear all options
	var ul = $(dropdownButton).next();
	ul.empty();

	//Set new options
	if (options != null && options.length > 0) {
		for (let i = 0; i < options.length; i++) {
			self.GuestUI.createMultiSelectOption(options[i].label, options[i].value, ul);
		}
	}
}
self.GuestUI.getMultiSelectValues = function (id) {
	var dropdownButton = $("#" + id);
	var options = $(dropdownButton).next().children();
	var data = [];

	for (let i = 0; i < options.length; i++) {
		var optionText = $(options[i]).text();
		if (optionText.indexOf("✔") == 0) {
			data.push($(options[i]).attr("guest-value"));
		}
	}
	return data;
}
self.GuestUI.setMultiSelectValues = function (id, values) {
	var dropdownButton = $("#" + id);
	var selectedText = "";
	var options = $(dropdownButton).next().children();
	for (let i = 0; i < options.length; i++) {
		var selected = values.indexOf($(options[i]).attr("guest-value")) > -1;
		var text = $(options[i]).text();

		$(options[i]).prop("selected", selected)
		if (text.indexOf("✖") == 0 && selected) {
			$(options[i]).text("✔" + text.split("✖")[1]);
			selectedText = selectedText + (selectedText == "" ? "" : ", ") + text.split("✖")[1];
		}
		if (text.indexOf("✔") == 0 && !selected) {
			$(options[i]).text("✖" + text.split("✔")[1]);
		}
	}

	if (selectedText == "") {
		selectedText = "Select";
	}
	$(dropdownButton).text(selectedText);
}
//Table
self.GuestUI.createTableRow = function (id, label, options, parent) {
	//Column
	var tagCol = document.createElement("div");
	$(tagCol).attr("class", "col-12");
	$(parent).append(tagCol);

	//Card
	var tagCard = document.createElement("div");
	$(tagCard).attr("class", "card");
	$(tagCol).append(tagCard);

	//Card Header
	var tagCardHeader = document.createElement("h5");
	$(tagCardHeader).attr("class", "card-header text-light bg-dark");
	$(tagCardHeader).text(label);
	$(tagCard).append(tagCardHeader);

	//Card Body	
	var tagCardBody = document.createElement("div");
	$(tagCardBody).attr("class", "card-body");
	$(tagCard).append(tagCardBody);

	//Table
	var tagTable = document.createElement("table");
	tagTable.id = id;
	$(tagTable).attr("class", "table table-striped");
	$(tagTable).css("width", "100%");
	$(tagCardBody).append(tagTable);

	var tableColumns = options.columns;
	var tableData = (options.hasOwnProperty("data")) ? options.data : [];
	var tableScroll = (options.hasOwnProperty("scroll") && options.scroll != 0) ? options.scroll + "px" : "215px";
	var tableButtons = []; //(options.hasOwnProperty("buttons"))? options.buttons : [];

	//Button Columns
	// for(let i=0; i<tableButtons.length; i++)
	// {
	// var button = tableButtons[i];
	// var buttonName = button.name;
	// var buttonLabel = button.label;

	// tableColumns.push({data: null, defaultContent: "<button name='" + buttonName + "' class='btn btn-primary' style='width:100%;'>" + buttonLabel + "</button>"});
	// }
	for (let i = 0; i < tableColumns.length; i++) {
		if (tableColumns[i].type == "button") {
			var button = tableColumns[i];
			var buttonName = button.name;
			var buttonLabel = button.label;
			var buttonEvent = button.event;

			tableColumns.splice(i, 1, { data: null, defaultContent: "<button name='" + buttonName + "' class='btn btn-primary' style='width:100%;'>" + buttonLabel + "</button>" });
			tableButtons.push({ name: buttonName, event: buttonEvent });
		}
		else {
			if (!tableColumns[i].hasOwnProperty("data")) {
				tableColumns[i].data = i - tableButtons.length;
			}
		}
	}

	//DataTable
	$(tagTable).DataTable(
		{
			data: tableData,
			columns: tableColumns,
			scrollY: tableScroll,
			lengthChange: true,
			lengthMenu: [5, 10, 15],
			pagingType: "full_numbers",
			dom: 'lftip',
			buttons: [
				{
					text: 'Refresh',
					action: function (e, dt, node, config) {
						//Refresh and redraw
						self.CustomScheduleEvents.refreshCategoryData();
						$.when(self.CustomScheduleEvents.refreshCategoryDataDeferred).done(function () {
							//Redraw any Category DataTable
							var table = $('#nav-Category-table').DataTable();
							table.clear();
							table.rows.add(self.CustomScheduleEvents.categoryData).draw()
						});
					}
				}]
		});
	$("#" + id + " tbody").on("click", "button", self.GuestUI.tableButtonClick(tableButtons));
}
self.GuestUI.tableButtonClick = function (tableButtons) {
	return function () {
		var buttonName = $(this).attr("name");
		var table = $(this).parents("table").DataTable();
		var row = table.row($(this).parents('tr')).data();

		for (let i = 0; i < tableButtons.length; i++) {
			var button = tableButtons[i];
			var buttonName2 = button.name;
			var buttonEvent = button.event;

			if (buttonName == buttonName2) {
				buttonEvent(table, row);
				break;
			}
		}
	}
};

//Label
self.GuestUI.createLabel = function (label, parent) {
	var tagLabel = document.createElement("h3");
	$(tagLabel).attr("class", "form-label");
	$(tagLabel).text(label);
	$(parent).append(tagLabel);
}

//Space

//Modal
self.GuestUI.createModal = function (modal, parent) {
	var modalId = modal.id;
	var modalLabel = modal.label;
	var modalContents = modal.contents;
	var modalFooterButtons = modal.footerButtons;

	//Container
	var tagModalDiv = document.createElement("div");
	tagModalDiv.id = modalId;
	$(tagModalDiv).attr("class", "modal");
	$(tagModalDiv).attr("tabindex", "-1");
	$(tagModalDiv).attr("aria-labelledby", modalId + "-modalLabel");
	$(tagModalDiv).attr("aria-hidden", "true");
	$(parent).append(tagModalDiv);

	var tagModalDialogDiv = document.createElement("div");
	$(tagModalDialogDiv).attr("class", "modal-dialog modal-xl");
	$(tagModalDialogDiv).css("height", "100%");
	$(tagModalDialogDiv).css("overflow", "hidden");
	$(tagModalDialogDiv).css("display", "flex");
	$(tagModalDialogDiv).css("flex-direction", "column");
	$(tagModalDialogDiv).css("margin-top", "0px");
	$(tagModalDialogDiv).css("margin-bottom", "0px");
	$(tagModalDialogDiv).css("padding-top", "1.75rem");
	$(tagModalDialogDiv).css("padding-bottom", "1.75rem");
	$(tagModalDiv).append(tagModalDialogDiv);

	var tagModalContentDiv = document.createElement("div");
	$(tagModalContentDiv).attr("class", "modal-content");
	$(tagModalContentDiv).css("height", "100%");
	$(tagModalContentDiv).css("overflow", "hidden");
	$(tagModalDialogDiv).append(tagModalContentDiv);

	//Header
	self.GuestUI.createModalHeader(modalId, modalLabel, tagModalContentDiv);

	//Body
	self.GuestUI.createModalBody(modalContents, tagModalContentDiv);

	//Footer
	self.GuestUI.createModalFooter(modalFooterButtons, tagModalContentDiv);
}
self.GuestUI.createModalHeader = function (modalId, modalLabel, parent) {
	var tagModalHeader = document.createElement("div");
	$(tagModalHeader).attr("class", "modal-header");
	$(parent).append(tagModalHeader);

	var tagModalHeaderH = document.createElement("h5");
	tagModalHeaderH.id = modalId + "-modalLabel";
	$(tagModalHeaderH).attr("class", "modal-title");
	$(tagModalHeaderH).text(modalLabel);
	$(tagModalHeader).append(tagModalHeaderH);

	var tagModalHeaderClose = document.createElement("button");
	$(tagModalHeaderClose).attr("type", "button");
	$(tagModalHeaderClose).attr("class", "btn-close");
	$(tagModalHeaderClose).attr("data-bs-dismiss", "modal");
	$(tagModalHeaderClose).attr("aria-label", "Close");
	$(tagModalHeader).append(tagModalHeaderClose);
}
self.GuestUI.createModalBody = function (modalContents, parent) {
	var tagModalBody = document.createElement("div");
	$(tagModalBody).attr("class", "modal-body");
	$(tagModalBody).css("display", "flex");
	$(tagModalBody).css("flex-direction", "column");
	$(tagModalBody).css("overflow", "hidden");
	$(parent).append(tagModalBody);
	self.GuestUI.createMainNavContentPageContent({ contents: modalContents }, tagModalBody);
}
self.GuestUI.createModalFooter = function (modalFooterButtons, parent) {
	var tagModalFooter = document.createElement("div");
	$(tagModalFooter).attr("class", "modal-footer");
	$(parent).append(tagModalFooter);

	if (modalFooterButtons != null && modalFooterButtons.length > 0) {
		for (let j = 0; j < modalFooterButtons.length; j++) {
			var modalFooterButton = modalFooterButtons[j];
			var modalFooterButtonLabel = modalFooterButton.label;
			var modalFooterButtonOnClick = modalFooterButton.onclick;

			var tagModalFooterButton = document.createElement("button");
			$(tagModalFooterButton).attr("type", "button");
			$(tagModalFooterButton).attr("class", "btn btn-primary");
			$(tagModalFooterButton).text(modalFooterButtonLabel);
			$(tagModalFooterButton).click(modalFooterButtonOnClick);
			$(tagModalFooter).append(tagModalFooterButton);
		}
	}
}

//AJAX
self.GuestUI.ajaxRequests = {};
self.GuestUI.initAjax = function (ajax) {
	//Basics
	self.GuestUI.ajaxRequests.url = ajax.url;
	self.GuestUI.ajaxRequests.reqs = {};

	//Create the requests
	if (ajax.hasOwnProperty("reqs")) {
		for (let i = 0; i < ajax.reqs.length; i++) {
			var req = ajax.reqs[i];
			var reqType = (req.hasOwnProperty("type")) ? req.type : "ajax";

			if (reqType.trim().toLowerCase() == "datasource") {
				self.GuestUI.createAjax(req.id, req.url, req.params, "datasource", self.GuestUI.dataSourceRefreshed, self.GuestUI.dataSourceRefreshed);
			}
			else {
				var success = (req.hasOwnProperty("callbacks") && req.callbacks.hasOwnProperty("success")) ? req.callbacks.success : [];
				var error = (req.hasOwnProperty("callbacks") && req.callbacks.hasOwnProperty("error")) ? req.callbacks.error : [];
				self.GuestUI.createAjax(req.id, req.url, req.params, reqType, success, error);
			}
		}
	}

	//Initialize all data
	self.GuestUI.refreshDataSources();
}
self.GuestUI.createAjax = function (id, url, params, type, success, error) {
	//Create an entry into ajaxRequests
	var ajaxReq = {};
	ajaxReq.url = url;
	ajaxReq.params = params;
	ajaxReq.type = type;
	ajaxReq.callbacks = {
		success: [],
		error: []
	};

	//Success Callback
	if ((typeof success) == "function") {
		ajaxReq.callbacks.success.push(success);
	}
	else {
		ajaxReq.callbacks.success = success;
	}

	//Error Callback
	if ((typeof error) == "function") {
		ajaxReq.callbacks.error.push(error);
	}
	else {
		ajaxReq.callbacks.error = error;
	}


	self.GuestUI.ajaxRequests.reqs[id] = ajaxReq;
}
self.GuestUI.executeAjax = function (id) {
	if (self.GuestUI.ajaxRequests.reqs.hasOwnProperty(id)) {
		var ajaxUrl = (self.GuestUI.ajaxRequests.reqs[id].hasOwnProperty("url") && self.GuestUI.ajaxRequests.reqs[id].url != null) ? self.GuestUI.ajaxRequests.reqs[id].url : self.GuestUI.ajaxRequests.url;
		var ajaxData = ((typeof self.GuestUI.ajaxRequests.reqs[id].params) == "function") ? self.GuestUI.ajaxRequests.reqs[id].params() : self.GuestUI.ajaxRequests.reqs[id].params;
		var ajaxDataCopy = {};
		ajaxDataCopy = Object.assign(ajaxDataCopy, ajaxData);

		if ((typeof ajaxDataCopy.parameters) == "function") {
			ajaxDataCopy.parameters = JSON.stringify(ajaxDataCopy.parameters());
		}

		//Send request
		$.ajax(
			{
				type: "POST",
				crossdomain: true,
				url: ajaxUrl,
				data: JSON.stringify(ajaxDataCopy),
				error: [
					function (qXHR, textStatus, errorThrown) {
						//Alert
						alert("Error with request, please check Unity Console/Log");

						//Trigger any callbacks
						if (self.GuestUI.ajaxRequests.reqs[id].hasOwnProperty("callbacks") && self.GuestUI.ajaxRequests.reqs[id].callbacks.hasOwnProperty("error")) {
							for (let i = 0; i < self.GuestUI.ajaxRequests.reqs[id].callbacks.error.length; i++) {
								self.GuestUI.ajaxRequests.reqs[id].callbacks.error[i](id);
							}
						}
					}],
				success: [
					function (data) {
						if (data.error) {
							self.GuestUI.ajaxRequests.reqs[id].respData = data.errorText;

							//Trigger any callbacks
							if (self.GuestUI.ajaxRequests.reqs[id].hasOwnProperty("callbacks") && self.GuestUI.ajaxRequests.reqs[id].callbacks.hasOwnProperty("error")) {
								for (let i = 0; i < self.GuestUI.ajaxRequests.reqs[id].callbacks.error.length; i++) {
									self.GuestUI.ajaxRequests.reqs[id].callbacks.error[i](id);
								}
							}
						}
						else {
							//Set data
							if (data.dataFormat == "json") {
								self.GuestUI.ajaxRequests.reqs[id].respData = JSON.parse(data.data);
							}
							else if (data.dataFormat == "string") {
								self.GuestUI.ajaxRequests.reqs[id].respData = data.data;
							}

							//Trigger any callbacks
							if (self.GuestUI.ajaxRequests.reqs[id].hasOwnProperty("callbacks") && self.GuestUI.ajaxRequests.reqs[id].callbacks.hasOwnProperty("success")) {
								for (let i = 0; i < self.GuestUI.ajaxRequests.reqs[id].callbacks.success.length; i++) {
									self.GuestUI.ajaxRequests.reqs[id].callbacks.success[i](id);
								}
							}
						}
					}]
			});
	};
}

//Datasources
self.GuestUI.refreshDataSources = function () {
	for (var reqId in self.GuestUI.ajaxRequests.reqs) {
		self.GuestUI.refreshDataSource(reqId);
	}
}
self.GuestUI.refreshDataSource = function (reqId) {
	if (self.GuestUI.ajaxRequests.reqs.hasOwnProperty(reqId) && self.GuestUI.ajaxRequests.reqs[reqId].type == "datasource") {
		self.GuestUI.executeAjax(reqId);
	}
}
self.GuestUI.dataSourceRefreshed = function (id) {
	if (self.GuestUI.data.pages != null) {
		var pages = self.GuestUI.data.pages;
		for (let i = 0; i < pages.length; i++) {
			var page = pages[i];

			//Main Contents
			self.GuestUI._refreshDataSourceContents(page, id);

			//Modals
			var modals = page.modals;
			if (modals != null) {
				for (let j = 0; j < modals.length; j++) {
					var modal = modals[j];
					self.GuestUI._refreshDataSourceContents(modal, id);
				}
			}
		}
	}
}
self.GuestUI._refreshDataSourceContents = function (contentHolder, dataSourceId) {
	var contents = contentHolder.contents;
	if (contents != null) {
		for (let j = 0; j < contents.length; j++) {
			var rows = contents[j].rows;
			if (rows != null) {
				for (let k = 0; k < rows.length; k++) {
					var rowsK = rows[k];
					for (let l = 0; l < rowsK.length; l++) {
						if (rowsK[l].dataSource == dataSourceId) {
							if (self.GuestUI.ajaxRequests.reqs[dataSourceId].hasOwnProperty("respData")) {
								switch (rowsK[l].type) {
									//Table
									case "table":
										{
											//Reset the data
											var table = $("#" + rowsK[l].id).DataTable();
											table.clear();
											table.rows.add(self.GuestUI.ajaxRequests.reqs[dataSourceId].respData).draw();
											break;
										}
									//Dropdown
									case "dropdown":
										{
											self.GuestUI.updateDropdownOptions(rowsK[l].id, self.GuestUI.ajaxRequests.reqs[dataSourceId].respData);
											break
										}
									//Multiselect
									case "multiselect":
										{
											self.GuestUI.updateMultiSelectOptions(rowsK[l].id, self.GuestUI.ajaxRequests.reqs[dataSourceId].respData);
											break;
										}
								}
							}
						}
					}
				}
			}
		}
	}
};