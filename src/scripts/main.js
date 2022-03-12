import { alphabetMap } from "./alphabetMap.js";

const voices = speechSynthesis.getVoices();
const primaryVoice = voices.find((v) => v.lang === "en-US");

const createSpeaking = (text, onEnd, onError) => {
  if (!window.speechSynthesis) {
    alert("TTS가 불가능한 기기입니다");
  }

  let speaking = new SpeechSynthesisUtterance(text);
  speaking.onEnd = onEnd;
  speaking.onerror = onError;
  // speaking.lang = "ja";
  speaking.lang = "en-US";
  speaking.voice = primaryVoice;
  return speaking;
};

const startSpeaking = (speaking) => {
  window.speechSynthesis.speak(speaking);
};
const pauseSpeaking = (speaking) => {
  window.speechSynthesis.pause(speaking);
};

const resumeSpeaking = (speaking) => {
  window.speechSynthesis.resume(speaking);
};

const stopSpeaking = (speaking) => {
  window.speechSynthesis.cancel(speaking);
};

let globalSpeaking = null;

document.addEventListener("DOMContentLoaded", function () {
  const ttsInputElement = document.getElementById("tts-input");
  const convertedTextElement = document.getElementById("result");
  const ttsStartElement = document.getElementById("tts-start");


  const convertHangulToAlphabets = (hangulText) => {
    const convertedText = Array.from(hangulText)
      .map((letter) => {
        return alphabetMap[letter] || letter;
      })
      .join("");

    return convertedText;
  };

  const handleInputChange = (e) => {
    const convertedText = convertHangulToAlphabets(ttsInputElement.value);
    convertedTextElement.value = convertedText;
  };

  const handleStartClick = () => {
    if (globalSpeaking) {
      stopSpeaking(globalSpeaking);
    }

    const convertedText = convertHangulToAlphabets(ttsInputElement.value);
    convertedTextElement.value = convertedText;
    globalSpeaking = createSpeaking(
      convertedText,
      () => {},
      (error) => {
        // alert("오류가 발생했습니다. 콘솔을 확인하세요");
        console.log(error);
      }
    );

    startSpeaking(globalSpeaking);
  };

  ttsInputElement.onkeydown = handleInputChange;
  ttsStartElement.onclick = handleStartClick;
});
