// Now unused.  Built on jquery

$(document).ready(function() {
   $('.hero-content h3').click(function h3Click() {
      var subText = $(this).text();
      $(this).text(subText + '!');
   });

   /* Added for checkpoint 26  */
$('.hero-content h3').hover(function h3Hover() {
      $(this).css('color','red');
   });

   function onHoverAction(event) {
//     console.log('Hover action triggered.');
     $(this).animate({'margin-top': '20px'});
   }

   function offHoverAction(event) {
//     console.log('Off-hover action triggered.');
     $(this).animate({'margin-top': '0px'});
   }

$('.selling-points .point').hover(onHoverAction, offHoverAction);
/* Added for checkpoint 26  */
$('.selling-points .point h5').click(function h5Click() {
//  console.log('Clicking.');
  $(this).css('font-size', '24pt');
});

/* Added for checkpoint 26  */
$('.logo ').click(function logoClick() {
  $(this).fadeOut(2000);
});
});
