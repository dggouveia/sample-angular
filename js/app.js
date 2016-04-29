// Iniciando a aplicação angular
var app = angular.module('myApp', ['ngMaterial', 'ngRoute']);

// Filtro para retornar código HTML a partir de variável do controlador
app.filter("htmlCode", ['$sce', function ($sce){
  return function (htmlCode){
    return $sce.trustAsHtml(htmlCode);
  }
}])
