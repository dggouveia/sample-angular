// Variáveis globais (sem acesso no documento HTML no escopo deste controlador)
var imgElement = $('#cardImage');

// Instanciando o controlador
angular.module('myApp').controller('MainController', [
  // Solicitando injeção de dependências
  '$scope', '$http', function ($scope, $http) {
    $scope.message = "Digite um CEP para iniciar sua busca",
    $scope.query = "",
    $scope.imagePath = "img/index-bg.jpg",
    // Criando método de busca
    $scope.search = function (data) {
      imgElement.addClass('hide');
      // Buscando CEP pelo IBGE
      $http.get("https://viacep.com.br/ws/" + $scope.CEP + "/json/")
      .then(
        // Função caso a requisição seja bem sucedida
        function (data) {
          request = {
            query: data.data.localidade
          }
          service.textSearch(request, callback);
          $scope.message = "Você pesquisou por " + data.data.localidade
        },
        // Função caso a requisição seja má sucedida
        function (data) {

          // Setando a o valor do campo do formulário à busca
          request = {
            query: $scope.query
          }
          // Fazendo a busca com o valor do formulário
          googlePlacesService.textSearch(request, function (results, status) {
            // Verificando se há locais que correspondem à busca
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              // Iterando sobre os locais correspondentes
              for (var i = 0; i < results.length; i++) {
                // recuperando o local
                var place = results[i];
                console.log(place);
                // Desenhando o mapa com as informações do local
                createMarker(place);
                googlePlacesService.getDetails(
                  {
                    placeId: place.place_id
                  }
                  , handlePlaceDetails
                );
              }
            }
          });
          $scope.message = "Realizar nova busca"
        }
      );
    };
    // Função para receber resultado da busca detalhada no google places
    function handlePlaceDetails(data, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        console.log(data);
        $scope.imagePath = data.photos[Math.floor((Math.random() * 10 % data.photos.length))].getUrl({'maxWidth': 500, 'maxHeight': 300});
        $scope.message = data.formatted_address;
        imgElement.on('load',function(){imgElement.removeClass('hide')})
      } else {
        console.log("erro")
        console.log(data);
      }
    }
  }
]);
