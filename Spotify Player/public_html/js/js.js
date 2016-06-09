function request (url,action) {
  var respo;
  $.ajax({
    url: url  
  }).success(function(response){
      if(action === "configPlayer "){
          configPlayer (response,0);           
      }else if (action === "load_artist_information"){
          load_artist_information(response);
      }else if (action === "artists_album"){
          load_artists_albums(response);
      }else if (action === "popularity"){
          respo = response;
      }
      
  }).error(function (jqXHR,textStatus,errorThrown){
    alert("ERROR: "+jqXHR+ " "+textStatus+" "+errorThrown);
  });
}

function configPlayer (response,id){
 
    var song_title = response["tracks"]["items"][id].name;
    var artist_name = response["tracks"]["items"][id]["artists"][0].name;
    var artist_id =  response["tracks"]["items"][id]["artists"][0].id;
    var cover_image = response["tracks"]["items"][id]["album"]["images"][0].url;
    var preview_url = response["tracks"]["items"][id].preview_url;
    
    $(".title").text(song_title);
    $(".author").html('<a id="'+artist_id+'" href="#">'+artist_name+'</a>');    
    $(".cover img").attr("src",cover_image);
    $("audio").attr("src",preview_url);
   
   
   //animate bar
    $('audio').on('timeupdate', printTime);
    
    //When audio finish change icon to play
    $('audio').bind("ended",function (){
        $(".btn-play").removeClass("playing");
    });
    
    $(".author a").click(function (e){
       e.preventDefault();
       var id_artists = $(this).attr("id");
       var url = "https://api.spotify.com/v1/artists/"+id_artists;
       request(url,"load_artist_information");
    });
    //I use the some response, i dont need to do a new ajax request again
    $('.btn-primary').click(function (){
               load_more_tracks(response);     
    });


}
function printTime () {
  var current = $('audio').prop('currentTime');
  $("progress").attr("value",current);
}
function load_artist_information (response){
    $(".modal-body").empty();
    var id = response.id;
    var name = response.name;
    var image =response["images"][0].url;
    var genres = response["genres"];
    var followers = response["followers"].total;
    var popularity = response.popularity;
    $(".modal-body").append('<div class="media">'+
                                '<div class="media-left">'+
                                  '<a href="#">'+
                                    '<img class="media-object" src="'+image+'" alt="...">'+
                                  '</a>'+
                                '</div>'+
                                '<div class="media-body">'+
                                  '<h2 class="media-heading">'+name+'</h2>'+
                                  '<ul class= "list-unstyled">'+
                                    '<li><strong>Genres: </strong></li>'+
                                    '<li>'+genres+'</li>'+
                                    '<li><strong>Followers: </strong></li>'+
                                    '<li> '+followers+'</li>'+
                                    '<li><strong>Popularity: </strong></li>'+
                                    '<li>'+popularity+'</li>'+
                                  '</ul>'+
                                   '<button id="'+id+'" type="button" class="btn btn-default btn-primary pull-right">More '+name+'\'s albums</button>'+
                                '</div>'+
                              '</div>');
    $('#modal_artist').modal("show"); 
    $(".media-body button").click(function (e){
        var id = $(this).attr("id");
        var url ='https://api.spotify.com/v1/artists/'+id+'/albums';
        request(url,"artists_album");
    });
        
    
   
}
function load_more_tracks (response){
    var id_modal ="#modal_artist";
    var limit = response["tracks"]["items"].length;
    var html='<table class="table">'+
                        '<thead>'+
                            '<tr>'+
                                '<th colspan="5" class="text-center"><h2>More results</h2></th>'+
                            '</tr>'+
                        '</thead>'+
                        '<tbody>'+
                            '<tr>'+
                                '<th class="text-center">Image</th><th class="text-center">Album Name</th><th class="text-center">Track Name</th><th class="text-center">Artist Name</th><th class="text-center">Preview</th>'+
                            '</tr>';
     for (var i=0; i< limit; i++){
          var preview_url = response["tracks"]["items"][i].preview_url;
          var image = response["tracks"]["items"][i]["album"].images[0].url;
          var album_name = response["tracks"]["items"][i]["album"].name;
          var track_name = response["tracks"]["items"][i].name;
          var artist_name = response["tracks"]["items"][i]["artists"][0].name;
         html = html +'<tr id="'+i+'">'+
                                '<td class="text-center"><img src ="'+image+'" ></td>'+
                                '<td class="text-center">'+album_name+'</td>'+
                                '<td class="text-center">'+track_name+'</td>'+
                                '<td class="text-center">'+artist_name+'</td>'+
                                '<td class="text-center"><a target="_blank" href="'+preview_url+'"><span class="glyphicon glyphicon-music"></span></a></td>'+
                          '</tr>';  
      }
      html = html + '</tbody>'+
                    '</table>';
   
      $(id_modal+" .modal-body").empty();
      $(id_modal+" .modal-body").append(html);
      $(id_modal).modal('show');
      
      //Onclick  preview
      
      $(id_modal +" a").click(function (e){
          e.preventDefault();
          var n = $(this).parents('tr').attr("id");
          configPlayer (response,n);
          $(id_modal).modal('hide');
          if ( $(".btn-play").hasClass("playing")){          
            $("audio").trigger("pause");
            $(".btn-play").removeClass("playing");
            $("progress").attr("value",0);
           }
      });
}
function load_artists_albums(response){
    var limit = response["items"].length;
    var album_ids = [];
    var html='<table class="table">'+
                        '<thead>'+
                            '<tr>'+
                                '<th colspan="5" class="text-center"><h2>More results</h2></th>'+
                            '</tr>'+
                        '</thead>'+
                        '<tbody>'+
                            '<tr>'+
                                '<th class="text-center">Image</th><th class="text-center">Album Name</th><th class="text-center">Popularity</th>'+
                            '</tr>';
     for (var i=0; i< limit; i++){
          var id_album = response["items"][i].id;
          var image = response["items"][i].images[0].url;
          var album_name = response["items"][i].name;
         html = html +'<tr id="'+i+'">'+
                                '<td class="text-center"><img src ="'+image+'" ></td>'+
                                '<td class="text-center">'+album_name+'</td>'+ 
                                '<td class="text-center">'+album_name+'</td>'+ 
                          '</tr>';
         album_ids.push(id_album);
      }
      html = html + '</tbody>'+
                    '</table>';
      $('.modal-body').append(html);
}

