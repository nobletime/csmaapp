
$(document).ready(function () {

let	editor = new $.fn.dataTable.Editor({
		ajax: "/user-list",
		table: "#autocheck-user-table",
		fields: [{
			label: "Username:",
			name: "username"
		}, {
			label: "Email:",
			name: "email"
		},
		 {
			label: "Type:",
			name: "type"
		},
		{
			label: "Credits:",
			name: "credits"
		},
		{
			label: "Created Date:",
			name: "created_date",
			type: "datetime",
			format: 'MM/DD/YYYY'
		},
		{
			label: "Active:",
			name: "active",
			type: "select",
			options: [
				{ label: "Yes", value: "Yes" },
				{ label: "No", value: "No" },
			]
		},{
			label: "Promo code:",
			name: "promocode"
		},

		],
		// formOptions: {
		// 	inline: {
		// 		onBlur: 'submit'
		// 	}
		// }
	});


	// editor.on( 'preSubmit', function ( e, o, action ) {
	// 	debugger;
	// 	if ( action !== 'remove' ) {
	// 		if ( o.data[0].First_Name === '' ) {
	// 			document.getElementById('DTE_Field_First_Name').style.backgroundColor = 'pink';
	// 			this.error('First_Name', 'A first name must be given');
	// 			return null;
	// 		} else if ( o.data[0].Last_Name === '' ) {
	// 			document.getElementById('DTE_Field_Last_Name').style.backgroundColor = 'pink';
	// 				this.error('Last_Name', 'A last name must be given');
	// 				return null;
	// 			} else if ( o.data[0].Patient_Id === '' ) {
	// 				document.getElementById('DTE_Field_Patient_Id').style.backgroundColor = 'pink';
	// 				this.error('Patient_Id', 'A patient Id must be given');
	// 				return null;
	// 			}
	// 		}
	// 	}
	// );

let	table = $('#autocheck-user-table').DataTable({
		dom: "Bfrtip",
		ajax: "/user-list",
		"pageLength": 50,
		columns: [
			// {
			//     data: null,
			//     defaultContent: '',
			//     className: 'select-checkbox',
			//     orderable: false
			// },
			{ data: "username" },
			{ data: "email", "defaultContent": "" },
			{ data: "type", "defaultContent": "" },
			{ data: "credits", "defaultContent": "" },
			{ data: "created_date", "defaultContent": "" , render: function (data, type, row) {
				return moment(new Date(row.created_date)).format("MM/DD/YYYY");
			}},
			{ data: "active", "defaultContent": "Yes" },
			{ data: "promocode", "defaultContent": "" },
		],
		order: [0, 'asc'],
		keys: {
			columns: ':not(:first-child)',
			keys: [9],
			editor: editor,
			editOnFocus: false
		},
		select: {
			style: 'os',
			selector: 'td:first-child'
		},
		buttons: [
			// { extend: "create", editor: editor },
			{ extend: "edit", editor: editor },
			{ extend: "remove", editor: editor }
		],
		// formOptions: {
		// 	inline: {
		// 		onBlur: 'submit'
		// 	}
		// }
	});

	// $('#clinic-list-table tbody').on( 'click', 'tr', function () {
	//     if ( $(this).hasClass('selected') ) {
	//         $(this).removeClass('selected');
	//     }
	//     else {
	//         table.$('tr.selected').removeClass('selected');
	//         $(this).addClass('selected');
	//     }
	// } );


	// $('#clinic-list-table').on('click', 'tbody td:not(:first-child)', function (e) {
	// 	editor.inline(this);
	// });

	//	$('#clinic-list-table').off( 'click', 'tbody td:not(:first-child)' );

	editor.on('preSubmit', function (e, datacontent, action) {
		if (action == "edit") {
			datacontent.data =	JSON.stringify(datacontent.data)
		}
	})

	let editorPromo = new $.fn.dataTable.Editor({
		ajax: "/promo-list",
		table: "#promo-table",
		fields: [{
			label: "Promocode:",
			name: "promocode"
		},
		{
			label: "Credits:",
			name: "credits",
			def: 5
		}
		],
		// formOptions: {
		// 	inline: {
		// 		onBlur: 'submit'
		// 	}
		// }
	});

let	tablePromo = $('#promo-table').DataTable({
		dom: "Bfrtip",
		ajax: "/promo-list",
		"pageLength": 15,
		columns: [
			// {
			//     data: null,
			//     defaultContent: '',
			//     className: 'select-checkbox',
			//     orderable: false
			// },
			{ data: "promocode" },
			{ data: "credits",  "defaultContent": 5 },
		],
		order: [0, 'asc'],
		keys: {
			columns: ':not(:first-child)',
			keys: [9],
			editor: editorPromo,
			editOnFocus: false
		},
		select: {
			style: 'os',
			selector: 'td:first-child'
		},
		buttons: [
			{ extend: "create", editor: editorPromo },
			{ extend: "edit", editor: editorPromo },
			{ extend: "remove", editor: editorPromo }
		],
		// formOptions: {
		// 	inline: {
		// 		onBlur: 'submit'
		// 	}
		// }
	});

	
	// editorPromo.on('preSubmit', function (e, datacontent, action) {
	// 	if (action == "edit") {
	// 		datacontent.data =	JSON.stringify(datacontent.data)
	// 	}
	// })

});