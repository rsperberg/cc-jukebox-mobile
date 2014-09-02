//No unused  Built on jquery

// holds the name of our tab button container for selection later in the function
var tabsContainer = '.user-profile-tabs-container';
function selectTabHandler(event) {
   'use strict';
   var $tab = $(this);
   $(tabsContainer + ' li').removeClass('active');
   $tab.parent().addClass('active');
   var selectedTabName = $tab.attr('href');
//   alert(selectedTabName);
   $('.tab-pane').addClass('hidden');
   $(selectedTabName).removeClass('hidden');
   event.preventDefault();
}
if (document.URL.match(/\/profile.html/)) {
   $(document).ready(function tabsClick() {
      var $tabs = $(tabsContainer + ' a');
      $tabs.click(selectTabHandler);
      $tabs[0].click();
   });
}
