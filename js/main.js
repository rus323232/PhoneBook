
var CssSelectorMain = {

	     companyColumn1: '.company-layout .column:eq(0)',
	     companyColumn2: '.company-layout .column:eq(1)',
	     companyColumn3: '.company-layout .column:eq(2)',
	     companyColumnAll : '.company-layout .column',
	     usersBaseTable : '.users-base',
	     divisionContainer : '.division-container ul'

    }, 

    FiltersParam = {

         selectedCompany : '' , 
         selectedDivision : '' ,
         usersSearchvalue : '' ,
         companySearchvalue : '' ,
         divisionSearchvalue : '',

         refreshAll: function () {
    	     this.selectedDivision = '';
    	     this.usersSearchvalue = '';
    	     this.companySearchvalue = '';
    	     this.divisionSearchvalue = '';
    	     $(CssSelector.inputfields.Users).val('');
    	     $(CssSelector.inputfields.Company).val('');
    	     $('.divisionTH').html('Выберите подразделение');
         },

         refreshDivision : function () {
    	     FiltersParam.selectedDivision = '';
    	     $(CssSelector.buttons.OpenDivisionSelection).html('Выберите подразделение');
         },

    },

    QueryStatus = {

         companyQueryComplete: false,
         divisionQueryComplete: false,
         usersQueryComplete: false
    };

//включение и отключение  анимации загрузки 
function startLoading() {
  $("#loading").addClass('loading-active');
}

function stopLoading() {
  $("#loading").removeClass('loading-active');     
}

//класс отвечаючий за получение Json файла с сервера
function QueryOnServer (url) {
	this.result;
	this.url = url;
	this.page = 1;
}

QueryOnServer.prototype.getResponseFromServer = function (param) {
    $.ajax({
          url: this.url,
          type: "GET",
          dataType: "JSON",
          async: false,
          data: {
            limit: param.limit || 100,
             company: param.company || FiltersParam.selectedCompany,
             division: param.division || FiltersParam.selectedDivision,
             search: param.search || '',
             page: this.page
          },
          success: function (data){
            QueryOnServer.prototype.result = data;
            stopLoading();
          }
    });    
}
QueryOnServer.prototype.getResult = function () {
    return this.result;
}
QueryOnServer.prototype.pageIteration = function (n) {
    n = n || 1;
    this.page += n;
}

function buildCompanyList () {
	var getCompany = new QueryOnServer("http://localhost:8080/list-company.json");
	getCompany.getResponseFromServer({
		limit: 9999,
		search: FiltersParam.companySearchvalue
	});

	var companyName = getCompany.getResult(),     //разбиваем Json на три части 
        companyNameSize = companyName.length,
        firstColumn = companyNameSize / 3,
        secondColumn = companyNameSize - (companyNameSize / 3);

    $(CssSelectorMain.companyColumnAll).find('li').detach();        // очищаем контейнер от результатов предыдущих запросов

    for (var i = 0; i < companyNameSize ; i++) {    // заполняем контейнер
      if (i <= firstColumn){
         $(CssSelectorMain.companyColumn1).append('<li class="list-item"><i>' +companyName[i].name+ '</i><br></li>');
         continue;
      }
      if (i <= secondColumn){
         $(CssSelectorMain.companyColumn2).append('<li class="list-item"><i>' +companyName[i].name+ '</i><br></li>');
         continue;
      }
         $(CssSelectorMain.companyColumn3).append('<li class="list-item"><i>' +companyName[i].name+ '</i><br></li>');
    }

    selectCompany();                          

    QueryStatus.companyQueryComplete = true;       // флаг завершенного запроса для предотваращения лишних обращений к серверу
}
 
function showCompanySelection() {
    if ( $(CssSelector.block.selectCompany).hasClass('selection-active') ) {
      closeCompanySelection();
  }
  else { 
    $(CssSelector.inputfields.Users).css('visibility', 'hidden');
    $(CssSelector.block.selectCompany).addClass('selection-active');
  }
}

function closeCompanySelection() {
    $(CssSelector.block.selectCompany).removeClass('selection-active');
    $(CssSelector.inputfields.Users).css('visibility', 'visible');
}

function selectCompany () {
    $(CssSelector.block.listItem).click(function (event) {

         FiltersParam.selectedCompany=$(this).find('i').html();

         $(CssSelector.buttons.OpenCompanySelection).html(FiltersParam.selectedCompany);

         $('.commonTH').css('display', 'none');
         $('.divisionTH').css('display', 'block');

         closeCompanySelection();

         FiltersParam.refreshDivision();

         buildUsersList();

         buildDivisionList();

         scrollUp();     
});
}

function buildDivisionList () {
	var getDivision = new QueryOnServer("http://localhost:8080/list-division.json");
	getDivision.getResponseFromServer({
        limit: 9999,
        company: FiltersParam.selectedCompany
	});

	var divisions = getDivision.getResult();
	$(CssSelectorMain.divisionContainer).empty();
    if (divisions.length !== 0) {
         for (var i = 0; i < divisions.length; i++) {
    	     $(CssSelectorMain.divisionContainer).append('<li class="division-item">' +divisions[i].name+ '</li>')
         };
    }
    else {
         $(CssSelectorMain.divisionContainer).append('Подразделения отсутствуют');
    } 

    selectDivision();

    QueryStatus.divisionQueryComplete = true;
}

function closeDivisionSelection() {
    $(CssSelector.block.divisionContainer).slideToggle(400);
}

function selectDivision () {
    $(CssSelector.block.divisionItem).click(function (event) {
            FiltersParam.selectedDivision=$(this).html();
            $(CssSelector.buttons.OpenDivisionSelection).html(FiltersParam.selectedDivision);       
            buildUsersList();
            scrollUp();
    });
}

function buildUsersList () {
   startLoading();

    var getUsers = new QueryOnServer ("http://localhost:8080/list-person.json");
	      getUsers.getResponseFromServer({
	            company: FiltersParam.selectedCompany,
              search: FiltersParam.usersSearchvalue,
              division: FiltersParam.selectedDivision,
	  });

    var users = getUsers.getResult();

    $(".updated-content").detach();

     for (var i = 0; i < users.length; i++) {
     $(CssSelectorMain.usersBaseTable).append('<tr class="updated-content">'
                                                  +'<td>' +users[i].name+ '</td>'
                                                  +'<td>' +users[i].title+ '</td>'
                                                  +'<td><a href="mailto:'+users[i].email+'">' +users[i].email+ '</a>'
                                                  +'<td>' +users[i].phone+ '</td>'
                                              +'</tr>');
    }

  //добавить следующую сотню при достижениии конца страницы
  $(window).scroll(function(event) {
    if($(window).scrollTop()+$(window).height()>=$(document).height()){
      startLoading();
      getUsers.pageIteration(1);
        if (users.length !== 0) {
           getUsers.getResponseFromServer({
             limit: 100,
             search: FiltersParam.usersSearchvalue,
           });
           users = getUsers.getResult();     
           for (var i = 0; i < users.length; i++) {
                 $(CssSelectorMain.usersBaseTable).append('<tr class="updated-content">'
                                                               +'<td>' +users[i].name+ '</td>'
                                                               +'<td>' +users[i].title+ '</td>'
                                                               +'<td><a href="mailto:'+users[i].email+'">' +users[i].email+ '</a>'
                                                               +'<td>' +users[i].phone+ '</td>'
                                                           +'</tr>');            
           }
        }
        else {
          stopLoading();
        };
     }
  });
  
}

jQuery(document).ready(function($) {
  buildUsersList();
});