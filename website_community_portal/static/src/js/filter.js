odoo.define('website_community_portal.website_community_portal_filter', function (require) {
"use strict";
var ajax = require('web.ajax');
$(document).ready(function () {
	
	$( "#filter" ).on( "click", function(e) {
		e.preventDefault();
		$('#filter_view').show();
	});
	
	$('#submit').on( "click", function(e) {
		e.preventDefault();
		ajax.jsonRpc("/filter_user", 'call', {
			'gender':$('input[name=radioName]:checked').val(),
			'marital':$('#m_status :selected').val(),
			'body_type':$('#body_type :selected').val(),
			'work_with':$('#work_with :selected').val(),
			'annual_income':$('#annual_income :selected').val(),
			'skin_tone':$('#skin_tone :selected').val(),
		}).done(function(data){
			$('.o_connected_user').html(data);
		});
		$('#filter_view').hide()
	});
	$('#close').on( "click", function(e) {
		e.preventDefault();
		$('#filter_view').hide()
	})
});
});