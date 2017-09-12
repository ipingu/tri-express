  var TriExpress = (function() {

      var carousel = $(".carousel");
      var getFilesApi = "/files";
      var currentResources = undefined;
      var currentResourceIndex = 0;
      var maximumNotation = 5;
      var removedImagesCount = 0;
      var ratedImagesCount = 0;
      var totalImagesCount = 0;

      var _callGetFilesApi = function() {
          $.ajax({
              url: getFilesApi,
              data: {}
          }).done(function(data) {
              currentResources = data;

              totalImagesCount = currentResources.resources.length;
              removedImagesCount = 0;
              ratedImagesCount = 0;

              _updateCollectionStatus();
              _updateDisplayedImages();
          });
      };

      var _updateCollectionStatus = function() {
          $(".info-images-count").text(totalImagesCount);
          $(".info-images-rated").text(ratedImagesCount);
          $(".info-images-deleted").text(removedImagesCount);
          $(".info-images-remaining").text(totalImagesCount - removedImagesCount - ratedImagesCount);
      }

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

              if (currentResources.resources[currentResourceIndex].rating == 0) {
                  ratedImagesCount++;
              } else if (currentResources.resources[currentResourceIndex].rating + delta == 0) {
                  ratedImagesCount--;
              }

              currentResources.resources[currentResourceIndex].rating += delta;



              _updateRatingStars();
              _updateCollectionStatus();
          }
      }

      var removeFile = function() {
          if (currentResources.resources[currentResourceIndex].remove) {
              removedImagesCount--;
          } else {
              removedImagesCount++;

              if (currentResources.resources[currentResourceIndex].rating > 0) {
                  currentResources.resources[currentResourceIndex].rating = 0;
                  ratedImagesCount--;
              }
          }

          currentResources.resources[currentResourceIndex].remove = !currentResources.resources[currentResourceIndex].remove;
          $("img.current").toggleClass("removed", currentResources.resources[currentResourceIndex].remove);

          _updateCollectionStatus();
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