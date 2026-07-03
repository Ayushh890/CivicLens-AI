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
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform active:scale-95 ${
        isListening
          ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-200 animate-pulse-glow'
          : 'bg-surface-100 hover:bg-surface-200 text-surface-600 border border-surface-200 hover:border-civic-300'
      }`}>
      <span className="text-lg">{isListening ? '🔴' : '🎤'}</span>
      {isListening ? 'Stop Recording' : 'Voice Input'}
    </button>
  )
}
