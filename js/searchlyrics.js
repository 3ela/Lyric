let favSet = new Set();
let songInfoObj = {};
var songInfo ;

document.addEventListener('submit',function(event){
    event.preventDefault();
    var form = document.getElementById('searchFields');
    var artistName = form.artistName.value;
    var songName = form.songName.value;
    
    FetchLyrics(artistName, songName);  
    saveUserFavs();

});


async function FetchLyrics(artistName ,  songName){
    const apiKey= 'fE1AjxrzOwIHDYb4LOFuP5WgXmeBXppmaDzJstWO2ErTTyCzblPwXgGKbqCadS9j';
    const url='https://orion.apiseeds.com/api/music/lyric';
    var fullurl= url+'/'+artistName+'/'+songName+'?apikey='+apiKey;
    
    let responce = await fetch(fullurl);
    if(responce.status === 404){
        M.toast({html: 'Could not find this lyrics'});
        return 0;
    }else{
        let lyrics = await responce.json();    
        var collabsibleText = lyrics.result.track.text.split(/\n/g,10);
    
        songInfoObj = {
            'artistName':lyrics.result.artist.name,
            'songName':lyrics.result.track.name,
            'collabsibleText': collabsibleText.toString().replace(/,/g,"<br>"),
        }
    
        var lyricsText = lyrics.result.track.text.replace(/\n/g,"<br>");
        songInfo = JSON.stringify(songInfoObj); 
    
        ShowLyrics(lyricsText);
    
    }
}


function ShowLyrics(lyricsText){
    // adding lyrics TEXT to its element
    var lyricsElem = document.getElementsByClassName('lyr-lyrics-text')[0];
    lyricsElem.innerHTML = lyricsText;

    // adding SONG Iformation to its element
    document.getElementById('lyrHeader').classList.add('lyr-header');
    var songInfoElem = document.getElementsByClassName('lyr-song-info')[0];
    songInfoElem.innerHTML = songInfoObj.artistName + ' - ' + songInfoObj.songName;

    //adding the fav icon 
    var favouriteIcon = document.getElementById('favouriteIcon');
    if (favSet.has(songInfo)){
        favouriteIcon.innerHTML = 'star';
    }else  favouriteIcon.innerHTML = 'star_border' ;
}


var favouriteIcon = document.getElementById('favouriteIcon');

favouriteIcon.addEventListener('click', event =>{
    if(favSet.has(songInfo)){
        favouriteIcon.innerHTML = 'star_border' ;
        favSet.delete(songInfo);
        buildFavs();
        M.toast({html: 'Removed from Favourits'});
    }
    else if(!favSet.has(songInfo)){
        favouriteIcon.innerHTML = 'star';
        favSet.add(songInfo);
        addSong(songInfo);
        M.toast({html: 'Added from Favourits'});
    }   
});


//
//
//
//
//Favs Modal
var favouritesTrigger = document.getElementById('favouritesTrigger');

favouritesTrigger.addEventListener('click', function() {
    var modals = document.querySelectorAll('.modal');
    var instances = M.Modal.init(modals,{
        onOpenEnd :console.log(favSet),
    });
  });


function addSong(songInfo){
    var value = JSON.parse(songInfo);
    
    var favouritedSongsElem = document.getElementById('favouritedSongs');
    var favouritedSongsNode  = document.createElement('li'); 
    var deleteIcon = document.createElement('i');
    var goToIcon = document.createElement('i');
    var favouritedcollapsibleHeader = document.createElement('div');
    var favouritedcollapsibleBody = document.createElement('div');
    var collapsibleIcons = document.createElement('div');

    goToIcon.classList.add('material-icons');
    deleteIcon.classList.add('material-icons');
    favouritedcollapsibleHeader.classList.add('collapsible-header');
    favouritedcollapsibleBody.classList.add('collapsible-body','center-align');
    collapsibleIcons.classList.add('lyr-collapsible-icon');

    goToIcon.innerText = 'send';
    deleteIcon.innerText = 'delete';
    favouritedcollapsibleHeader.innerHTML = value.artistName + ' - ' + value.songName ;
    favouritedcollapsibleBody.innerHTML = value.collabsibleText;
    
    favouritedcollapsibleHeader.appendChild(collapsibleIcons);
    collapsibleIcons.appendChild(goToIcon);
    collapsibleIcons.appendChild(deleteIcon);
    favouritedSongsNode.appendChild(favouritedcollapsibleHeader);
    favouritedSongsNode.appendChild(favouritedcollapsibleBody);
    favouritedSongsElem.appendChild(favouritedSongsNode);

    addIconListeners(favouritedcollapsibleHeader,songInfo,value,favouritedSongsElem);
}


function buildFavs(){
    var favouritedSongsElem = document.getElementById('favouritedSongs');
    
    while(favouritedSongsElem.lastChild){
        favouritedSongsElem.removeChild(favouritedSongsElem.lastChild);
    }

    favSet.forEach( value => addSong(value));
}

function addIconListeners(favouritedcollapsibleHeader,songInfo2,value,favouritedSongsElem){

    var thisIcon = favouritedcollapsibleHeader.children[0].children[1];
    var thisText = favouritedcollapsibleHeader.children[0].children[0];
    
    thisIcon.addEventListener('click',event=>{
        favSet.delete(songInfo2);
        buildFavs();
        M.toast({html: 'Removed from Favourits'});
        if(songInfo === songInfo2){favouriteIcon.innerHTML = 'star_border' ;}
    });

    thisText.addEventListener('click',event=>{
        FetchLyrics(value.artistName,value.songName);
        
        var thisModal = document.querySelector('#favourites');
        var myInstance = M.Modal.getInstance(thisModal);
        myInstance.close();

    })

}

//
//
//
//
// Saving the favset to load it for the user

function saveUserFavs(){
    var favList = {};
    let i = 0;
    favSet.forEach(value=>{
        favList = {
            i,
            value,
        }
        i++;
    });
    console.log(favList);
    Favourites = JSON.stringify(favList)
    localStorage.setItem('Favourites', Favourites)
}