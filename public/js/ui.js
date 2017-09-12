  var TriExpress = (function() {

      var carousel = $(".carousel");
      var getFilesApi = "/files";
      var currentResources = undefined;
      var currentResourceIndex = 0;
      var maximumNotation = 5;

      var _callGetFilesApi = function() {
          $.ajax({
              url: getFilesApi,
              data: {}
          }).done(function(data) {
              currentResources = data;
              console.log(currentResources.resources.length + " resources retrieved");

              $(".info-images-count").text(currentResources.resources.length);
              $(".info-images-rated").text(0);
              $(".info-images-deleted").text(0);
              $(".info-images-remaining").text(currentResources.resources.length);

              _updateDisplayedImages();
          });
      };

      var _updateRatingStars = function() {
          var rating = currentResources.resources[currentResourceIndex].rating;
          $("#stars img").each(function(index, img) {
              console.log(index, rating);
              $(img).toggleClass("inactive", index >= rating);
          });
      }

      var _updateDisplayedImages = function() {
          carousel.empty();

          if (currentResourceIndex > 0) {
              $("<img>")
                  .attr("src", currentResources.resources[currentResourceIndex - 1].path)
                  .addClass("previous")
                  .appendTo(carousel);
          }

          $("<img>")
              .attr("src", currentResources.resources[currentResourceIndex].path)
              .addClass("current")
              .toggleClass("removed", currentResources.resources[currentResourceIndex].remove !== undefined && currentResources.resources[currentResourceIndex].remove)
              .appendTo(carousel);

          if (currentResourceIndex + 1 < currentResources.resources.length) {
              $("<img>").attr("src", currentResources.resources[currentResourceIndex + 1].path)
                  .addClass("next")
                  .appendTo(carousel);
          }


          $("img.previous").on("click", renderPreviousImage);
          $("img.next").on("click", renderNextImage);

          _updateRatingStars();
      }

      var renderNextImage = function() {
          if (currentResourceIndex + 1 < currentResources.resources.length) {
              currentResourceIndex++;
          }
          _updateDisplayedImages();
      }

      var renderPreviousImage = function() {
          if (currentResourceIndex > 0) {
              currentResourceIndex--;
          }
          _updateDisplayedImages();
      }

      var updateRating = function(delta) {
          if ((delta > 0 && currentResources.resources[currentResourceIndex].rating < maximumNotation) ||
              (delta < 0 && currentResources.resources[currentResourceIndex].rating > 0)) {
              currentResources.resources[currentResourceIndex].rating += delta;

              _updateRatingStars();
          }
      }

      var removeFile = function() {
          currentResources.resources[currentResourceIndex].remove =
              currentResources.resources[currentResourceIndex].remove == undefined ? true : !currentResources.resources[currentResourceIndex].remove;
          $("img.current").toggleClass("removed", currentResources.resources[currentResourceIndex].remove)
      }

      var fetchResources = function() {
          _callGetFilesApi();
      };

      var init = function() {
          $(window).keyup(function(e) {
              if (e.keyCode == 37) {
                  renderPreviousImage();
              } else if (e.keyCode == 39) {
                  renderNextImage();
              } else if (e.keyCode == 38) {
                  updateRating(1);
              } else if (e.keyCode == 40) {
                  updateRating(-1);
              } else if (e.keyCode == 32) {
                  removeFile();
              }
          });
      }

      return {
          init: init,
          fetchResources: fetchResources,
          renderNextImage: renderNextImage,
          renderPreviousImage: renderPreviousImage,
          updateRating: updateRating,
          removeFile: removeFile
      };

  })();