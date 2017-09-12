  var TriExpress = (function() {

      var carousel = $(".carousel");
      var getFilesApi = "/files";

      var _callGetFilesApi = function() {
          $.ajax({
              url: getFilesApi,
              data: {}
          }).done(function(data) {
              carousel.empty();

              if (data.resources.length > 0) {
                  var firstImage = $("<img>").attr("src", data.resources[0].path)
                      .addClass("current");
                  firstImage.appendTo(carousel);
              }

              if (data.resources.length > 1) {
                  var secondImage = $("<img>").attr("src", data.resources[1].path)
                      .addClass("next");
                  secondImage.appendTo(carousel);
              }
          });
      };

      var fetchResources = function() {
          _callGetFilesApi();
      };

      return {
          init: fetchResources,
          fetchResources: fetchResources
      };

  })();