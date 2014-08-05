$(document).ready(function() {
   $('.hero-content h3').click(function(){
      var subText = $(this).text();
      $(this).text(subText + '!');
   });

   /* Added for checkpoint 26  */
$('.hero-content h3').hover(function(){
      $(this).css('color','red');
   });

   var onHoverAction = function(event) {
     console.log('Hover action triggered.');
     $(this).animate({'margin-top': '20px'});
   };

   var offHoverAction = function(event) {
     console.log('Off-hover action triggered.');
     $(this).animate({'margin-top': '0px'});
   };

$('.selling-points .point').hover(onHoverAction, offHoverAction);
/* Added for checkpoint 26  */
$('.selling-points .point h5').click(function() {
  console.log('Clicking.');
  $(this).css('font-size', '24pt');
});

/* Added for checkpoint 26  */
$('.logo ').click(function() {
  $(this).fadeOut(2000);
});
});
