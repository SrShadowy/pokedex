const pokemon_num = document.getElementById('pokemon_num');
const pokemon_name = document.getElementById('pokemon_name');
const pokemon_type = document.getElementById('pokemon_type');
const pokemon_sprite = document.getElementById('pokemon');
const menu = document.getElementById('main_menu');
const details = document.getElementById('poke_details');
const seaching = document.getElementById('poke_seaching');
const btn_seaching = document.getElementById('btn_seach');
const audio_confg = document.getElementById('audio');
const submit_input = document.getElementById('pokeNameID');

const poke_abilit  = document.getElementById('poke_abilit');
const poke_width   = document.getElementById('poke_width');
const poke_exp     = document.getElementById('poke_exp');
const poke_height  = document.getElementById('poke_height');

let voice_default = "Microsoft Eric Online (Natural) - English (United States)";
const btn_config_audio = document.getElementById('config_audio');

btn_config_audio.addEventListener('click', () => {

    if(  audio_confg.style.display ==  "none"){
        details.style.display = "none";
        seaching.style.display = "none";
        audio_confg.style.display = "block";
    }else{
        menu.style.display = "none";
        audio_confg.style.display = "none";
    }

})


menu.style.display = "none";
details.style.display = "none";
seaching.style.display = "none";
let pokemon_id = 25;
let pokemon_data_sprite;
let back_state = 0;

const get_pokemon_name = () =>{
    let NameOrID = document.getElementById('pokeNameID');
    return NameOrID.value.toLowerCase();
}
const check_is_female = () =>{
    let Female = document.getElementById('Gender');
    return Female.classList.contains('active');
}



const check_is_shiny = () =>{
    let shinyCheck = document.getElementById('Shiny');
    return shinyCheck.classList.contains('active');
}

const clear_checks = () =>{
    let shinyCheck = document.getElementById('Shiny');
    let Female = document.getElementById('Gender');
    shinyCheck.classList.remove('active');
    Female.classList.remove('active');
}

const clear_name = () =>{
    document.getElementById('pokeNameID').value = "";
}

document.querySelector("#voices").addEventListener("change", () => {
    // On Voice change, use the value of the select menu (which is the index of the voice in the global voice array)
    //console.log(voices[document.querySelector("#voices").value]);
    voice_default = voices[document.querySelector("#voices").value].name;
    speech.voice = voices[document.querySelector("#voices").value];
});
  


const reset_propriety = () =>{
    clear_checks();
    clear_name();
    back_state = 0;
}

const fetchPokemon = async (pokemon) =>{
    const API_responce = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    if(API_responce.status == 404){
        //console.log("teste")
        return;
    }
  
    const data = await API_responce.json();

    return data;
}


function get_pokemon_img(data, gender, shiny, generation){
    sprite_list = data.sprites;
    pokemon_data_sprite = sprite_list;
    artwork = sprite_list.other.home.front_default;
    if  (artwork == undefined) {
        artwork = sprite_list.other.official-artwork.front_default;
    }
    sprite = sprite_list.front_default;

    //console.log(gender);
    //console.log(shiny);

    if(generation == undefined){
        if(sprite_list.versions['generation-v']['black-white'].animated){
            pokemon_data_sprite =  sprite_list.versions['generation-v']['black-white'].animated;

            if(gender == 'f'){
                if(shiny){
                    
                    return  pokemon_data_sprite.front_shiny_female? pokemon_data_sprite.front_shiny_female : "/res/question.gif";
                }
                
                return  pokemon_data_sprite.front_female? pokemon_data_sprite.front_female : "/res/question.gif";
         
            }
            if(shiny){
                return pokemon_data_sprite.front_shiny;
            }
           
            return pokemon_data_sprite.front_default;
        }

    }

   return sprite;


}

const render_pokemon = async (pokemon, gender, shiny) =>{
   const data = await fetchPokemon(pokemon);

   if(data == undefined || data.id == undefined){
    pokemon_num.innerText = 'FF';
    pokemon_name.innerText = 'Not found';
    pokemon_type.innerText = "NONE";
    pokemon_sprite.src = "/res/question.gif";
    return;
   }

  

   pokemon_id = data.id;
   pokemon_num.innerText = pokemon_id;
   pokemon_name.innerText = data.name;
   tp = data.types;
   poke_type = "";


   for(let i = 0; i < tp.length; i++){
    if(poke_type.length > 0)
        poke_type += '/';
    
    poke_type += tp[i].type.name;
   }

   pokemon_type.innerText = poke_type;
   spt = get_pokemon_img(data, gender, shiny);


   height_m = data.height.toString();
   if(height_m.length == 1){
    height_m = "0." + data.height + 'm';
   }else{

    part =  height_m.charAt(height_m.length-1);
    partf = height_m.substring(0, height_m.length - 1);
    height_m = partf + '.' + part + 'm';
   }
   poke_height.innerText = height_m;
   //weight

   weight_m =  data.weight.toString() ;

   if(weight_m.length == 1){
    weight_m = "0." + data.weight + "kg";
   }else{
    part =  weight_m.charAt(weight_m.length-1);
    partf = weight_m.substring(0, weight_m.length - 1);
    
    weight_m = partf+ "." + part + "kg";
   }
   poke_width.innerText = weight_m;
   poke_exp.innerText = data.base_experience;


   poke_abilities = "";
   for (let i = 0; i < data.abilities.length ; ++i){
    if(poke_abilities.length > 0)
        poke_abilities += '/';

        poke_abilities +=  data.abilities[i].ability.name;
   }

   poke_abilit.innerText = poke_abilities;

   //console.log(spt);
   pokemon_sprite.src = spt; //data.sprites.front_default;

   window.speechSynthesis.cancel();
   //change_voice();

   let text_for_speak = data.name + ", Pokémon " + poke_type + " type, they can reach " + height_m.substring(0, height_m.length-1) + "meters and weigh about " + weight_m; 
   text_for_speak = text_for_speak.replace('/'," and ");
   change_voice(voice_default);
   speak_for_us(text_for_speak);




}



const next_pokemon_id = () =>{
   pokemon_id ++;
   render_pokemon(pokemon_id);
   reset_propriety();
}
const prev_pokemon_id = () =>{
    pokemon_id --;
    render_pokemon(pokemon_id);
    reset_propriety();
}
const show_menu = () =>{
    if (menu.style.display == "none") {
        menu.style.display = "block";
        audio_confg.style.display = "none";
        seaching.style.display = "block";
    }else{
        menu.style.display = "none";
        audio_confg.style.display = "none";
        seaching.style.display = "none";
        details.style.display = "none";
    };
}

const show_details = () =>{
    if (menu.style.display == "none") {
        menu.style.display = "block";
        audio_confg.style.display = "none";
        details.style.display = "block";
    }else{
        menu.style.display = "none";
        audio_confg.style.display = "none";
        seaching.style.display = "none";
        details.style.display = "none";
    };
}
/*
menu.style.display = "none";
details.style.display = "none";
seaching.style.display = "none";
*/

const seaching_by_menu = () =>{

    let NameID = get_pokemon_name();
    let Gender = undefined;
    let Shiny = false;

    


    if(check_is_female())
        Gender = 'F';
    if(check_is_shiny()){
        Shiny = true;
    }
    
    if(NameID != '' && NameID != undefined){
        render_pokemon(NameID ,Gender, Shiny );
    }
    
    show_menu();

}



submit_input.addEventListener('keydown', (e)=>{
    if(e.key == 'Enter'){
        seaching_by_menu();
    }

});

const seeBackUI = () =>{
    
    spt = "";
    back_state ++;
    if(back_state > 1)
        back_state = 0;

    let Gender = check_is_female();
    let Shiny = check_is_shiny();

    
    if ( Gender && Shiny ){

        switch(back_state){
            case 0:
                spt = pokemon_data_sprite.front_shiny_female;
                break;
            case 1:
                spt = pokemon_data_sprite.back_shiny_female;
                break;
        }

    }else if (Gender ){

        switch(back_state){
            case 0:
                spt = pokemon_data_sprite.front_female;
                break;
            case 1:
                spt = pokemon_data_sprite.back_female;
                break;
        }

    }else if (Shiny){

        switch(back_state){
            case 0:
                spt = pokemon_data_sprite.front_shiny;
                break;
            case 1:
                spt = pokemon_data_sprite.back_shiny;
                break;
        }

    }else{

        switch(back_state){
            case 0:
                spt = pokemon_data_sprite.front_default;
                break;
            case 1:
                spt = pokemon_data_sprite.back_default;
                break;
        }
    }


    if(spt == null || spt == undefined)
        spt = "/res/question.gif";

    pokemon_sprite.src = spt;
}

const openURL= (url) =>{
    window.open(url, '_blank');
}

const toggle = (self) => {
    self.classList.toggle("active");
}


pokemon_sprite.addEventListener("load", ()=>{

    //console.log("Completo");
});



change_voice(voice_default);
render_pokemon(pokemon_id);
