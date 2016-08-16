// анимация кнопок и inpit fields
var CssSelector = {

            buttons : {
                Up : '.up-button',
                Refresh: '.refresh-button',
                closeCompany: '.close-button',
                eraseCompanySearch: '.erase-search-button',
                OpenCompanySelection: '.company-selector',
                OpenDivisionSelection: '.divisionTH',

            },    

            inputfields : {
                Users : '.filter2',
                Division : '.filter1',
                Company : '.filter'
            },

            block : {
                selectCompany: '.selection',
                selectDivision: '.selection-division',
                selectCompanyFull: '.selection-active',
                listItem: '.list-item',
                divisionItem : '.division-item',
                divisionContainer: '.division-container',
                tableHeader: '.table-header'
            },
  };

var timerId; // таймер выполнения запроса на сервер

function scrollUp () {
  $("body, html").animate({
      scrollTop: 0
    }, 100);
 };

function checkKeyCode(event) {
  var result;
  if ((event.keyCode >= 65 && event.keyCode <= 90) || event.keyCode === 32 || event.keyCode === 13 || event.keyCode === 8) {
    result = true;
   }
   else result = false;
  return result;
}

$(document).ready(function() {

var upButton = (function () {
      var returnPosition;
      $(CssSelector.buttons.Up).click(function(event) {
        if ($(document).scrollTop() !== 0){
         returnPosition = $(document).scrollTop();
         scrollUp();
       }
         else {
          $('body, html').animate({
            scrollTop: returnPosition
          }, 100);
         }
      });
    }());

var upButtonAnimation = (function () {
        $(window).scroll(function(event) {
        if ($(document).scrollTop() === 0){
            $(CssSelector.buttons.Up).addClass('down-button');
         }
            else {
            $(CssSelector.buttons.Up).removeClass('down-button');
           }
        });
    }());

var eraseCompanySearch = (function () {
       $(CssSelector.buttons.eraseCompanySearch).click(function(event) {
            $(CssSelector.inputfields.Company).val('');
            FiltersParam.companySearchvalue = '';
            buildCompanyList();
        });
    }());

var closeCompany = (function () {
      $(CssSelector.buttons.closeCompany).click(function(event) {
         closeCompanySelection();
      });
   }());

var companySelectButton = (function () {
    $(CssSelector.buttons.OpenCompanySelection).click(function(event) {
         if (!QueryStatus.companyQueryComplete){
           buildCompanyList();
           showCompanySelection();
         }
         else {
           showCompanySelection();
         }
       });
   }());

var refreshUserListButton = (function () {
    $(CssSelector.buttons.Refresh).click(function(event) {
        $(CssSelector.buttons.Refresh).find('i').addClass('refresh-button-active');
        setTimeout(function() {
        	$(CssSelector.buttons.Refresh).find('i').removeClass('refresh-button-active');
        }, 1500);
            FiltersParam.refreshAll();
            //$(CssSelector.buttons.OpenCompanySelection).html('Выберите компанию');
            startLoading();
            buildUsersList();
            QueryStatus.companyQueryComplete = false;
         });
    }());

var usersInput = (function () {
        $(CssSelector.inputfields.Users).keyup(function(event) {
         
              var notValidChar = /[0-9[!#$%&*"+,.\/:-@\[-`{-~№]+/g;
                  this.value = this.value.replace(notValidChar, '');

              var value = $(this).val();
              var checkInput = checkKeyCode(event);

              clearTimeout(timerId);

              if (checkInput) {
                  timerId = setTimeout(function () {
                        FiltersParam.usersSearchvalue = value;
                        buildUsersList();
                  }, 600);
              }

        });  
    }()); 

var companyInput = (function () {
        $(CssSelector.inputfields.Company).keyup(function(event) {

              var notValidChar = /[0-9[!#$%&*"+,.\/:-@\[-`{-~№]+/g;
                  this.value = this.value.replace(notValidChar, '');

              var value = $(this).val();
              var checkInput = checkKeyCode(event);

              clearTimeout(timerId);

              if (checkInput) {
                  timerId = setTimeout(function () {
                        FiltersParam.companySearchvalue = value;
                        buildCompanyList();
                  }, 600);
              }

        });   
    }()); 

var divisionButton = (function () {
    $(CssSelector.buttons.OpenDivisionSelection).click(function(event) {      
        $(CssSelector.block.divisionContainer).slideToggle(400);
      });

    $(CssSelector.block.divisionContainer).mouseleave(function(event) {
    	var result = $(CssSelector.block.divisionContainer).css('display');	
    	if (result === 'block') {
    		$(CssSelector.block.divisionContainer).slideToggle(400);
    	}
    });
    
 }());
    
});
