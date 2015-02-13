/*
 * Copyright (c) 2013, Intel Corporation, Jaguar Land Rover
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
/*global Phone, callContactCarousel, GRID_TAB, LIST_TAB, loadTemplate, ko*/

/**
 * Class which provides methods to operate with contacts library which displays all contact information (name, phone number, photo) from paired device ordered by name. 
 * 
 * @class ContactsLibrary
 * @module PhoneApplication
 */
var ContactsLibrary = {
	currentSelectedContact : "",
	/**
	 * Method initializes contacts library.
	 * 
	 * @method init
	 */
	init : function() {
		"use strict";
		//$('#library').library("setSectionTitle", "PHONE CONTACTS");
		//$('#library').library("init");
		
		this.ContactTemplate = $("#ContactTemplate").clone();

		var tabMenuModel = {
			Tabs : [ {
				text : "CONTACTS A-Z",
				selected : true
			} ]
		};

		//$('#library').library("tabMenuTemplateCompile", tabMenuModel);

		//$('#library').bind('eventClick_GridViewBtn', function() {
		//	ContactsLibrary.showContacts();
		//});

		//$('#library').bind('eventClick_ListViewBtn', function() {
		//	ContactsLibrary.showContacts();
		//});

		//$('#library').bind('eventClick_SearchViewBtn', function() {
		//});

		//$('#library').bind('eventClick_menuItemBtn', function() {
		//	ContactsLibrary.showContacts();
		//});

		//$('#library').bind('eventClick_closeSubpanel', function() {
		//});

		//$("#alphabetBookmarkList").on("letterClick", function(event, letter) {
		//	console.log(letter);
		//	Phone.contactsAlphabetFilter(letter === "*" ? "" : letter);
		//});

		ContactsLibrary.showContacts();
	},
	/**
	 * Method unhides library page.
	 * 
	 * @method show
	 */
	show : function() {
		"use strict";
		//$('#library').library("showPage");
		$("#opencontactlist").addClass("visibility-hidden");
		$(".contact-list-wrapper").removeClass("visibility-hidden");
		$("#contactList").removeClass("hidden");
		$("#phone-keypad").addClass("hidden");
		$("#contactsCarousel").addClass("hidden");
	},
	/**
	 * Method hides library page.
	 * 
	 * @method hide
	 */
	hide : function() {
		"use strict";
		//$('#library').library("hidePage");
		$(".contact-list-wrapper").addClass("visibility-hidden");
		$(".contact-btn").removeClass("visibility-hidden");
		$("#contactList").addClass("hidden");
		$("#phone-keypad").removeClass("hidden");
		$("#contactsCarousel").removeClass("hidden");
	},
	/**
	 * Method opens contact detail.
	 * 
	 * @method openContactDetail
	 * @param contact
	 *            {Object} Object representing contact's information.
	 */
	openContactDetail : function(contact) {
		"use strict";
		if (!!contact) {
			ContactsLibrary.currentSelectedContact  = contact;
			var history = Phone.getCallHistoryByPersonId(contact.personId);
			var formattedContact = ContactsLibrary.initContactDetail(contact);
			formattedContact.history = history;
			ContactsLibrary.renderContactDetailView(formattedContact);
		} else {
			console.log("Supplied contact is null.");
		}
	},
	/**
	 * Method renders search view.
	 * 
	 * @method renderContactDetailView
	 * @param contact
	 *            {Object} Contact object.
	 */
	renderContactDetailView : function(contact) {
		"use strict";
		console.log("open contact called");
		var subpanelModel = {
			textTitle : "CONTACT",
			textSubtitle : contact.name || "Unknown",
			actionName : "BACK",
			action : function() {
				console.log("back clicked");
				ContactsLibrary.showContacts();
				ContactsLibrary.currentSelectedContact = "";
			}
		};
		//$('#library').library("subpanelContentTemplateCompile", subpanelModel);
		//$('#library').library("clearContent");
		//$('#library').library("setContentDelegate", "templates/libraryContactDetailDelegate.html");
		//$('#library').library("contentTemplateCompile", contact, "contactDetail", function() {
		//	$("#contactDetailMobileTitle").boxCaptionPlugin('initSmall', "MOBILE");
		//	$("#contactDetailEmailTitle").boxCaptionPlugin('initSmall', "EMAIL");
		//	$("#contactDetailAddressTitle").boxCaptionPlugin('initSmall', "ADDRESS");
		//});
	},
	Favorite : false,
	Letter: null,
	Search: null,
	/**
	 * Method which Searches a contact for the Search string and returns true if found.
	 * 
	 * @method contactString
	 */
	 contactSearch: function(contact) {
		 var i = 0;
		 var found = false;
		 for (x in contact.name) {
			 console.log("x",x,"contact.name[x]",contact.name[x],"Search",this.Search);
			 if ((x!="nicknames")&&(contact.name[x]!=null)&&(contact.name[x].toLowerCase().indexOf(this.Search.toLowerCase())>=0)) {
				 return true;
			 }
		 }
		 for (i = 0; i< contact.name.nicknames.length; i++) {
			 if (contact.name.nicknames[i].toLowerCase().indexOf(this.Search.toLowerCase())>=0) {
				 return true;
			 }
		 }
		 for (i = 0; i< contact.phoneNumbers.length; i++) {
			 if (contact.phoneNumbers[i].number.indexOf(this.Search)>=0) { 
				 return true;
			 }
		 }
		 return false;
	 }
	,
	/**
	 * Method which shows contacts in grid or list view.
	 * 
	 * @method showContacts
	 */
	showContacts : function() {
		"use strict";
		console.debug("show contacts called",Phone.contacts);
		var view = "";
		$("#contactList").empty();
		for (i = 0; i < Phone.contacts.length; i++) {
			var contact = this.ContactTemplate.clone();
			contact.attr("id","contact_"+i);
			if (Phone.contacts[i].isFavorite==true) {
				contact.addClass("Favorite");
			}
			console.log("showcontacts ",contact);
			//console.log("contacts.showContacts ",contact.find("[name='contactName']").text());
			contact.find("[name='contactName']").text(Phone.getDisplayNameStr(Phone.contacts[i]));
			if (this.Favorite) {
				if (Phone.contacts[i].isFavorite) { 
					contact.appendTo("#contactList");
				}
			} else if (this.Letter!=null) {
				if (Phone.getDisplayNameStr(Phone.contacts[i]).toLowerCase().startsWith(this.Letter.toLowerCase())) {
					contact.appendTo("#contactList");
				}
			} else if (this.Search!=null) {
				if (this.contactSearch(Phone.contacts[i])) {
					contact.appendTo("#contactList");
				} else {
					console.log("Filtered:",this.Search,Phone.contacts[i]);
				}
			} else {
				contact.appendTo("#contactList");
			}
			/*
			if (((Favorite) &&(Phone.contacts[i].isFavorite==true))||(!Favorite)) {
				if (Letter!=null) {
					if (Phone.getDisplayNameStr(Phone.contacts[i]).toLowerCase().startsWidth(Letter)) {
						contact.appendTo("#contactList");
					}
				} else if (Search!=null) {
						if (Phone.contacts[i].toString().indexOf(Search)>=0) {
							contact.appendTo("#contactList");
						}
				} else {
					contact.appendTo("#contactList");
				}
			}*/
			//$("#contectList").
		}
		/*
		switch ($('#library').library('getSelectetLeftTabIndex')) {
		case GRID_TAB:
			view = "contactsLibraryContentGrid";
			break;
		case LIST_TAB:
			view = "contactsLibraryContentList";
			break;
		default:
			view = "contactsLibraryContentList";
			break;
		}*/
		//$('#library').library('closeSubpanel');
		//$('#library').library("clearContent");
		//$('#library').library("changeContentClass", view);
		//loadTemplate("templates/", "template-contacts", function() {
			//var contactsElement = '<div data-bind="template: { name: \'template-contacts\', foreach: Phone.contacts }"></div>';
			//$(contactsElement).appendTo($('.' + view));
			//ko.applyBindings(Phone);
		//});
	},
	/**
	 * Method which initializes contact detail.
	 * 
	 * @method initContactDetail
	 * @param contact
	 *            {Object} Contact object.
	 */
	initContactDetail : function(contact) {
		"use strict";
		var tempContact = {
			id : "",
			name : "",
			phoneNumber : "",
			email : "",
			photoURI : "",
			address : "",
			isFavorite : false,
			history : []
		};

		if (!!contact) {
			var str = "";

			if (!!contact.uid) {
				tempContact.id = contact.uid;
			}

			if (!!contact.name) {
				tempContact.name = Phone.getDisplayNameStr(contact);
			}

			if (!!contact.phoneNumbers && contact.phoneNumbers.length && !!contact.phoneNumbers[0].number) {
				tempContact.phoneNumber = contact.phoneNumbers[0].number.trim();
			}

			if (!!contact.emails && contact.emails.length && !!contact.emails[0].email) {
				tempContact.email = contact.emails[0].email.trim();
			}

			if (!!contact.photoURI) {
				tempContact.photoURI = contact.photoURI.trim();
			}

			if (!!contact.addresses && contact.addresses.length) {
				str = !!contact.addresses[0].streetAddress ? contact.addresses[0].streetAddress.trim() + "<br />" : "";
				str += !!contact.addresses[0].city ? contact.addresses[0].city.trim() + "<br />" : "";
				str += !!contact.addresses[0].country ? contact.addresses[0].country.trim() + "<br />" : "";
				str += !!contact.addresses[0].postalCode ? contact.addresses[0].postalCode.trim() : "";

				if (str.toString().trim() === "") {
					str = "-";
				}

				tempContact.address = str.trim();
			}

			tempContact.isFavorite = contact.isFavorite;
		}
		return tempContact;
	}
};
