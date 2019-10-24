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
		// $('.popup_in_your_face-youtube').click(function(){
		// 		console.log('ok');
		// });

		 $('.popup-youtube, .popup-vimeo, .popup-gmaps, .popup_in_your_face-youtube').magnificPopup({
        //disableOn: 700,
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false
    });

	});

			    // Override: added original clases to this popup init function as this was effecting the existing videos
    // $('.popup-youtube, .popup-vimeo, .popup-gmaps, .popup_in_your_face-youtube').magnificPopup({
    //     //disableOn: 700,
    //     type: 'iframe',
    //     mainClass: 'mfp-fade',
    //     removalDelay: 160,
    //     preloader: false,
    //     fixedContentPos: false
    // });
})(jQuery);



