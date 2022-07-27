// Initialize new SpeechSynthesisUtterance object
let speech = new SpeechSynthesisUtterance();


// Set Speech Language
speech.lang = "en";

let voices = []; // global array of available voices

const init_voices = () =>{
    let voiceSelect = document.querySelector("#voices");
    voices.forEach((voice, i) => (voiceSelect.options[i] = new Option(voice.name, i)));
}

let init = false;

window.speechSynthesis.onvoiceschanged = () => {
  // Get List of Voices
  voices = window.speechSynthesis.getVoices();

  // Initially set the First Voice in the Array.
  speech.voice = voices[0];

  // Set the Voice Select List. (Set the Index as the value, which we'll use later when the user updates the Voice using the Select Menu.)
  if(init == false){
    init_voices();
    init =  true;
  }

};

document.querySelector("#rate").addEventListener("input", () => {
  // Get rate Value from the input
  const rate = document.querySelector("#rate").value;

  // Set rate property of the SpeechSynthesisUtterance instance
  speech.rate = rate;

  // Update the rate label
  document.querySelector("#rate-label").innerHTML = rate;
});

document.querySelector("#volume").addEventListener("input", () => {
  // Get volume Value from the input
  const volume = document.querySelector("#volume").value;

  // Set volume property of the SpeechSynthesisUtterance instance
  speech.volume = volume;

  // Update the volume label
  document.querySelector("#volume-label").innerHTML = volume;
});

document.querySelector("#pitch").addEventListener("input", () => {
  // Get pitch Value from the input
  const pitch = document.querySelector("#pitch").value;

  // Set pitch property of the SpeechSynthesisUtterance instance
  speech.pitch = pitch;

  // Update the pitch label
  document.querySelector("#pitch-label").innerHTML = pitch;
});




const change_voice = (voice_t) =>{
    //speech.lang = "en-US"
    voices = window.speechSynthesis.getVoices();
    find = false;

    if(speech.voice != null){
        //console.log(speech.voice);
        if(speech.voice.name == voice_t){
            return;
        } 
    }




    for(let i = 0; i < voices.length; ++i){
        if(voices[i].name == voice_t){
            //console.log(voices[i].name + voice_t)
            find = true;
            speech.voice = voices[i];
        }
    }

    if(!find){
        for(let i = 0; i < voices.length; ++i){
            if(voices[i].lang == "en-US"){
                //console.log(voices[i])
                find = true;
                speech.voice = voices[i];
                break;
            }
        }
    }
    
    if (!find){
        console.log("infelizmente n pode encontrar nenhum inglês para o speak");
    }
}

const speak_for_us = (text) =>{
    speech.text = text;
    // Start Speaking
    window.speechSynthesis.speak(speech);
}