// Variáveis globais (sem acesso no documento HTML no escopo deste controlador)
var imgElement = $('#cardImage');
var progressBar = $("#progressBar");

// Instanciando o controlador
angular.module('myApp').controller('MainController', [
  // Solicitando injeção de dependências
  '$scope', '$http', function ($scope, $http) {
    $scope.message = "Digite um CEP para iniciar sua busca",
    $scope.query = "",
    $scope.imagePath = "img/index-bg.jpg",
    $scope.imageAuthor = "",
    // Criando método de busca
    $scope.search = function (data) {
      progressBar.removeClass('hide');
      imgElement.addClass('hide');
      var request = {};
      // Buscando CEP pelo IBGE
      $http.get("https://viacep.com.br/ws/" + $scope.query + "/json/")
      .then(
        // Função caso a requisição seja bem sucedida
        function (data) {
          request = {
            query: data.data.localidade
          }
          googlePlacesService.textSearch(request, handleResults);
        },
        // Função caso a requisição seja má sucedida (busca no google)
        function (data) {
          // Setando o valor do campo do formulário à busca
          request = {
            query: $scope.query
          }
          googlePlacesService.textSearch(request, handleResults);
        });
      };

      // Método que desenha mapa
      function createMarker(place) {
        var placeLoc = place.geometry.location;

        map = new google.maps.Map(document.getElementById('map'), {
          center: placeLoc,
          zoom: 15
        });
      }

      // Trata os resultados da busca no Google Places
      function handleResults (results, status){
        // Verificando se há locais que correspondem à busca
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          // Iterando sobre os locais correspondentes
          for (var i = 0; i < results.length; i++) {
            // recuperando o local
            var place = results[i];
            $scope.message = place.formatted_address;
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
      };
      // Função para receber resultado da busca detalhada no google places
      function handlePlaceDetails(data, status) {
        // Recomendação do Google para que trate o status da resposta
        // Mais detalhes
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          console.log(data);
          try{
            // Setando uma imagem aleatório para card
            photo = data.photos[Math.floor((Math.random() * 10 % data.photos.length))];
            $scope.imagePath = photo.getUrl({'maxWidth': 500, 'maxHeight': 300});
            $scope.imageAuthor = photo.html_attributions
            // Método para atualizar a visão
            // Normalmente não é necessário, porém, como acontecem muitas chamadas assíncronas
            // Faz-se necessário informar o Angular quando será necessário atualizar
            // Mais detalhes em: http://jimhoskins.com/2012/12/17/angularjs-and-apply.html
            $scope.$apply();
            // Quando a imagem carregar, torna-a vizível
            imgElement.find('img').on('load',function(){
              imgElement.removeClass('hide');
            })
          }catch (err){
            // Caso o local não possua imagens, uma execeção será lançada
            console.log('O local não dispõe de imagens');
          }finally{
            progressBar.addClass('hide');
          }
        } else {
          console.log("erro")
          console.log(data);
        }
      }
    }
  ]);
