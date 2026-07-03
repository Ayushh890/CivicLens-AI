import useSpeechRecognition from '../hooks/useSpeechRecognition'

export default function VoiceInput({ onTranscript }) {
  const { isListening, isSupported, transcript, startListening, stopListening } = useSpeechRecognition()

  const toggle = () => {
    if (isListening) {
      stopListening()
      if (transcript) onTranscript?.(transcript)
    } else {
      startListening()
    }
  }

  if (!isSupported) return null

  return (
    <button type="button" onClick={toggle}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        isListening
          ? 'bg-red-600 text-white animate-pulse'
          : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
      }`}>
      <span>{isListening ? '🔴' : '🎤'}</span>
      {isListening ? 'Stop Recording' : 'Voice Input'}
    </button>
  )
}
