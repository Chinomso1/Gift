import React, { useEffect, useState } from 'react'

const DEFAULT_MESSAGES = [
  "Good morning to my Favourite Human.",
  "Hello my Favorite Chicken.",
  "I hope your day is as lovely as your smile.",
  "You is beautiful + me is cute =Child Beautifully cute💖",
  "Thinking of you (again) Shey ya thinking of me.",
  "Can’t wait to see you soon so i can slap you.",
  "I miss your eyes it be turning me on like Gen Lol😂.",
  "You're my safe place.",
  "But remember I’m proud of you. Always.",
  "Your laugh is my ringtone in my head 😂",
  "It so silly of you to act like you don't miss me ehh.",
  "All Hail The Queen Mother.",
  "I love to kiss you rn but ya so faraway.",
  "You know why ya so fine so you can take my breath away.",
  "Chicken is nice. You are nicer 💘",
  "I don't know how you always make me beg well sha I Love You.",
  "One time i almost died cus you smiled at me lol",
  "Everytime you call me Ode i fall in love with you even more ",
  "Good day babe, M craving you ooo ",
  "Ya so hot that if i near you i'll just melt in your hands ",
  "Babe come lemme lick some of you na  ",
  "My Juju baby ",
  "Your Royal Highness.... ",
  "Lemme ask you something ''Do you love me princess'' ",
  "If you see this one ehh just know say I Love You Sha ",
  "If you see this one just know say your Juju dey work ",
  "Remember when you first talked to me, you have stolen my heart since then ",
  "I think i have found the Love of My Brain ",
  "But why are you always in my dreams, yunno why cus ya the GIRL OF MY DREAMS ",
  "Babe m hungry can you be my lunch ",
  "Ehh i don't want you to know that i always listen to your cute voice ",
  "Ya so sweet that i want to eat you ehhh ya too sweet",
  "You know why ya away tired is because ya always running through my mind."
]

const LS_KEY = 'cute-messages-v1'

export default function App() {
  const [messages, setMessages] = useState(DEFAULT_MESSAGES)
  const [current, setCurrent] = useState(0)
  const [newMsg, setNewMsg] = useState("")
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  // load saved messages
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY)
    if (saved) {
      setMessages(JSON.parse(saved))
    }
  }, [])

  // persist messages
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(messages))
  }, [messages])

  // capture install prompt (Android/Chrome)
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])


  const next = () => setCurrent((i) => (i + 1) % messages.length)
  const shuffle = () => {
    const random = Math.floor(Math.random() * messages.length)
    setCurrent(random)
  }  

  const addMessage = () => {
    const text = newMsg.trim()
    if (!text) return
    if (text.length < 3) {
      alert("Message must be at least 3 characters long 💌")
      return
    }
    if (text.length > 200) {
      alert("Message is too long! Keep it under 200 characters 💌")
      return
    }
    setMessages((arr) => Array.from(new Set([...arr, text])))
    setNewMsg("")
    // Show feedback
    const addBtn = document.querySelector('.btn-add')
    if (addBtn) {
      addBtn.textContent = "Added! 💖"
      setTimeout(() => {
        addBtn.textContent = "Add"
      }, 1500)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addMessage()
    }
  }

  const removeCurrent = () => {
    if (messages.length <= 1) return
    const copy = messages.slice()
    copy.splice(current, 1)
    setMessages(copy)
    setCurrent(0)
  }

  const share = async () => {
    const text = messages[current]
    const shareBtn = document.querySelector('.btn-share')
    let originalText = "Share"
    
    // Show loading state
    if (shareBtn) {
      originalText = shareBtn.textContent
      shareBtn.textContent = "Sharing... 📤"
      shareBtn.disabled = true
    }
    
    try {
      if (navigator.share) {
        await navigator.share({ text })
        // Show success feedback
        if (shareBtn) {
          shareBtn.textContent = "Shared! 💖"
          setTimeout(() => {
            shareBtn.textContent = originalText
            shareBtn.disabled = false
          }, 1500)
        }
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(text)
        if (shareBtn) {
          shareBtn.textContent = "Copied! 📋"
          setTimeout(() => {
            shareBtn.textContent = originalText
            shareBtn.disabled = false
          }, 1500)
        }
        alert("Message copied to clipboard! 💌")
      }
    } catch (error) {
      console.error("Error sharing message:", error)
      
      // Show error feedback
      if (shareBtn) {
        shareBtn.textContent = "Failed! 😢"
        setTimeout(() => {
          shareBtn.textContent = originalText
          shareBtn.disabled = false
        }, 1500)
      }
      
      // Try clipboard as last resort
      try {
        await navigator.clipboard.writeText(text)
        alert("Sharing failed, but message copied to clipboard! 💌")
      } catch {
        alert("Sharing failed. Please copy manually: " + text)
      }
    }
  }

  const install = async () => {
    if (!deferredPrompt) return alert("On iPhone: Share ➜ Add to Home Screen")
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-lg sm:text-xl font-bold">Cute Messages 💌</h1>
        </header>

        <div className="message-display">
          <p className="text-base sm:text-lg leading-relaxed">{messages[current]}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-7 mb-4">
          <button onClick={shuffle} className="btn-random">Random</button>
          <button onClick={next} className="btn-next">Next</button>
          <button onClick={share} className="btn-share">Share</button>
        </div>

        <div className="rounded-xl bg-gray-50 p-3">
          <label className="text-sm font-medium">Add your own:</label>
          <div className="mt-2 flex gap-2">
            <input
              className="flex-1 border rounded-xl px-3 py-2 outline-none focus:ring focus:ring-pink-200 focus:border-pink-300 text-sm"
              placeholder="Type..…"
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyPress={handleKeyPress}
              maxLength={200}
            />
            <button onClick={addMessage} className="btn btn-add">Add</button>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {newMsg.length}/200 characters
          </div>
          <div className="mt-3 flex justify-end">
            <button onClick={removeCurrent} className="text-xs text-red-500 hover:text-red-700">Delete current</button>
          </div>
        </div>

        <footer className="mt-4 sm:mt-6 text-xs text-gray-500 text-center">
          <div className="flex flex-col items-center gap-3">
            <div>Works offline • Add to Home Screen for the full vibe ✨</div>
            <button onClick={install} className="px-3 py-1.5 rounded-xl text-sm bg-pink-500 text-white hover:opacity-90">
              Install
            </button>
          </div>
        </footer>
      </div>

      {/* tiny styles so it looks nice without Tailwind setup */}
      <style>{`
        .btn { background:#111827; color:#fff; padding:.6rem .8rem; border-radius: .8rem; }
        .btn:hover{ opacity:.9 }
        .bg-pink-50{ background:#ffc0cb }
      `}</style>
    </div>
  )
}
