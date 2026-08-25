import { useRef } from 'react'
import styles from './OtpInput.module.css'

export function OtpInput({ length = 6, value, onChange, disabled }) {
  const inputsRef = useRef([])

  const digits = Array.from({ length }, (_, i) => value[i] ?? '')

  function setDigitAt(index, char) {
    const next = digits.slice()
    next[index] = char
    onChange(next.join(''))
  }

  function handleChange(index, e) {
    const raw = e.target.value.replace(/\D/g, '')

    if (raw.length > 1) {
      applyDigits(index, raw)
      return
    }

    setDigitAt(index, raw)

    if (raw && index < length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  function applyDigits(startIndex, rawDigits) {
    const chars = rawDigits.split('').slice(0, length - startIndex)
    const next = digits.slice()
    chars.forEach((char, i) => {
      next[startIndex + i] = char
    })
    onChange(next.join(''))

    const lastFilled = Math.min(startIndex + chars.length, length - 1)
    inputsRef.current[lastFilled]?.focus()
  }

  function handlePaste(index, e) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '')
    if (!pasted) return
    e.preventDefault()
    applyDigits(index, pasted)
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
      setDigitAt(index - 1, '')
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  return (
    <div className={styles.otpInput}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          className={styles.digit}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={length}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(index, e)}
          onPaste={(e) => handlePaste(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
        />
      ))}
    </div>
  )
}
