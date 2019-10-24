//import '../sass/noncritical/style.scss';

require('./vendor/jquery.validate.js');
require('./vendor/custom-validate.js');
require('./vendor/jquery.mask.min.js');
require('./vendor/input-mask.js');
require('./vendor/jquery.uspslookup.js');
require('./vendor/bootstrap.min.js');
require('./vendor/bootstrap/transition.js');
require('./vendor/bootstrap/collapse.js');
require('./vendor/magnific-popup.js');

(function($) {
    $(function() { //ready statement
       	stateCampus();
        /** Video Popup - depn: magnific-popup.js **/
        $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false
        });

        /** RFI form scroll **/
        $('a[href="#rfi"]').click(function() {
            var topOffset = $(this).data('offset');
            $('html, body').animate({ scrollTop: $('#rfi').offset().top - topOffset }, 'slow');
        });

        /** Phone and Zipcode Input mask - depn: jquery-mask.min.js **/
        $("#phone").mask('(000) 000-0000', { placeholder: "(___) ___-____" });
        $("#zip").mask('00000', { placeholder: "_____" });

        /** Addition validation method to check if phone number starts with 1 - depn: jquery.validate.js*/
        $.validator.addMethod("checkforone", function(value, element) {
            return this.optional(element) || !(/^(\([01])(.{12})$/.test(value));
        }, "Please enter valid US number e.g. 212 555 1212");

        /* RFI validation - depn: jquery.validate.js*/
        $('.wpcf7-form').validate({
            rules: {
                program: {
                    required: true
                },
                campus: {
                    required: true
                },
                fname: {
                    required: true
                },
                lname: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                },
                phone: {
                    required: true,
                    minlength: 14,
                    maxlength: 14,
                    checkforone: true
                },
                zip: {
                    required: true,
                    minlength: 5,
                    maxlength: 5
                },

                graduation_year: {
                    required: true
                },
                is_cell: {
                    required: true
                },
                address: {
                    required: true
                },
                city: {
                    required: true
                },
                state: {
                    required: true
                }
            },

            messages: {
                program: "This field is required.",
                campus: "This field is required.",
                fname: {
                    required: "Please specify"
                },
                lname: "Please specify",
                email: "Please provide a valid email addresss.",
                phone: {
                    required: "Please specify",
                    minlength: "Please enter valid US number e.g. 212 555 1212",
                    maxlength: "Please enter valid US number e.g. 212 555 1212",
                    checkforone: "Please enter valid US number e.g. 212 555 1212"
                },
                zip: "Please provide a valid zip code.",
                is_cell: "Please specify",
                graduation_year: "This field is required",
                address: "This field is required",
                city: "This field is required",
                state: "This field is required"
            },

            submitHandler: function(form) {
                form.submit();
            }
        });
        //TOC checkbox logic
        $("input[name='is_cell']").change(function() {
            if ($(this).val() == 'Yes') {
                $("#toc-checkbox").show();
            }
            if ($(this).val() == 'No') {
                var tocCheckbox = $("input[name*='toc']")[0];
                $(tocCheckbox).prop('checked', false);
                $("#toc-checkbox").hide();
            }
        });
        // Dynamic select option group
        //initialize the otpion groups
        OptionInit();


        programInitialState = $('select#program').html();
        campusInitialState = $('select#campus').html();
        // console.log("program = " + programInitialState);
        // console.log("campus = " + campusInitialState);
				// $('#the-main-rfi-form select').on('change', function(){
				// $("#the-main-rfi-form form").validate().element('select');
				// });
        // Dynamic select
        $('select#program, select#campus').change(function() {
            var terms = ['campus', 'program'];
            var select = $(this).attr('id');
            var term = (select == 'campus' ? 'program' : 'campus');
            // console.log("terms " + terms);
            // console.log("term " + term);
            // console.log("select > " + select);
            // If select only has 1 option just return
            if ($('#' + term + ' option').length <= 1) {
                // console.log("yeah");
                return;
            }

            var value = $(this).val();
            // call the function to clear validation marker
            Optionselected(select);
            // console.log("value:: " + value);
            // console.log('ajax called:: '+ajax_object.ajax_url);
            $.ajax({
                url: ajax_object.ajax_url,
                data: {
                    action: 'populate_selects',
                    security: ajax_object.security,
                    select: select,
                    term: term,
                    value: value
                },
                type: 'POST',
                dataType: 'json'
            }).done(function(data) {

                // console.log('ajax done:: ');
                if (data['campus']['values']) {
                    // console.log(':::: campuses:: '+data['campus']['values']);
                }
                if (data['program']['values']) {
                    // console.log(':::: programs:: '+data['program']['values']);
                }

                // if (!('status' in data) || ('status' in data && data['status'] == false)) {
                // 	 return;
                // }
								// 								if ("select : " + $("select[name='program'] option:selected").index() != "0"){
								// 	 $("#the-main-rfi-form form").validate().element('#program');
								//  }
								//  if ("select : " + $("select[name='campus'] option:selected").index() != "0"){
								// 	 $("#the-main-rfi-form form").validate().element('#campus');
								//  }
                // console.log("what the " + JSON.stringify(data));
                //
                terms.forEach(function(val) {
                    if (!data[val].values.length == 0) {
                        // console.log('the val ' + val);
                        // Term (other ID), get selected value
                        var selected_value = $('#' + val + ' option:selected').val();
                        // console.log("selected_value: "+selected_value);
                        // Remove all <option>s but the first
                        var first = $('#' + val + ' option:first');
                        $('#' + val).empty().append(first);
                        //var firsty = JSON.stringify(first);
                        // console.log("setting this " + '#' + val + ' ' + first.html() + ' : ');
                        // Inject new ones based off of 'data' variable

                        data[val].values.forEach(function(value, key) {
                            var sel = '';
                            // Set the one as selected
                            if (data[val].values.length === 1) {
                                sel = " selected";
                                // console.log("select: " + sel);
                            } else if (value == selected_value) {
                                sel = " selected";
                                // console.log("match select " + sel);

                            }
                            $('#' + val).append('<option value="' + value + '"' + sel + '>' + data[val].labels[key] + '</option>');
                        });
												// console.log("select: " + select);
												// console.log("terms: " + term);
												// console.log("value = " + value);
												// console.log("val: " + val);

												 //
                        if (value == '') {
                            $('#' + val).val('');
                            $('#' + val).removeClass('valid');
                        }
												// console.log("select program : " + $("#the-main-rfi-form form #program").selectedIndex);
												// console.log("select campus : " + $("#the-main-rfi-form form #campus").selectedIndex);

											// console.log("select : " + $("select[name='program'] option:selected").index());
												// $("#the-main-rfi-form form").validate().element('#program');
												// $("#the-main-rfi-form form").validate().element('#campus');
												if ($('#' + select).val() != ''){
													$("#the-main-rfi-form form").validate().element('#' + select);
												}
												if ($('#' + val).val() != ''){
													$("#the-main-rfi-form form").validate().element('#' + val);
												}
                    }
                });
            }).fail(function(e) {
                $.each(e, function(index, val) {

                    //	console.log("index|val:  "+index + ': ' + val);

                });

            }).always(function() {
                OptionInit();
                //		console.log( "ajax complete" );
            });
        });
				//
				$("#the-main-rfi-form form select[name='graduation_year']").change(function(){
					// console.log("ok : " + $("#the-main-rfi-form form select[name='graduation_year']").val());
					if ($("#the-main-rfi-form form select[name='graduation_year']").val() != ''){
						$("#the-main-rfi-form form").validate().element($("select[name='graduation_year']"));
					} else {
						$("#the-main-rfi-form form select[name='graduation_year']").removeClass('valid');
					}
				});

        //Analytics dataLayer
        window.dataLayer = window.dataLayer || [];
        var headerRfiBtn = $(".navbar-cta--request a");
        var floatingRfiBtn = $(".mobile-cta--request a");
        var floatingPhoneBtn = $(".mobile-cta--phone a");
        var aosBtn = $(".area-of-study .button-link a");
        var campusLink = $('div[id*="campuses"] .panel-body ul li a');

        $(headerRfiBtn).click(function() {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'requestInformationButton'
            });
        });
        $(floatingRfiBtn).click(function() {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'floatingBarRequest'
            });
        });
        $(floatingPhoneBtn).click(function() {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'floatingBarPhone'
            });
        });
        $(aosBtn).click(function() {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'areaOfStudy',
                'areaOfStudy': $(this).text()
            });
        });
        $(campusLink).click(function() {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                'event': 'areaOfStudy',
                'areaOfStudy': $(this).text()
            });
        });
//
    //
    var pageVideo = $('.teaser-media:first a').attr('href');
    if (pageVideo != null) {
        $('#videoLink a').attr('href', pageVideo);
    }

    // $('.teaser-media:')
    // Override: added original clases to this popup init function as this was effecting the existing videos
    $('.popup-youtube, .popup-vimeo, .popup-gmaps, .popup_in_your_face-youtube').magnificPopup({
        //disableOn: 700,
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false
    });
    //
    //
    $('.mobile-cta--request a').click(function() {
        if (!$('div.modal-background').hasClass("active")) {
            $('.rfi-form-wpr').toggleClass('active');
            $('.modal-background').toggleClass('active');
        }
    });

    $('.navbar-cta--request a').click(function() {
        $('.rfi-form-wpr').toggleClass('active');
        $('.modal-background').toggleClass('active');
    });
    $('.modal-background').click(function() {
        $('.rfi-form-wpr').toggleClass('active');
        $('.modal-background').toggleClass('active');
    });

		$('.mobile-cta--request').click(function() {
			$('#menuToggle input:checkbox').prop('checked',(value = 0));
		})
    });

    function Optionselected(selectedmenu) {
        // console.log("this selected menu " + selectedmenu);
        var selectedmenuval = $('#' + selectedmenu).val();
        // console.log("o " + selectedmenu + " value: " + selectedmenuval);
        if (!selectedmenuval) {
            $('#' + selectedmenu).removeClass('valid');
            if (selectedmenu === 'program') {
                $('#program').empty().append(programInitialState);
            } else if (selectedmenu === 'campus')
                $('#campus').empty().append(campusInitialState);
        }
    }

    function OptionInit() {
        //	console.log('OptionInit called');
        $('#program option:last').after('<option value="">endoptgroup</option>');
        // $('#program option:first').val("");
        // $('#campus option:first').val("");
        //
        var foundin = $('#program option:contains("-- ")');
        //
        $.each(foundin, function(value) {
            if (value !== 0) {
                $(this).before('<option value="">endoptgroup</option>');
                // console.log("o");
            }
        });
        OptionGroping();
        //
    }

    function OptionGroping() {
        // console.log("OptionGroping Callesd ");
        var optionin = $('#program option:contains("-- ")');
        $.each(optionin, function(value) {

            var updated = $(this).text().replace('-- ', '').replace(' --', '');
            //  var label = $(this).text()
            //  var update = $(this).text(label.replace('--',''));

            // console.log("this " + updated);
            $(this).nextUntil('option:contains("endoptgroup")').wrapAll('<optgroup label="' + updated + '"></optgroup>');
        });
        $('#program option:contains("-- ")').remove();
        $('#program option:contains("endoptgroup")').remove();
        // $('#program option:first').prop({disabled:true, selected:true});
        // $('#program option:first').attr('value','Choose your program');
        // $('#campus option:first').prop({disabled:true, selected:true});
        // $('#campus option:first').attr('value','Choose campus');
    }

    function stateCampus() {
        var pathname = window.location.pathname;
        if (pathname.indexOf("-campuses") >= 0) {
            var updatedcampusstate = pathname.replace('-campuses/', '').replace('/', '').replace('-', ' ').replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
            var campusOption = 'Choose a ' + updatedcampusstate + ' campus';
            $('#campus option:first-child').html(campusOption);
        }
    }


})(jQuery);
